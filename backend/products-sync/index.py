import json
import os
import urllib.request
import xml.etree.ElementTree as ET
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import execute_values

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Синхронизирует товары из XML фида в базу данных
    Args: event с httpMethod, context с request_id
    Returns: HTTP response с результатом синхронизации
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        dsn = os.environ.get('DATABASE_URL')
        if not dsn:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'DATABASE_URL not configured'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(dsn)
        cur = conn.cursor()
        
        log_id = None
        
        try:
            cur.execute("INSERT INTO feed_sync_log (status) VALUES ('running') RETURNING id")
            log_id = cur.fetchone()[0]
            conn.commit()
            
            xml_url = 'https://t-sib.ru/bitrix/catalog_export/export_Vvf.xml'
            
            with urllib.request.urlopen(xml_url, timeout=30) as response:
                xml_data = response.read()
            
            root = ET.fromstring(xml_data)
            
            target_categories = {290, 291, 292, 294}
            products_data = []
            
            for offer in root.findall('.//offer'):
                category_elem = offer.find('categoryId')
                if category_elem is not None:
                    category_id = int(category_elem.text)
                    
                    if category_id in target_categories:
                        external_id = offer.get('id')
                        name_elem = offer.find('name')
                        price_elem = offer.find('price')
                        picture_elem = offer.find('picture')
                        
                        if name_elem is not None and price_elem is not None:
                            name = name_elem.text
                            price = float(price_elem.text)
                            image_url = picture_elem.text if picture_elem is not None else None
                            
                            specifications = {}
                            for param in offer.findall('param'):
                                param_name = param.get('name')
                                if param_name and param_name != 'Картинки товара' and param.text:
                                    unit = param.get('unit')
                                    if unit:
                                        specifications[param_name] = f"{param.text} {unit}"
                                    else:
                                        specifications[param_name] = param.text
                            
                            specs_json = json.dumps(specifications, ensure_ascii=False) if specifications else None
                            
                            products_data.append((external_id, name, price, image_url, category_id, specs_json))
            
            if products_data:
                execute_values(
                    cur,
                    """
                    INSERT INTO products (external_id, name, price, image_url, category_id, specifications, updated_at)
                    VALUES %s
                    ON CONFLICT (external_id) 
                    DO UPDATE SET 
                        name = EXCLUDED.name,
                        price = EXCLUDED.price,
                        image_url = EXCLUDED.image_url,
                        category_id = EXCLUDED.category_id,
                        specifications = EXCLUDED.specifications,
                        updated_at = CURRENT_TIMESTAMP
                    """,
                    products_data,
                    template="(%s, %s, %s, %s, %s, %s::jsonb, CURRENT_TIMESTAMP)"
                )
            
            cur.execute(
                "UPDATE feed_sync_log SET sync_completed_at = CURRENT_TIMESTAMP, products_count = %s, status = 'completed' WHERE id = %s",
                (len(products_data), log_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'status': 'success',
                    'products_synced': len(products_data),
                    'categories': list(target_categories)
                }),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            if log_id:
                cur.execute(
                    "UPDATE feed_sync_log SET status = 'failed', error_message = %s WHERE id = %s",
                    (str(e), log_id)
                )
                conn.commit()
            
            cur.close()
            conn.close()
            raise
        
        finally:
            if cur:
                cur.close()
            if conn:
                conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }