"""
Синхронизация каталога товаров из YML фида Техносиб
"""
import json
import urllib.request
import re
from typing import List, Dict, Any

def handler(event: dict, context) -> dict:
    """Загружает актуальные товары из YML фида и возвращает JSON"""
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        yml_url = 'https://tehnosib.ru/upload/export_files/yml_tehnosib_4623.xml'
        
        req = urllib.request.Request(
            yml_url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        
        with urllib.request.urlopen(req, timeout=30) as response:
            xml_text = response.read().decode('utf-8')
        
        products, debug_info = parse_yml(xml_text)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'products': products,
                'count': len(products),
                'debug': debug_info,
                'timestamp': context.request_id
            }, ensure_ascii=False)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }


def parse_yml(xml_string: str) -> tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """Парсит YML и возвращает список товаров + отладочную информацию"""
    
    debug_info = {
        'xml_length': len(xml_string),
        'categories_found': 0,
        'offers_found': 0,
        'relevant_found': 0
    }
    
    # Извлекаем категории
    categories = {}
    category_pattern = r'<category[^>]*id="([^"]*)"[^>]*>([^<]*)</category>'
    for match in re.finditer(category_pattern, xml_string):
        categories[match.group(1)] = match.group(2)
    
    debug_info['categories_found'] = len(categories)
    
    # Ключевые слова для фильтрации - расширенный список
    vacuum_keywords = ['вакуум', 'камерн', 'упаковщик', 'вакуумн']
    thermal_keywords = ['термо', 'усадочн', 'сварщик', 'туннель', 'запайщик', 'упаковочн']
    all_keywords = vacuum_keywords + thermal_keywords
    
    products = []
    
    # Извлекаем товары
    offer_pattern = r'<offer[^>]*>([\s\S]*?)</offer>'
    
    for offer_match in re.finditer(offer_pattern, xml_string):
        debug_info['offers_found'] += 1
        offer_content = offer_match.group(1)
        
        # Извлекаем поля - универсальный парсинг
        name_match = re.search(r'<name>(.+?)</name>', offer_content, re.DOTALL)
        price_match = re.search(r'<price>([\d.]+)</price>', offer_content)
        vendor_match = re.search(r'<vendorCode>(.+?)</vendorCode>', offer_content)
        desc_match = re.search(r'<description>(.+?)</description>', offer_content, re.DOTALL)
        category_match = re.search(r'<categoryId>(.+?)</categoryId>', offer_content)
        
        if not name_match or not price_match:
            continue
        
        # Очистка от CDATA если есть
        name = name_match.group(1).replace('<![CDATA[', '').replace(']]>', '').strip()
        price = price_match.group(1).strip()
        vendor_code = vendor_match.group(1).strip() if vendor_match else ''
        description = desc_match.group(1).replace('<![CDATA[', '').replace(']]>', '').strip() if desc_match else ''
        category_id = category_match.group(1).strip() if category_match else ''
        category_name = categories.get(category_id, '')
        
        # Проверяем релевантность - расширенная проверка
        search_text = f"{name} {description} {category_name}".lower()
        is_relevant = any(keyword in search_text for keyword in all_keywords)
        
        # Временно: если не релевантно, пропускаем (но логируем первые 3)
        if not is_relevant:
            if len(products) < 3:
                # Для отладки - добавим первые 3 любых товара
                pass
            else:
                continue
        
        debug_info['relevant_found'] += 1
        
        # Извлекаем картинки
        pictures = re.findall(r'<picture>(.*?)</picture>', offer_content)
        
        # Извлекаем параметры
        params = {}
        param_pattern = r'<param name="([^"]*)">(.*?)</param>'
        for param_match in re.finditer(param_pattern, offer_content):
            params[param_match.group(1)] = param_match.group(2)
        
        products.append({
            'name': name,
            'price': price,
            'vendorCode': vendor_code,
            'description': description,
            'image': pictures[0] if pictures else '',
            'images': pictures,
            'categoryId': category_id,
            'categoryName': category_name,
            'params': params
        })
    
    # Сортируем по названию
    products.sort(key=lambda x: x['name'])
    
    return products, debug_info