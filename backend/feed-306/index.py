import json
import os
import xml.etree.ElementTree as ET
from xml.dom import minidom
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor


CATEGORY_NAME = "Упаковочное оборудование"


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Возвращает YML-фид товаров категории 306 (Яндекс.Маркет формат).
    Включает только товары у которых заполнены description и picture.
    Обновляется автоматически при синхронизации товаров с сайтом.
    """
    method: str = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cur.execute(
            """
            SELECT id, external_id, name, price, image_url, category_id, specifications, description
            FROM products
            WHERE category_id = 306
              AND description IS NOT NULL AND description != ''
              AND image_url IS NOT NULL AND image_url != ''
            ORDER BY name
            """
        )
        products = cur.fetchall()
    finally:
        cur.close()
        conn.close()

    yml = ET.Element('yml_catalog', date=_now())
    shop = ET.SubElement(yml, 'shop')

    ET.SubElement(shop, 'name').text = 'Техно-Сиб'
    ET.SubElement(shop, 'company').text = 'Техно-Сиб'
    ET.SubElement(shop, 'url').text = 'https://t-sib.ru'

    currencies = ET.SubElement(shop, 'currencies')
    ET.SubElement(currencies, 'currency', id='RUR', rate='1')

    categories_el = ET.SubElement(shop, 'categories')
    ET.SubElement(categories_el, 'category', id='306').text = CATEGORY_NAME

    offers = ET.SubElement(shop, 'offers')
    for p in products:
        offer_id = str(p['external_id'] or p['id'])
        offer = ET.SubElement(offers, 'offer', id=offer_id, available='true')
        ET.SubElement(offer, 'url').text = f"https://t-sib.ru/catalog/product/{offer_id}/"
        ET.SubElement(offer, 'price').text = str(int(float(p['price'])))
        ET.SubElement(offer, 'currencyId').text = 'RUR'
        ET.SubElement(offer, 'categoryId').text = '306'
        clean_url = p['image_url'].replace(' ', '%20')
        ET.SubElement(offer, 'picture').text = clean_url
        ET.SubElement(offer, 'name').text = p['name']
        ET.SubElement(offer, 'description').text = p['description']

        specs = p['specifications']
        if specs:
            if isinstance(specs, str):
                specs = json.loads(specs)
            for param_name, param_value in specs.items():
                param_el = ET.SubElement(offer, 'param', name=param_name)
                param_el.text = str(param_value)

    raw_xml = ET.tostring(yml, encoding='unicode', xml_declaration=False)
    pretty = minidom.parseString(raw_xml).toprettyxml(indent='  ', encoding='UTF-8').decode('utf-8')
    pretty = '\n'.join(pretty.split('\n')[1:])

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/xml; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
        },
        'body': pretty,
        'isBase64Encoded': False,
    }


def _now() -> str:
    from datetime import datetime
    return datetime.utcnow().strftime('%Y-%m-%d %H:%M')
