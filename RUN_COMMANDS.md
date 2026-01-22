# Команды для запуска загрузки товаров Техносиб

## Основная команда (рекомендуется)

```bash
node load-tehnosib.mjs
```

**Результат:**
- Создается файл `tehnosib_products.json` с актуальными товарами
- Выводится статистика и примеры товаров в консоль
- Данные отфильтрованы по вакуумной и термоупаковке

---

## Альтернативные способы

### Через Python

```bash
python3 scripts/import_tehnosib.py
```

### Через Node.js скрипт

```bash
node scripts/import_tehnosib.js
```

---

## Просмотр результатов

### В браузере (визуальный просмотр)

Откройте файл в браузере:
```bash
# MacOS
open view-tehnosib.html

# Linux
xdg-open view-tehnosib.html

# Windows
start view-tehnosib.html
```

### В терминале

```bash
# Посмотреть количество товаров
cat tehnosib_products.json | grep -c "\"name\""

# Посмотреть первые 5 товаров
cat tehnosib_products.json | jq '.[0:5]'

# Посмотреть все названия
cat tehnosib_products.json | jq '.[].name'
```

---

## Проверка и отладка

### Проверить доступность фида

```bash
curl -I https://tehnosib.ru/upload/export_files/yml_tehnosib_4623.xml
```

### Скачать фид вручную

```bash
curl -o tehnosib_feed.xml https://tehnosib.ru/upload/export_files/yml_tehnosib_4623.xml
```

### Проверить версию Node.js

```bash
node --version
# Требуется v18 или выше
```

---

## Интеграция в проект

### Скопировать в публичную директорию

```bash
cp tehnosib_products.json public/data/
```

### Использовать в React компоненте

```typescript
import products from '../tehnosib_products.json';
```

### Загрузить динамически

```typescript
const response = await fetch('/tehnosib_products.json');
const products = await response.json();
```

---

## Автоматизация обновления

### Добавить в cron (Linux/MacOS)

```bash
# Редактировать crontab
crontab -e

# Добавить строку (обновление каждый день в 6:00)
0 6 * * * cd /path/to/project && node load-tehnosib.mjs
```

### Создать npm скрипт

Добавьте в `package.json`:
```json
{
  "scripts": {
    "tehnosib:sync": "node load-tehnosib.mjs"
  }
}
```

Затем запускайте:
```bash
npm run tehnosib:sync
```

---

## Troubleshooting

### Ошибка: "command not found: node"

Установите Node.js:
```bash
# MacOS
brew install node

# Ubuntu/Debian
sudo apt install nodejs npm

# Или скачайте с https://nodejs.org
```

### Ошибка: "fetch is not defined"

Обновите Node.js до версии 18+:
```bash
node --version  # Проверить текущую версию
```

### Ошибка: "EACCES: permission denied"

Дайте права на выполнение:
```bash
chmod +x load-tehnosib.mjs
```

### Файл не создается

Проверьте права на запись:
```bash
ls -la tehnosib_products.json
# Если файл существует, убедитесь что можете его перезаписать
```

---

## Примеры использования данных

### Фильтрация по цене

```bash
# Товары дешевле 50000 руб
cat tehnosib_products.json | jq '[.[] | select(.price | tonumber < 50000)]'
```

### Поиск по названию

```bash
# Найти все вакуумные упаковщики
cat tehnosib_products.json | jq '[.[] | select(.name | contains("вакуум"))]'
```

### Сортировка по цене

```bash
# Сортировать по возрастанию цены
cat tehnosib_products.json | jq 'sort_by(.price | tonumber)'
```

---

## Быстрый старт - Полная последовательность

```bash
# 1. Загрузить данные
node load-tehnosib.mjs

# 2. Проверить результат
ls -lh tehnosib_products.json

# 3. Посмотреть количество товаров
cat tehnosib_products.json | jq 'length'

# 4. Посмотреть пример товара
cat tehnosib_products.json | jq '.[0]'

# 5. Открыть в браузере для визуального просмотра
open view-tehnosib.html
```

---

## Полезные команды

```bash
# Показать товары с ценой и артикулом
cat tehnosib_products.json | jq '.[] | {name, price, vendorCode}'

# Найти самый дорогой товар
cat tehnosib_products.json | jq 'max_by(.price | tonumber)'

# Найти самый дешевый товар
cat tehnosib_products.json | jq 'min_by(.price | tonumber)'

# Средняя цена
cat tehnosib_products.json | jq '[.[] | .price | tonumber] | add/length'

# Уникальные категории
cat tehnosib_products.json | jq '[.[].categoryName] | unique'
```

---

**Готово! Теперь у вас есть все инструменты для работы с каталогом Техносиб.**
