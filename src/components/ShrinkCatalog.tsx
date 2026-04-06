import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import Icon from './ui/icon';
import ProductModal from './ProductModal';

interface Product {
  id: number;
  external_id: string;
  name: string;
  price: number;
  image_url: string | null;
  category_id: number;
  specifications: Record<string, string>;
}

interface ShrinkCatalogProps {
  onInquiry: (productName: string) => void;
}

const formatPrice = (price: number): string => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб';
};

const CATEGORIES = [
  { id: 343, name: 'Для штучной упаковки' },
  { id: 341, name: 'Для групповой упаковки' },
  { id: 342, name: 'Для длинномерной продукции' },
  { id: 344, name: 'Sleeve-этикетки' },
  { id: 340, name: 'Прочее оборудование' },
  { id: 295, name: 'Термоусадочные танки' },
  { id: 345, name: 'Термоформеры' },
];

export default function ShrinkCatalog({ onInquiry }: ShrinkCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number>(343);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);

  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] = products.filter(p => p.category_id === cat.id).length;
      return acc;
    }, {} as Record<number, number>);
  }, [products]);

  useEffect(() => {
    if (products.length > 0) {
      const hasProducts = CATEGORIES.find(cat => (categoryCounts[cat.id] || 0) > 0);
      if (hasProducts && categoryCounts[activeCategory] === 0) {
        setActiveCategory(hasProducts.id);
      }
    }
  }, [products, categoryCounts]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = p.category_id === activeCategory;
        const matchesSearch = searchQuery === '' ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (a.price > 0 && b.price > 0) return a.price - b.price;
        if (a.price > 0 && b.price <= 0) return -1;
        if (a.price <= 0 && b.price > 0) return 1;
        return 0;
      });
  }, [products, activeCategory, searchQuery]);

  const displayProducts = useMemo(() => {
    if (!isMobile || showAll || filteredProducts.length <= 10) {
      return filteredProducts;
    }
    return filteredProducts.slice(0, 10);
  }, [filteredProducts, isMobile, showAll]);

  useEffect(() => {
    const preloadImages = () => {
      displayProducts.slice(0, 6).forEach(product => {
        if (product.image_url) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = product.image_url;
          document.head.appendChild(link);
        }
      });
    };
    if (displayProducts.length > 0) preloadImages();
  }, [displayProducts]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  useEffect(() => {
    const CACHE_KEY = 'shrinkProductsCache_v2';
    const CACHE_TIMESTAMP_KEY = 'shrinkProductsCacheTimestamp_v2';
    const CACHE_DURATION = 6 * 60 * 60 * 1000;
    localStorage.removeItem('shrinkProductsCache');
    localStorage.removeItem('shrinkProductsCacheTimestamp');

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
            return parsed as Product[];
          } catch (err) {
            console.error('Ошибка парсинга кеша:', err);
          }
        }
      }

      try {
        const response = await fetch('https://functions.poehali.dev/2d5f9278-9fd7-4ee8-86c0-e8b7c096608c?categories=340,341,342,343,344,295,345');
        if (!response.ok) throw new Error('Не удалось загрузить товары');
        const data = await response.json();
        const list: Product[] = data.products || [];
        setProducts(list);
        localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        return list;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
      return [] as Product[];
    };

    fetchProducts(true).then((list) => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const externalId = hash.replace('#product-', '');
        const found = list.find(p => String(p.external_id) === externalId);
        if (found) {
          const cat = CATEGORIES.find(c => c.id === found.category_id);
          if (cat) setActiveCategory(cat.id);
          setSelectedProduct(found);
        }
      }
    });

    const syncProducts = async () => {
      try {
        await fetch('https://functions.poehali.dev/c616cc5e-d577-4461-8ce7-6f6d5fbfd2f9', { method: 'POST' });
        await fetchProducts(false);
      } catch (err) {
        console.error('Ошибка синхронизации:', err);
      }
    };

    const lastSync = localStorage.getItem('lastShrinkProductSync');
    const now = Date.now();
    if (!lastSync || now - parseInt(lastSync) > 24 * 60 * 60 * 1000) {
      syncProducts();
      localStorage.setItem('lastShrinkProductSync', now.toString());
    }

    const interval = setInterval(() => {
      syncProducts();
      localStorage.setItem('lastShrinkProductSync', Date.now().toString());
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCloseModal = () => {
    setSelectedProduct(null);
    if (window.location.hash.startsWith('#product-')) {
      history.replaceState(null, '', window.location.pathname);
    }
  };

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
    <>
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
          <TabsList className="flex flex-wrap h-auto gap-1 mb-8">
            {CATEGORIES.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id.toString()} className="text-sm font-semibold px-3 py-2">
                {cat.name} {categoryCounts[cat.id] ? `(${categoryCounts[cat.id]})` : ''}
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
                    <Card
                      key={product.id}
                      id={`product-${product.external_id || product.id}`}
                      className="flex flex-col hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="p-0">
                        {product.image_url ? (
                          <div
                            className="relative group cursor-zoom-in"
                            onClick={() => setLightboxProduct(product)}
                          >
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-64 object-contain rounded-t-lg bg-white"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-t-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 shadow">
                                <Icon name="ZoomIn" size={20} />
                              </div>
                            </div>
                          </div>
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
                        {product.price > 0 ? (
                          <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
                        ) : (
                          <p className="text-lg font-semibold text-muted-foreground">Цена по запросу</p>
                        )}
                      </CardContent>

                      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold py-5 shadow-md transform hover:scale-105 transition-all"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Icon name="Eye" size={18} className="mr-2" />
                          Узнать подробнее
                        </Button>
                        <Button
                          className="w-full bg-accent hover:bg-accent/90 text-base font-bold py-6 shadow-lg transform hover:scale-105 transition-all"
                          onClick={() => onInquiry(product.name)}
                        >
                          <Icon name="MessageCircle" size={20} className="mr-2" />
                          Оставить заявку
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

      <ProductModal
        product={selectedProduct}
        onClose={handleCloseModal}
        onInquiry={onInquiry}
      />

      {lightboxProduct && lightboxProduct.image_url && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
          onClick={() => setLightboxProduct(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:text-white/70 transition-colors"
            onClick={() => setLightboxProduct(null)}
          >
            <Icon name="X" size={28} />
          </button>
          <img
            src={lightboxProduct.image_url}
            alt={lightboxProduct.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}