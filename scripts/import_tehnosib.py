#!/usr/bin/env python3
"""
Скрипт для загрузки товаров из YML фида Техносиб
"""

import json
import urllib.request
import xml.etree.ElementTree as ET
from typing import List, Dict


def load_tehnosib_products() -> List[Dict]:
    """
    Загружает YML фид от Техносиб и извлекает товары для вакуумной и термоупаковки
    """
    
    yml_url = "https://tehnosib.ru/upload/export_files/yml_tehnosib_4623.xml"
    
    print(f"Загрузка YML фида из {yml_url}...")
    
    # Загружаем XML фид
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    req = urllib.request.Request(yml_url, headers=headers)
    
    with urllib.request.urlopen(req, timeout=30) as response:
        xml_data = response.read()
    
    print(f"Загружено {len(xml_data)} байт")
    
    # Парсим XML
    root = ET.fromstring(xml_data)
    
    # Находим shop элемент
    shop = root.find('.//shop')
    if shop is None:
        raise ValueError('Shop element not found in XML')
    
    # Извлекаем категории
    print("\nИзвлечение категорий...")
    categories = {}
    categories_elem = shop.find('categories')
    if categories_elem is not None:
        for category in categories_elem.findall('category'):
            cat_id = category.get('id')
            cat_name = category.text
            if cat_id and cat_name:
                categories[cat_id] = cat_name
    
    print(f"Найдено {len(categories)} категорий")
    
    # Ключевые слова для фильтрации
    vacuum_keywords = [
        'вакуум', 'вакуумный', 'вакуумная', 'вакуумные',
        'камерный', 'камерная', 'камерные'
    ]
    
    thermal_keywords = [
        'термо', 'термоупак', 'термоусад', 'усадочн',
        'l-сварщик', 'l сварщик', 'сварщик', 'туннель'
    ]
    
    # Объединяем все ключевые слова
    all_keywords = vacuum_keywords + thermal_keywords
    
    # Извлекаем товары
    print("\nИзвлечение товаров...")
    products = []
    offers_elem = shop.find('offers')
    
    if offers_elem is not None:
        all_offers = offers_elem.findall('offer')
        print(f"Всего товаров в фиде: {len(all_offers)}")
        
        for offer in all_offers:
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
            category_name = categories.get(category_id, '')
            
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
                    'categoryName': category_name,
                    'params': params
                }
                
                products.append(product)
    
    # Сортируем по названию
    products.sort(key=lambda x: x['name'])
    
    print(f"\nНайдено релевантных товаров: {len(products)}")
    
    return products


if __name__ == '__main__':
    try:
        products = load_tehnosib_products()
        
        # Сохраняем в JSON файл
        output_file = 'tehnosib_products.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        
        print(f"\n✓ Данные сохранены в {output_file}")
        print(f"\nПримеры товаров:")
        for i, product in enumerate(products[:5], 1):
            print(f"\n{i}. {product['name']}")
            print(f"   Артикул: {product['vendorCode']}")
            print(f"   Цена: {product['price']} руб.")
            print(f"   Категория: {product['categoryName']}")
        
        if len(products) > 5:
            print(f"\n... и еще {len(products) - 5} товаров")
        
    except Exception as e:
        print(f"Ошибка: {e}")
        import traceback
        traceback.print_exc()
