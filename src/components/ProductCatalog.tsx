import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import Icon from './ui/icon';

interface Product {
  id: number;
  external_id: string;
  name: string;
  price: number;
  image_url: string | null;
  category_id: number;
}

interface ProductCatalogProps {
  onInquiry: (productName: string) => void;
}

const formatPrice = (price: number): string => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб';
};

export default function ProductCatalog({ onInquiry }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/2d5f9278-9fd7-4ee8-86c0-e8b7c096608c');
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить товары');
        }
        
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const syncProducts = async () => {
      try {
        await fetch('https://functions.poehali.dev/c616cc5e-d577-4461-8ce7-6f6d5fbfd2f9', {
          method: 'POST'
        });
        fetchProducts();
      } catch (err) {
        console.error('Ошибка синхронизации:', err);
      }
    };

    const lastSync = localStorage.getItem('lastProductSync');
    const now = Date.now();
    
    if (!lastSync || now - parseInt(lastSync) > 24 * 60 * 60 * 1000) {
      syncProducts();
      localStorage.setItem('lastProductSync', now.toString());
    }

    const interval = setInterval(() => {
      syncProducts();
      localStorage.setItem('lastProductSync', Date.now().toString());
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Icon name="Loader2" size={48} className="mx-auto animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Загрузка товаров...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Icon name="AlertCircle" size={48} className="mx-auto text-destructive" />
        <p className="mt-4 text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Package" size={48} className="mx-auto text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Товары не найдены</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="p-0">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 object-cover rounded-t-lg"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-64 bg-muted flex items-center justify-center rounded-t-lg">
                <Icon name="Package" size={64} className="text-muted-foreground" />
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              className="w-full" 
              onClick={() => onInquiry(product.name)}
            >
              Узнать подробнее
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
