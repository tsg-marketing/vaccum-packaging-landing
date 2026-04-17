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
  description: string;
  images?: string[];
}

interface TraysealerCatalogProps {
  onInquiry: (productName: string) => void;
}

const formatPrice = (price: number): string => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб';
};

const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const KEYWORDS = ['производительность', 'глубина', 'операции'];

const HIDDEN_KEYS = ['Бренд', 'Название бренда', 'Видео (ссылка)', 'Видео', 'Картинки товара'];

const getSpecsForProduct = (product: Product) => {
  const allSpecs = Object.entries(product.specifications || {});
  const filtered = allSpecs.filter(([key, value]) => {
    if (HIDDEN_KEYS.some(h => key.includes(h))) return false;
    if (GUID_REGEX.test(key) || GUID_REGEX.test(value)) return false;
    return true;
  });

  const matched = filtered.filter(([key]) => {
    const lk = key.toLowerCase();
    return KEYWORDS.some(kw => lk.includes(kw));
  });

  if (matched.length > 0) return matched;
  return filtered.slice(0, 4);
};

const ALL_CATEGORY_ID = 307;
const CHILD_IDS = [308, 309, 310, 498, 499];
const ALL_IDS = [ALL_CATEGORY_ID, ...CHILD_IDS];
const CATEGORY_IDS_STR = ALL_IDS.join(',');

const CATEGORIES = [
  { id: ALL_CATEGORY_ID, name: 'Все запайщики' },
  { id: 308, name: 'Автоматические' },
  { id: 309, name: 'Полуавтоматические' },
  { id: 310, name: 'Ручные' },
  { id: 498, name: 'С газонаполнением' },
  { id: 499, name: 'С обрезкой' },
];

function ProductImageCarousel({ images, name, onOpen }: { images: string[]; name: string; onOpen: () => void }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-muted flex items-center justify-center rounded-t-lg">
        <Icon name="Package" size={64} className="text-muted-foreground" />
      </div>
    );
  }

  const go = (dir: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((prev) => {
      const next = prev + dir;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  return (
    <div
      className="relative group cursor-zoom-in bg-white rounded-t-lg overflow-hidden"
      onClick={onOpen}
    >
      <img
        src={images[current]}
        alt={name}
        className="w-full h-64 object-contain"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 shadow">
          <Icon name="ZoomIn" size={20} />
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => go(-1, e)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow transition-colors"
            aria-label="Предыдущее фото"
          >
            <Icon name="ChevronLeft" size={18} />
          </button>
          <button
            onClick={(e) => go(1, e)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow transition-colors"
            aria-label="Следующее фото"
          >
            <Icon name="ChevronRight" size={18} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.slice(0, 8).map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-black/30'}`}
              />
            ))}
            {images.length > 8 && <span className="text-xs text-black/60 ml-1">+{images.length - 8}</span>}
          </div>
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

export default function TraysealerCatalog({ onInquiry }: TraysealerCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<number>(ALL_CATEGORY_ID);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    counts[ALL_CATEGORY_ID] = products.length;
    CHILD_IDS.forEach((id) => {
      counts[id] = products.filter((p) => p.category_id === id).length;
    });
    return counts;
  }, [products]);

  const visibleCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => cat.id === ALL_CATEGORY_ID || (categoryCounts[cat.id] || 0) > 0);
  }, [categoryCounts]);

  useEffect(() => {
    if (products.length > 0 && !visibleCategories.find((c) => c.id === activeCategory)) {
      setActiveCategory(ALL_CATEGORY_ID);
    }
  }, [products, visibleCategories, activeCategory]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = activeCategory === ALL_CATEGORY_ID ? true : p.category_id === activeCategory;
        const matchesSearch =
          searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase());
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
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  useEffect(() => {
    const CACHE_KEY = 'traysealerProductsCache_v2';
    const CACHE_TIMESTAMP_KEY = 'traysealerProductsCacheTimestamp_v2';
    const CACHE_DURATION = 6 * 60 * 60 * 1000;
    localStorage.removeItem('traysealerProductsCache_v1');
    localStorage.removeItem('traysealerProductsCacheTimestamp_v1');

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
        const response = await fetch(
          `https://functions.poehali.dev/2d5f9278-9fd7-4ee8-86c0-e8b7c096608c?categories=${CATEGORY_IDS_STR}`
        );
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

    fetchProducts(true);
  }, []);

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
        <p className="mt-4 text-muted-foreground">
          Товары загружаются. Обновите страницу позже или оставьте заявку — пришлём подборку.
        </p>
        <Button className="mt-4 bg-accent hover:bg-accent/90" onClick={() => onInquiry('Запайщики лотков')}>
          <Icon name="MessageCircle" size={18} className="mr-2" />
          Оставить заявку
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Поиск по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs
          value={activeCategory.toString()}
          onValueChange={(val) => setActiveCategory(Number(val))}
          className="w-full"
        >
          <TabsList className="flex flex-wrap h-auto gap-1 mb-8">
            {visibleCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id.toString()}
                className="text-sm font-semibold px-3 py-2"
              >
                {cat.name} {categoryCounts[cat.id] ? `(${categoryCounts[cat.id]})` : ''}
              </TabsTrigger>
            ))}
          </TabsList>

          {visibleCategories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id.toString()}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Icon name="Package" size={48} className="mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Товары в этой категории не найдены</p>
                  </div>
                ) : (
                  displayProducts.map((product) => {
                    const imgs =
                      product.images && product.images.length > 0
                        ? product.images.filter(Boolean)
                        : product.image_url
                        ? [product.image_url]
                        : [];
                    return (
                      <Card
                        key={product.id}
                        id={`product-${product.external_id || product.id}`}
                        className="flex flex-col hover:shadow-lg transition-shadow"
                      >
                        <CardHeader className="p-0">
                          <ProductImageCarousel
                            images={imgs}
                            name={product.name}
                            onOpen={() => setSelectedProduct(product)}
                          />
                        </CardHeader>

                        <CardContent className="flex-1 p-4">
                          <h3 className="font-semibold text-lg mb-3 line-clamp-2">{product.name}</h3>
                          {product.specifications &&
                            Object.keys(product.specifications).length > 0 && (
                              <div className="mb-3 space-y-1.5">
                                {getSpecsForProduct(product).map(([key, value]) => (
                                  <div
                                    key={key}
                                    className="text-sm text-muted-foreground flex items-start gap-1"
                                  >
                                    <Icon name="Dot" size={16} className="flex-shrink-0 mt-0.5" />
                                    <span>
                                      <span className="font-medium">{key}:</span> {value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          {product.price > 0 ? (
                            <p className="text-2xl font-bold text-primary">
                              {formatPrice(product.price)}
                            </p>
                          ) : (
                            <p className="text-lg font-semibold text-muted-foreground">
                              Цена по запросу
                            </p>
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
                    );
                  })
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

      <ProductModal product={selectedProduct} onClose={handleCloseModal} onInquiry={onInquiry} />
    </>
  );
}
