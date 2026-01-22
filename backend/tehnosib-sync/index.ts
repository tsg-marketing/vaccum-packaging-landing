import { IncomingMessage } from 'http';
import { request as httpsRequest } from 'https';

interface Product {
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

interface ResponseData {
  success: boolean;
  count: number;
  products: Product[];
}

// Простой XML парсер для извлечения данных
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

// Загружаем YML фид
function loadYMLFeed(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`Загрузка YML фида из ${url}...`);
    
    const req = httpsRequest(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res: IncomingMessage) => {
      let data = '';
      
      res.setEncoding('utf8');
      
      res.on('data', (chunk: string) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`Загружено ${data.length} байт`);
        resolve(data);
      });
    });
    
    req.on('error', (err: Error) => {
      reject(err);
    });
    
    req.end();
  });
}

// Handler для Vercel/Serverless функции
export default async function handler(req: any, res: any) {
  try {
    const ymlUrl = 'https://tehnosib.ru/upload/export_files/yml_tehnosib_4623.xml';
    
    // Загружаем XML
    const xmlData = await loadYMLFeed(ymlUrl);
    
    // Парсим данные
    console.log('Извлечение данных...');
    const products = parseXML(xmlData);
    
    const responseData: ResponseData = {
      success: true,
      count: products.length,
      products
    };
    
    res.status(200).json(responseData);
    
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
