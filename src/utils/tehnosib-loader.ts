/**
 * Утилита для загрузки товаров из YML фида Техносиб
 */

export interface Product {
  name: string;
  price: string;
  vendorCode: string;
  description: string;
  image: string;
  images: string[];
  categoryId: string;
  categoryName: string;
  params: Record<string, string>;
}

/**
 * Загружает и парсит YML фид от Техносиб
 */
export async function loadTehnosibProducts(): Promise<Product[]> {
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

/**
 * Парсит XML и извлекает релевантные товары
 */
function parseXML(xmlString: string): Product[] {
  const categories: Record<string, string> = {};
  const products: Product[] = [];
  
  // Извлекаем категории
  const categoryRegex = /<category[^>]*id="([^"]*)"[^>]*>([^<]*)<\/category>/g;
  let match: RegExpExecArray | null;
  
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
      const pictures: string[] = [];
      let pictureMatch: RegExpExecArray | null;
      
      while ((pictureMatch = pictureRegex.exec(offerContent)) !== null) {
        pictures.push(pictureMatch[1]);
      }
      
      // Извлекаем параметры
      const paramRegex = /<param name="([^"]*)">(.*?)<\/param>/g;
      const params: Record<string, string> = {};
      let paramMatch: RegExpExecArray | null;
      
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

/**
 * Форматирует список товаров в читаемый текст
 */
export function formatProductsList(products: Product[]): string {
  let output = `\nНайдено товаров: ${products.length}\n\n`;
  
  products.forEach((product, index) => {
    output += `${index + 1}. ${product.name}\n`;
    output += `   Артикул: ${product.vendorCode}\n`;
    output += `   Цена: ${product.price} руб.\n`;
    output += `   Категория: ${product.categoryName}\n`;
    if (product.description) {
      const shortDesc = product.description.substring(0, 100);
      output += `   Описание: ${shortDesc}${product.description.length > 100 ? '...' : ''}\n`;
    }
    output += '\n';
  });
  
  return output;
}
