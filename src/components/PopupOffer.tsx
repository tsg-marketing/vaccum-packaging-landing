import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import Icon from './ui/icon';
import { useToast } from '@/hooks/use-toast';

interface PopupOfferProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function PopupOffer({ isOpen: controlledIsOpen, onOpenChange }: PopupOfferProps = {}) {
  const { toast } = useToast();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: 'Подбор вакуумного оборудования', url: '' });

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = onOpenChange || setInternalIsOpen;

  useEffect(() => {
    if (controlledIsOpen !== undefined) return;
    
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setInternalIsOpen(true);
        localStorage.setItem('hasSeenPopup', 'true');
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [controlledIsOpen]);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 11) return formData.phone;
    
    if (digits.length === 0) return '';
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits.slice(0, 1)} (${digits.slice(1)}`;
    if (digits.length <= 7) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(105605669, 'reachGoal', 'popup_sent');
    }
    
    toast({
      title: "Заявка отправлена!",
      description: "Менеджер свяжется с вами в ближайшее время",
    });

    const submitData = { ...formData, url: window.location.href };
    
    fetch('/api/b24-send-lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Успешно
      }
    })
    .catch(err => console.error('Ошибка отправки:', err));

    setFormData({ name: '', phone: '', message: 'Подбор вакуумного оборудования', url: '' });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 hover:bg-white transition-colors shadow-sm"
          aria-label="Закрыть"
        >
          <Icon name="X" size={20} className="text-gray-600" />
        </button>

        <div className="grid md:grid-cols-5 gap-0">
          <div className="hidden md:block relative bg-gradient-to-br from-blue-50 to-blue-100 md:col-span-2">
            <img
              src="https://cdn.poehali.dev/files/dvuhkamerniy_vakuumniy_upakovshik_DZ-410_2SB..jpg"
              alt="Вакуумный упаковщик"
              className="w-full h-full object-contain p-4"
            />
          </div>

          <div className="p-6 md:p-8 md:col-span-3">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                Ищите вакуумное оборудование для своего товара?
              </DialogTitle>
            </DialogHeader>

            <p className="text-gray-600 mb-4 text-sm">
              Подберем оптимальный товар по лучшей цене
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="popup-name">Имя *</Label>
                <Input
                  id="popup-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ваше имя"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="popup-phone">Телефон *</Label>
                <Input
                  id="popup-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  placeholder="+7 (999) 999-99-99"
                  required
                />
              </div>

              <div>
                <label className="flex items-start gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" required className="mt-1" />
                  <span>
                    Отправляя форму, я соглашаюсь с{' '}
                    <a href="https://t-sib.ru/assets/politika_t-sib16.05.25.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">политикой обработки персональных данных</a>
                    {' '}и даю{' '}
                    <a href="https://t-sib.ru/assets/soglasie_t-sib16.05.25.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">согласие на обработку персональных данных</a>
                  </span>
                </label>
              </div>

              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 py-6 text-base font-bold shadow-lg transform hover:scale-105 transition-all">
                <Icon name="Send" size={20} className="mr-2" />
                Отправить
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}