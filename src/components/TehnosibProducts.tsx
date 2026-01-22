/**
 * Компонент для отображения товаров из фида Техносиб
 */

import { useState, useEffect } from 'react';
import { Product } from '@/utils/tehnosib-loader';

interface TehnosibProductsProps {
  products?: Product[];
  onLoadProducts?: () => Promise<Product[]>;
}

export function TehnosibProducts({ products: initialProducts, onLoadProducts }: TehnosibProductsProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'vacuum' | 'thermal'>('all');

  // Загрузка товаров
  const loadProducts = async () => {
    if (onLoadProducts) {
      setLoading(true);
      setError(null);
      try {
        const data = await onLoadProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки товаров');
      } finally {
        setLoading(false);
      }
    }
  };

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    
    const searchText = `${product.name} ${product.description} ${product.categoryName}`.toLowerCase();
    
    if (filter === 'vacuum') {
      return searchText.includes('вакуум') || searchText.includes('камерн');
    }
    
    if (filter === 'thermal') {
      return searchText.includes('термо') || 
             searchText.includes('усадочн') || 
             searchText.includes('сварщик') ||
             searchText.includes('туннель');
    }
    
    return true;
  });

  return (
    <div className="w-full space-y-6">
      {/* Заголовок и управление */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Товары Техносиб</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Найдено товаров: {filteredProducts.length}
          </p>
        </div>
        
        {onLoadProducts && (
          <button
            onClick={loadProducts}
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : 'Обновить данные'}
          </button>
        )}
      </div>

      {/* Фильтры */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-md text-sm ${
            filter === 'all' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Все товары
        </button>
        <button
          onClick={() => setFilter('vacuum')}
          className={`px-3 py-1.5 rounded-md text-sm ${
            filter === 'vacuum' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Вакуумная упаковка
        </button>
        <button
          onClick={() => setFilter('thermal')}
          className={`px-3 py-1.5 rounded-md text-sm ${
            filter === 'thermal' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          Термоупаковка
        </button>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {/* Список товаров */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product, index) => (
          <ProductCard key={`${product.vendorCode}-${index}`} product={product} />
        ))}
      </div>

      {/* Пустое состояние */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Товары не найдены</p>
          {onLoadProducts && (
            <button
              onClick={loadProducts}
              className="mt-4 text-primary hover:underline"
            >
              Загрузить товары
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Карточка товара
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Изображение */}
      {product.image && (
        <div className="aspect-video bg-muted relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Название */}
        <h3 className="font-semibold line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Категория */}
        {product.categoryName && (
          <div className="text-xs text-muted-foreground">
            {product.categoryName}
          </div>
        )}

        {/* Артикул и цена */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Арт: {product.vendorCode || 'н/д'}
          </div>
          <div className="text-lg font-bold text-primary">
            {Number(product.price).toLocaleString('ru-RU')} ₽
          </div>
        </div>

        {/* Описание */}
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Параметры */}
        {product.params && Object.keys(product.params).length > 0 && (
          <div className="pt-2 border-t space-y-1">
            {Object.entries(product.params).slice(0, 3).map(([key, value]) => (
              <div key={key} className="text-xs flex justify-between">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
