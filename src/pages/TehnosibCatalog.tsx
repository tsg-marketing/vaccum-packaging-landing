/**
 * Страница каталога товаров Техносиб
 */

import { TehnosibProducts } from '@/components/TehnosibProducts';
import { loadTehnosibProducts } from '@/utils/tehnosib-loader';
import { useState } from 'react';

export function TehnosibCatalog() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadProducts = async () => {
    setIsLoading(true);
    try {
      return await loadTehnosibProducts();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Каталог упаковочного оборудования
        </h1>
        <p className="text-lg text-muted-foreground">
          Актуальные цены на оборудование для вакуумной и термоупаковки от Техносиб
        </p>
      </div>

      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <h2 className="font-semibold mb-2">Информация</h2>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Данные загружаются из YML фида tehnosib.ru</li>
          <li>• Цены актуальны на момент последнего обновления</li>
          <li>• Товары отфильтрованы по категориям вакуумной и термоупаковки</li>
        </ul>
      </div>

      <TehnosibProducts onLoadProducts={handleLoadProducts} />
    </div>
  );
}

export default TehnosibCatalog;
