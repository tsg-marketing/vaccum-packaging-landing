import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получает список товаров из базы данных
    Args: event с httpMethod и queryStringParameters, context с request_id
    Returns: HTTP response со списком товаров
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        dsn = os.environ.get('DATABASE_URL')
        if not dsn:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'DATABASE_URL not configured'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(dsn)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        try:
            query_params = event.get('queryStringParameters', {}) or {}
            categories = query_params.get('categories', '290,291,292,294')
            category_list = [int(c.strip()) for c in categories.split(',')]
            
            placeholders = ','.join(['%s'] * len(category_list))
            query = f"SELECT id, external_id, name, price, image_url, category_id, specifications FROM products WHERE category_id IN ({placeholders}) ORDER BY name"
            
            cur.execute(query, category_list)
            products = cur.fetchall()
            
            products_list = []
            for product in products:
                products_list.append({
                    'id': product['id'],
                    'external_id': product['external_id'],
                    'name': product['name'],
                    'price': float(product['price']),
                    'image_url': product['image_url'],
                    'category_id': product['category_id'],
                    'specifications': product['specifications'] if product['specifications'] else {}
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'products': products_list}),
                'isBase64Encoded': False
            }
            
        finally:
            cur.close()
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }