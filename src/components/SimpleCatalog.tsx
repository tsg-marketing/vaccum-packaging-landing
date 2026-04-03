import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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

interface CategoryDef {
  id: number;
  name: string;
}

interface SimpleCatalogProps {
  categories: CategoryDef[];
  cacheKey: string;
  onInquiry: (productName: string) => void;
}

const formatPrice = (price: number): string => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб';
};

export default function SimpleCatalog({ categories, cacheKey, onInquiry }: SimpleCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number>(categories[0]?.id || 0);
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lightboxProduct, setLightboxProduct] = useState<Product | null>(null);

  const categoryIds = useMemo(() => categories.map(c => c.id).join(','), [categories]);

  const categoryCounts = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = products.filter(p => p.category_id === cat.id).length;
      return acc;
    }, {} as Record<number, number>);
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.category_id === activeCategory)
      .sort((a, b) => {
        if (a.price > 0 && b.price > 0) return a.price - b.price;
        if (a.price > 0 && b.price <= 0) return -1;
        if (a.price <= 0 && b.price > 0) return 1;
        return 0;
      });
  }, [products, activeCategory]);

  const displayProducts = useMemo(() => {
    if (!isMobile || showAll || filteredProducts.length <= 10) {
      return filteredProducts;
    }
    return filteredProducts.slice(0, 10);
  }, [filteredProducts, isMobile, showAll]);

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
    const CACHE_KEY = `${cacheKey}Cache`;
    const CACHE_TS_KEY = `${cacheKey}CacheTimestamp`;
    const CACHE_DURATION = 6 * 60 * 60 * 1000;

    const fetchProducts = async () => {
      const cachedData = localStorage.getItem(CACHE_KEY);
      const cacheTimestamp = localStorage.getItem(CACHE_TS_KEY);
      const now = Date.now();
      if (cachedData && cacheTimestamp && now - parseInt(cacheTimestamp) < CACHE_DURATION) {
        try {
          setProducts(JSON.parse(cachedData));
          setLoading(false);
          return;
        } catch (e) {
          console.error('Cache parse error:', e);
        }
      }

      try {
        const response = await fetch(`https://functions.poehali.dev/2d5f9278-9fd7-4ee8-86c0-e8b7c096608c?categories=${categoryIds}`);
        if (!response.ok) throw new Error('Не удалось загрузить товары');
        const data = await response.json();
        const list: Product[] = data.products || [];
        setProducts(list);
        localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        localStorage.setItem(CACHE_TS_KEY, Date.now().toString());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryIds, cacheKey]);

  const handleCloseModal = () => {
    setSelectedProduct(null);
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

  const showTabs = categories.length > 1;

  const renderGrid = () => (
    <>
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
    </>
  );

  return (
    <>
      <div className="w-full">
        {showTabs ? (
          <Tabs value={activeCategory.toString()} onValueChange={(val) => setActiveCategory(Number(val))} className="w-full">
            <TabsList className={`grid w-full grid-cols-1 sm:grid-cols-2 mb-8`}>
              {categories.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id.toString()} className="text-sm sm:text-base font-semibold">
                  {cat.name} ({categoryCounts[cat.id] || 0})
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map(cat => (
              <TabsContent key={cat.id} value={cat.id.toString()}>
                {renderGrid()}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          renderGrid()
        )}
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