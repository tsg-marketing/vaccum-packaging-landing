import { useState } from 'react';
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
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onInquiry: (productName: string) => void;
}

const formatPrice = (price: number): string => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' руб';
};

export default function ProductModal({ product, onClose, onInquiry }: ProductModalProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!product) return null;

  const images = product.image_url ? [product.image_url] : [];
  const specs = product.specifications
    ? Object.entries(product.specifications).filter(([key]) => key !== 'Картинки товара')
    : [];

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
                  <div
                    className="relative bg-white rounded-xl overflow-hidden cursor-zoom-in group border"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img
                      src={images[0]}
                      alt={product.name}
                      className="w-full h-64 object-contain"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                        <Icon name="ZoomIn" size={20} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center border">
                    <Icon name="Package" size={64} className="text-muted-foreground" />
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

              <div className="flex flex-col gap-3">
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
          <img
            src={images[0]}
            alt={product.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}