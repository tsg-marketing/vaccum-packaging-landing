#!/usr/bin/env node
/**
 * Скрипт для загрузки товаров из YML фида Техносиб
 * Использование: node load-tehnosib.mjs
 */

import { writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function loadTehnosibProducts() {
  const ymlUrl = 'https://tehnosib.ru/upload/export_files/yml_tehnosib_4623.xml';
  
  console.log('Загрузка YML фида от Техносиб...');
  
  try {
    const response = await fetch(ymlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const xmlText = await response.text();
    console.log(`Загружено ${xmlText.length} символов`);
    
    return parseXML(xmlText);
    
  } catch (error) {
    console.error('Ошибка загрузки фида:', error);
    throw error;
  }
}

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
    'l-сварщик', 'l сварщик', 'сварщик', 'туннель', 'запайщик'
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

async function main() {
  try {
    const products = await loadTehnosibProducts();
    
    // Сохраняем в JSON файл
    const outputPath = join(__dirname, 'tehnosib_products.json');
    await writeFile(outputPath, JSON.stringify(products, null, 2), 'utf8');
    
    console.log(`\n✓ Данные сохранены в ${outputPath}`);
    console.log(`\nПримеры товаров:`);
    
    products.slice(0, 10).forEach((product, i) => {
      console.log(`\n${i + 1}. ${product.name}`);
      console.log(`   Артикул: ${product.vendorCode}`);
      console.log(`   Цена: ${product.price} руб.`);
      console.log(`   Категория: ${product.categoryName}`);
      if (product.description) {
        const shortDesc = product.description.substring(0, 80);
        console.log(`   Описание: ${shortDesc}...`);
      }
    });
    
    if (products.length > 10) {
      console.log(`\n... и еще ${products.length - 10} товаров`);
    }
    
    console.log(`\n✓ Готово! Всего найдено ${products.length} товаров`);
    console.log(`\nФайл сохранен: ${outputPath}`);
    
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

main();
