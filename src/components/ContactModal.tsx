import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { getUtmFromCookies } from '@/lib/utm';
import { getSourcePage, buildSourceLine } from '@/lib/sourcePage';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  productName?: string;
}

export const ContactModal = ({ open, onOpenChange, title = 'Получить коммерческое предложение', productName }: ContactModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', url: '' });

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
      (window as any).ym(105605669, 'reachGoal', 'fos_sent');
    }

    const source = getSourcePage();
    const sourceLine = buildSourceLine();
    const productLine = productName ? `[Товар: ${productName}]` : '';
    const parts = [sourceLine, productLine, formData.message].filter(Boolean);
    const combined = parts.join('\n');
    const submitData = {
      ...formData,
      message: combined,
      comment: combined,
      comments: combined,
      product: productName || '',
      product_name: productName || '',
      productName: productName || '',
      model: productName || '',
      modeltype: productName || '',
      productType: productName || '',
      url: source.url,
      source_page: source.url,
      page_title: source.title,
      lead_title: productName ? `${source.label}: ${productName}` : source.label,
      ...getUtmFromCookies(),
    };

    fetch('/api/b24-send-lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    }).catch(() => {});

    toast({
      title: "Заявка отправлена!",
      description: "Менеджер свяжется с вами в ближайшее время",
    });
    setFormData({ name: '', phone: '', message: '', url: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
          <DialogDescription className="text-sm">
            Заполните форму, и наш менеджер свяжется с вами в течение 15 минут
          </DialogDescription>
        </DialogHeader>
        {productName && (
          <div className="rounded-md bg-primary/5 border border-primary/20 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Интересует: </span>
            <span className="font-semibold">{productName}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <Label htmlFor="name">Имя *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ваше имя"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
              placeholder="+7 (999) 999-99-99"
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Сообщение</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Опишите вашу задачу или задайте вопрос"
              rows={4}
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
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-all">
            <Icon name="Send" size={20} className="mr-2" />
            Отправить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};