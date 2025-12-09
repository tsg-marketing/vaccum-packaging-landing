import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import Icon from './ui/icon';

interface Product {
  id: number;
  external_id: string;
  name: string;
  price: number;
  image_url: string | null;
  category_id: number;
  specifications: Record<string, string>;
}

interface ProductCatalogProps {
  onInquiry: (productName: string) => void;
}

const formatPrice = (price: number): string => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб';
};

const CATEGORIES = [
  { id: 290, name: 'Вакуум-упаковочное' },
  { id: 291, name: 'Бескамерные' },
  { id: 292, name: 'Однокамерные' },
  { id: 294, name: 'Двухкамерные' }
];

export default function ProductCatalog({ onInquiry }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number>(290);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = products.filter(p => p.category_id === cat.id && p.price >= 30000).length;
      return acc;
    }, {} as Record<number, number>);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = p.category_id === activeCategory;
        const matchesSearch = searchQuery === '' || 
          p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = p.price >= 30000;
        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => a.price - b.price);
  }, [products, activeCategory, searchQuery]);

  const displayProducts = useMemo(() => {
    if (!isMobile || showAll || filteredProducts.length <= 10) {
      return filteredProducts;
    }
    return filteredProducts.slice(0, 10);
  }, [filteredProducts, isMobile, showAll]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  useEffect(() => {
    const CACHE_KEY = 'productsCache';
    const CACHE_TIMESTAMP_KEY = 'productsCacheTimestamp';
    const CACHE_DURATION = 6 * 60 * 60 * 1000;

    const fetchProducts = async (useCache = true) => {
      if (useCache) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();

        if (cachedData && cacheTimestamp && now - parseInt(cacheTimestamp) < CACHE_DURATION) {
          try {
            const parsed = JSON.parse(cachedData);
            setProducts(parsed);
            setLoading(false);
            return;
          } catch (err) {
            console.error('Ошибка парсинга кеша:', err);
          }
        }
      }

      try {
        const response = await fetch('https://functions.poehali.dev/2d5f9278-9fd7-4ee8-86c0-e8b7c096608c');
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить товары');
        }
        
        const data = await response.json();
        setProducts(data.products || []);
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(data.products || []));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(true);

    const syncProducts = async () => {
      try {
        await fetch('https://functions.poehali.dev/c616cc5e-d577-4461-8ce7-6f6d5fbfd2f9', {
          method: 'POST'
        });
        await fetchProducts(false);
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
    <div className="w-full">
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Tabs value={activeCategory.toString()} onValueChange={(val) => setActiveCategory(Number(val))} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
          {CATEGORIES.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id.toString()} className="text-base sm:text-lg font-semibold">
              {cat.name} ({categoryCounts[cat.id] || 0})
            </TabsTrigger>
          ))}
        </TabsList>
      
      {CATEGORIES.map(cat => (
        <TabsContent key={cat.id} value={cat.id.toString()}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Icon name="Package" size={48} className="mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Товары в этой категории не найдены</p>
              </div>
            ) : (
              displayProducts.map((product) => (
        <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader className="p-0">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 object-contain rounded-t-lg bg-white"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-64 bg-muted flex items-center justify-center rounded-t-lg">
                <Icon name="Package" size={64} className="text-muted-foreground" />
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-4">
            <h3 className="font-semibold text-lg mb-3 line-clamp-2">{product.name}</h3>
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mb-3 space-y-1.5">
                {Object.entries(product.specifications)
                  .filter(([key]) => !['Бренд', 'Название бренда', 'Видео (ссылка)'].includes(key))
                  .slice(0, 4)
                  .map(([key, value]) => (
                  <div key={key} className="text-sm text-muted-foreground flex items-start gap-1">
                    <Icon name="Dot" size={16} className="flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">
                      <span className="font-medium">{key}:</span> {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-base font-bold py-6 shadow-lg transform hover:scale-105 transition-all" 
              onClick={() => onInquiry(product.name)}
            >
              <Icon name="Eye" size={20} className="mr-2" />
              💎 Узнать подробнее
            </Button>
          </CardFooter>
        </Card>
              ))
            )}
          </div>
          {isMobile && filteredProducts.length > 10 && !showAll && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowAll(true)}
                className="w-full md:w-auto"
              >
                <Icon name="ChevronDown" size={20} className="mr-2" />
                Посмотреть все ({filteredProducts.length})
              </Button>
            </div>
          )}
        </TabsContent>
      ))}
      </Tabs>
    </div>
  );
}