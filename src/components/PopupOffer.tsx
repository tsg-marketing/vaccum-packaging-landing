import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Icon from './ui/icon';

interface PopupOfferProps {
  onSubmit: (phone: string) => void;
}

export default function PopupOffer({ onSubmit }: PopupOfferProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('hasSeenPopup', 'true');
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim()) {
      onSubmit(phone);
      setIsOpen(false);
      setPhone('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 hover:bg-white transition-colors shadow-sm"
          aria-label="Закрыть"
        >
          <Icon name="X" size={20} className="text-gray-600" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="hidden md:block relative bg-gradient-to-br from-blue-50 to-blue-100">
            <img
              src="https://cdn.poehali.dev/files/dvuhkamerniy_vakuumniy_upakovshik_DZ-410_2SB..jpg"
              alt="Вакуумный упаковщик"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                Ищите вакуумное оборудование для своего товара?
              </DialogTitle>
            </DialogHeader>

            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Подберем оптимальный товар по лучшей цене
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-base"
                  required
                />
              </div>

              <Button type="submit" className="w-full text-base font-semibold py-6">
                Отправить
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
