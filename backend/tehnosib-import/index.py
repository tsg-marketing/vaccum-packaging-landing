import json
import urllib.request
import xml.etree.ElementTree as ET
from typing import List, Dict, Any


def handler(event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Загружает YML фид от Техносиб и извлекает товары для вакуумной и термоупаковки
    """
    
    yml_url = "https://tehnosib.ru/upload/export_files/yml_tehnosib_4623.xml"
    
    try:
        # Загружаем XML фид
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        req = urllib.request.Request(yml_url, headers=headers)
        
        with urllib.request.urlopen(req, timeout=30) as response:
            xml_data = response.read()
        
        # Парсим XML
        root = ET.fromstring(xml_data)
        
        # Находим shop элемент
        shop = root.find('.//shop')
        if shop is None:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'Shop element not found in XML'}, ensure_ascii=False)
            }
        
        # Извлекаем категории
        categories = {}
        categories_elem = shop.find('categories')
        if categories_elem is not None:
            for category in categories_elem.findall('category'):
                cat_id = category.get('id')
                cat_name = category.text
                if cat_id and cat_name:
                    categories[cat_id] = cat_name.lower()
        
        # Ключевые слова для фильтрации
        vacuum_keywords = [
            'вакуум', 'вакуумный', 'вакуумная', 'вакуумные',
            'камерный', 'камерная', 'камерные'
        ]
        
        thermal_keywords = [
            'термо', 'термоупак', 'термоусад', 'усадочн',
            'l-сварщик', 'l сварщик', 'сварщик'
        ]
        
        # Объединяем все ключевые слова
        all_keywords = vacuum_keywords + thermal_keywords
        
        # Извлекаем товары
        products = []
        offers_elem = shop.find('offers')
        
        if offers_elem is not None:
            for offer in offers_elem.findall('offer'):
                # Извлекаем данные товара
                name_elem = offer.find('name')
                price_elem = offer.find('price')
                vendor_code_elem = offer.find('vendorCode')
                description_elem = offer.find('description')
                category_id_elem = offer.find('categoryId')
                
                if name_elem is None or price_elem is None:
                    continue
                
                name = name_elem.text or ''
                price = price_elem.text or '0'
                vendor_code = vendor_code_elem.text if vendor_code_elem is not None else ''
                description = description_elem.text if description_elem is not None else ''
                category_id = category_id_elem.text if category_id_elem is not None else ''
                
                # Получаем название категории
                category_name = categories.get(category_id, '').lower()
                
                # Проверяем, относится ли товар к вакуумной или термоупаковке
                search_text = f"{name} {description} {category_name}".lower()
                
                is_relevant = any(keyword in search_text for keyword in all_keywords)
                
                if is_relevant:
                    # Извлекаем картинки
                    pictures = []
                    for picture in offer.findall('picture'):
                        if picture.text:
                            pictures.append(picture.text)
                    
                    # Извлекаем параметры (дополнительно)
                    params = {}
                    for param in offer.findall('param'):
                        param_name = param.get('name')
                        param_value = param.text
                        if param_name and param_value:
                            params[param_name] = param_value
                    
                    product = {
                        'name': name,
                        'price': price,
                        'vendorCode': vendor_code,
                        'description': description,
                        'image': pictures[0] if pictures else '',
                        'images': pictures,
                        'categoryId': category_id,
                        'categoryName': categories.get(category_id, ''),
                        'params': params
                    }
                    
                    products.append(product)
        
        # Сортируем по названию
        products.sort(key=lambda x: x['name'])
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json; charset=utf-8'
            },
            'body': json.dumps({
                'success': True,
                'count': len(products),
                'products': products
            }, ensure_ascii=False, indent=2)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'success': False
            }, ensure_ascii=False)
        }
