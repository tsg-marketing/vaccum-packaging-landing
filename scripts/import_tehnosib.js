#!/usr/bin/env node
/**
 * Скрипт для загрузки товаров из YML фида Техносиб
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Простой XML парсер
function parseXML(xmlString) {
    const categories = {};
    const products = [];
    
    // Извлекаем категории
    const categoryRegex = /<category[^>]*id="([^"]*)"[^>]*>([^<]*)<\/category>/g;
    let match;
    
    while ((match = categoryRegex.exec(xmlString)) !== null) {
        categories[match[1]] = match[2];
    }
    
    console.log(`Найдено категорий: ${Object.keys(categories).length}`);
    
    // Ключевые слова для фильтрации
    const vacuumKeywords = [
        'вакуум', 'вакуумный', 'вакуумная', 'вакуумные',
        'камерный', 'камерная', 'камерные'
    ];
    
    const thermalKeywords = [
        'термо', 'термоупак', 'термоусад', 'усадочн',
        'l-сварщик', 'l сварщик', 'сварщик', 'туннель'
    ];
    
    const allKeywords = [...vacuumKeywords, ...thermalKeywords];
    
    // Извлекаем товары
    const offerRegex = /<offer[^>]*>([\s\S]*?)<\/offer>/g;
    let offerCount = 0;
    
    while ((match = offerRegex.exec(xmlString)) !== null) {
        offerCount++;
        const offerContent = match[1];
        
        // Извлекаем поля товара
        const nameMatch = offerContent.match(/<name><!\[CDATA\[(.*?)\]\]><\/name>/);
        const priceMatch = offerContent.match(/<price>(.*?)<\/price>/);
        const vendorCodeMatch = offerContent.match(/<vendorCode>(.*?)<\/vendorCode>/);
        const descriptionMatch = offerContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
        const categoryIdMatch = offerContent.match(/<categoryId>(.*?)<\/categoryId>/);
        
        if (!nameMatch || !priceMatch) continue;
        
        const name = nameMatch[1] || '';
        const price = priceMatch[1] || '0';
        const vendorCode = vendorCodeMatch ? vendorCodeMatch[1] : '';
        const description = descriptionMatch ? descriptionMatch[1] : '';
        const categoryId = categoryIdMatch ? categoryIdMatch[1] : '';
        const categoryName = categories[categoryId] || '';
        
        // Проверяем релевантность
        const searchText = `${name} ${description} ${categoryName}`.toLowerCase();
        const isRelevant = allKeywords.some(keyword => searchText.includes(keyword));
        
        if (isRelevant) {
            // Извлекаем картинки
            const pictureRegex = /<picture>(.*?)<\/picture>/g;
            const pictures = [];
            let pictureMatch;
            
            while ((pictureMatch = pictureRegex.exec(offerContent)) !== null) {
                pictures.push(pictureMatch[1]);
            }
            
            // Извлекаем параметры
            const paramRegex = /<param name="([^"]*)">(.*?)<\/param>/g;
            const params = {};
            let paramMatch;
            
            while ((paramMatch = paramRegex.exec(offerContent)) !== null) {
                params[paramMatch[1]] = paramMatch[2];
            }
            
            products.push({
                name,
                price,
                vendorCode,
                description,
                image: pictures[0] || '',
                images: pictures,
                categoryId,
                categoryName,
                params
            });
        }
    }
    
    console.log(`Всего товаров в фиде: ${offerCount}`);
    console.log(`Найдено релевантных товаров: ${products.length}`);
    
    // Сортируем по названию
    products.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    
    return products;
}

// Загружаем YML фид
function loadYMLFeed(url) {
    return new Promise((resolve, reject) => {
        console.log(`Загрузка YML фида из ${url}...`);
        
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`Загружено ${data.length} байт`);
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Главная функция
async function main() {
    try {
        const ymlUrl = 'https://tehnosib.ru/upload/export_files/yml_tehnosib_4623.xml';
        
        // Загружаем XML
        const xmlData = await loadYMLFeed(ymlUrl);
        
        // Парсим данные
        console.log('\nИзвлечение данных...');
        const products = parseXML(xmlData);
        
        // Сохраняем в JSON файл
        const outputFile = path.join(__dirname, '..', 'tehnosib_products.json');
        fs.writeFileSync(outputFile, JSON.stringify(products, null, 2), 'utf8');
        
        console.log(`\n✓ Данные сохранены в ${outputFile}`);
        console.log(`\nПримеры товаров:`);
        
        products.slice(0, 5).forEach((product, i) => {
            console.log(`\n${i + 1}. ${product.name}`);
            console.log(`   Артикул: ${product.vendorCode}`);
            console.log(`   Цена: ${product.price} руб.`);
            console.log(`   Категория: ${product.categoryName}`);
        });
        
        if (products.length > 5) {
            console.log(`\n... и еще ${products.length - 5} товаров`);
        }
        
        console.log(`\n✓ Готово! Всего найдено ${products.length} товаров`);
        
    } catch (error) {
        console.error('Ошибка:', error);
        process.exit(1);
    }
}

// Запускаем
main();
