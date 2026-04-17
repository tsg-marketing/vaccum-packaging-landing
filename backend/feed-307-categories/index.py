import json
import re
import urllib.request
from typing import Dict, Any


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Возвращает название категории 307 и список её дочерних категорий из фида t-sib.ru
    Args: event с httpMethod, context с request_id
    Returns: JSON со списком категорий {id, name}
    '''
    method = event.get('httpMethod', 'GET')

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

    url = 'https://t-sib.ru/upload/catalog.xml'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=25) as resp:
        xml_data = resp.read().decode('utf-8', errors='ignore')

    parent_name = None
    parent_match = re.search(r'<category\s+id="307">([^<]*)</category>', xml_data)
    if parent_match:
        parent_name = parent_match.group(1)

    children = []
    for m in re.finditer(r'<category\s+id="(\d+)"\s+parentId="307">([^<]*)</category>', xml_data):
        children.append({'id': int(m.group(1)), 'name': m.group(2)})

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'parent': {'id': 307, 'name': parent_name},
            'children': children,
        }, ensure_ascii=False),
        'isBase64Encoded': False,
    }
