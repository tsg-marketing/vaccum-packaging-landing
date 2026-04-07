import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import Icon from './ui/icon';

interface Product {
  id: number;
  external_id: string;
  name: string;
  price: number;
  image_url: string | null;
  category_id: number;
  specifications: Record<string, string>;
  description?: string;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onInquiry: (productName: string) => void;
}

const formatPrice = (price: number): string => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб';
};

const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HIDDEN_KEYS = ['Бренд', 'Название бренда', 'Видео (ссылка)', 'Видео', 'Картинки товара'];

function extractImagesFromHtml(html: string): string[] {
  const imgs: string[] = [];
  const regex = /src=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    let src = match[1];
    if (src.startsWith('/media/') || src.startsWith('/upload/')) {
      src = 'https://t-sib.ru' + src;
    }
    if (src.startsWith('http')) {
      imgs.push(src);
    }
  }
  return imgs;
}

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  tmp.querySelectorAll('figure, img, table, style, script').forEach(el => el.remove());
  const text = tmp.textContent || tmp.innerText || '';
  return text.replace(/\s+/g, ' ').trim();
}

export default function ProductModal({ product, onClose, onInquiry }: ProductModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = useMemo(() => {
    if (!product) return [];
    const imgs: string[] = [];
    if (product.image_url) imgs.push(product.image_url);
    if (product.description) {
      const descImgs = extractImagesFromHtml(product.description);
      descImgs.forEach(src => {
        if (!imgs.includes(src)) imgs.push(src);
      });
    }
    return imgs;
  }, [product]);

  const descriptionText = useMemo(() => {
    if (!product?.description) return '';
    return stripHtml(product.description);
  }, [product]);

  if (!product) return null;

  const specs = product.specifications
    ? Object.entries(product.specifications).filter(([key, value]) => {
        if (HIDDEN_KEYS.some(h => key.includes(h))) return false;
        if (GUID_REGEX.test(key) || GUID_REGEX.test(value)) return false;
        return true;
      })
    : [];

  const goSlide = (dir: number) => {
    setCurrentSlide(prev => {
      const next = prev + dir;
      if (next < 0) return images.length - 1;
      if (next >= images.length) return 0;
      return next;
    });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
            <h2 className="text-lg font-bold leading-tight pr-4">{product.name}</h2>
            <button
              onClick={onClose}
              className="shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                {images.length > 0 ? (
                  <div className="relative bg-white rounded-xl overflow-hidden border">
                    <div
                      className="cursor-zoom-in group"
                      onClick={() => setLightboxOpen(true)}
                    >
                      <img
                        src={images[currentSlide]}
                        alt={product.name}
                        className="w-full h-64 object-contain"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                          <Icon name="ZoomIn" size={20} />
                        </div>
                      </div>
                    </div>
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); goSlide(-1); }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow transition-colors"
                        >
                          <Icon name="ChevronLeft" size={18} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); goSlide(1); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow transition-colors"
                        >
                          <Icon name="ChevronRight" size={18} />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {images.map((_, i) => (
                            <button
                              key={i}
                              onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }}
                              className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? 'bg-primary' : 'bg-black/30'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center border">
                    <Icon name="Package" size={64} className="text-muted-foreground" />
                  </div>
                )}

                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden bg-white transition-colors ${
                          i === currentSlide ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
                        }`}
                      >
                        <img src={src} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Цена</p>
                  {product.price > 0 ? (
                    <p className="text-3xl font-bold text-primary">{formatPrice(product.price)}</p>
                  ) : (
                    <p className="text-xl font-semibold text-muted-foreground">Цена по запросу</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {descriptionText && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Описание
                    </h3>
                    <p className="text-sm leading-relaxed line-clamp-6">{descriptionText}</p>
                  </div>
                )}

                {specs.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                      Характеристики
                    </h3>
                    <div className="space-y-2">
                      {specs.map(([key, value]) => (
                        <div key={key} className="flex justify-between gap-2 py-1.5 border-b border-muted last:border-0">
                          <span className="text-sm text-muted-foreground shrink-0 max-w-[50%]">{key}</span>
                          <span className="text-sm font-medium text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Характеристики уточняйте у менеджера
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t shrink-0">
            <Button
              className="w-full bg-accent hover:bg-accent/90 text-base font-bold py-6 shadow-lg"
              onClick={() => { onClose(); onInquiry(product.name); }}
            >
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Оставить заявку
            </Button>
          </div>
        </div>
      </div>

      {lightboxOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 text-white hover:text-white/70 transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <Icon name="X" size={28} />
          </button>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goSlide(-1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-colors"
              >
                <Icon name="ChevronLeft" size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goSlide(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 text-white transition-colors"
              >
                <Icon name="ChevronRight" size={24} />
              </button>
            </>
          )}
          <img
            src={images[currentSlide]}
            alt={product.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }}
                  className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
