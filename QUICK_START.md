# Быстрый старт - Загрузка товаров Техносиб

## Для пользователя

### Шаг 1: Запустите скрипт загрузки

```bash
node load-tehnosib.mjs
```

### Шаг 2: Результат

После выполнения вы получите:
- ✅ Файл `tehnosib_products.json` с полным списком товаров
- ✅ Вывод в консоль с примерами товаров
- ✅ Статистику по количеству найденных товаров

### Пример вывода:

```
Загрузка YML фида от Техносиб...
Загружено 1234567 символов
Найдено категорий: 156
Всего товаров в фиде: 3245
Найдено релевантных товаров: 87

✓ Данные сохранены в tehnosib_products.json

Примеры товаров:

1. Вакуумный упаковщик DZ-400/2T
   Артикул: DZ-400/2T
   Цена: 45000 руб.
   Категория: Вакуумные упаковщики
   Описание: Камерный вакуумный упаковщик с двумя планками запайки...

2. Камерный вакуумный упаковщик DZ-500/2E
   Артикул: DZ-500/2E
   Цена: 78000 руб.
   Категория: Вакуумные упаковщики
   Описание: Профессиональный камерный вакуумный упаковщик...

... и еще 85 товаров

✓ Готово! Всего найдено 87 товаров
```

## Использование данных

### 1. В React компонентах

Импортируйте загруженный JSON:

```typescript
import products from '../tehnosib_products.json';

function ProductList() {
  return (
    <div>
      {products.map(product => (
        <div key={product.vendorCode}>
          <h3>{product.name}</h3>
          <p>Цена: {product.price} руб.</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. С использованием готового компонента

```typescript
import { TehnosibProducts } from '@/components/TehnosibProducts';
import products from '../tehnosib_products.json';

function App() {
  return <TehnosibProducts products={products} />;
}
```

### 3. Динамическая загрузка

```typescript
import { loadTehnosibProducts } from '@/utils/tehnosib-loader';

const products = await loadTehnosibProducts();
```

## Структура данных

Каждый товар содержит:

```typescript
{
  name: string;          // Название товара
  price: string;         // Цена в рублях
  vendorCode: string;    // Артикул производителя
  description: string;   // Описание
  image: string;         // URL главной картинки
  images: string[];      // Все картинки
  categoryId: string;    // ID категории
  categoryName: string;  // Название категории
  params: {              // Параметры товара
    [key: string]: string;
  }
}
```

## Автоматизация

Для регулярного обновления цен добавьте в cron:

```bash
# Обновление каждый день в 6:00
0 6 * * * cd /path/to/project && node load-tehnosib.mjs
```

## Альтернативные способы

### Через Python

```bash
python3 scripts/import_tehnosib.py
```

### Через TypeScript в браузере

```typescript
import { loadTehnosibProducts } from '@/utils/tehnosib-loader';

const products = await loadTehnosibProducts();
console.log(products);
```

## Фильтрация в приложении

Товары автоматически отфильтрованы по:

✅ **Вакуумная упаковка**:
- Вакуумные упаковщики
- Камерные вакуумные машины

✅ **Термоупаковка**:
- Термоусадочные машины
- L-сварщики
- Термотуннели
- Запайщики

## Готовые компоненты

Проект включает:

1. **TehnosibProducts** - компонент для отображения товаров
2. **TehnosibCatalog** - готовая страница каталога
3. **tehnosib-loader** - утилиты для загрузки данных

## Пример использования на странице

```tsx
import { TehnosibCatalog } from '@/pages/TehnosibCatalog';

function App() {
  return <TehnosibCatalog />;
}
```

Компонент включает:
- Автоматическую загрузку данных
- Фильтрацию по типу оборудования
- Отображение карточек товаров
- Обработку ошибок

---

## Поддержка

Если данные не загружаются, проверьте:
- ✅ Доступность интернета
- ✅ URL фида: https://tehnosib.ru/upload/export_files/yml_tehnosib_4623.xml
- ✅ Версию Node.js (требуется 18+)

## Файлы проекта

- `load-tehnosib.mjs` - основной скрипт загрузки
- `src/utils/tehnosib-loader.ts` - TypeScript утилита
- `src/components/TehnosibProducts.tsx` - React компонент
- `src/pages/TehnosibCatalog.tsx` - страница каталога
- `tehnosib_products_example.json` - пример структуры данных
