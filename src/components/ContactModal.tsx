import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

export const ContactModal = ({ open, onOpenChange, title = 'Получить коммерческое предложение' }: ContactModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '', message: '', url: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Заявка отправлена!",
      description: "Менеджер свяжется с вами в ближайшее время",
    });
    setFormData({ name: '', phone: '', message: '', url: window.location.href+window.location.pathname });
    fetch('/api/b24-send-lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // alert('Заявка отправлена успешно!');
      } else {
        // alert('Ошибка при отправке заявки');
      }
    })
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
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-all">
            <Icon name="Send" size={20} className="mr-2" />
            Отправить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};