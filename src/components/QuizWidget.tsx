import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { getUtmFromCookies } from '@/lib/utm';
import { getSourcePage } from '@/lib/sourcePage';

interface QuizAnswers {
  product: string;
  size: string;
  volume: string;
  packType: string;
  hasEquipment: string;
  budget: string;
}

interface QuizWidgetProps {
  variant?: 'inline' | 'modal' | 'sidebar';
  onClose?: () => void;
}

const STEPS = [
  {
    key: 'product' as const,
    question: 'Что будете упаковывать?',
    options: [
      { value: 'food', label: 'Продукты питания', icon: 'Beef' },
      { value: 'non-food', label: 'Непищевая продукция', icon: 'Package' },
      { value: 'clothes', label: 'Одежда', icon: 'Shirt' },
      { value: 'electronics', label: 'Электроника', icon: 'Cpu' },
      { value: 'other', label: 'Другое', icon: 'HelpCircle' },
    ],
  },
  {
    key: 'size' as const,
    question: 'Какой размер продукта?',
    options: [
      { value: 'small', label: 'Мелкий', icon: 'CircleDot', desc: 'Конфета, батончик, пакетик специй — до 15×10×5 см' },
      { value: 'medium-small', label: 'Небольшой', icon: 'Circle', desc: 'Кусок сыра, стейк, нарезка в лотке — 15–25×10–20 см' },
      { value: 'medium', label: 'Средний', icon: 'Square', desc: 'Целая курица, блок сыра, коробка конфет — 25–40×15–30 см' },
      { value: 'large', label: 'Крупный', icon: 'RectangleHorizontal', desc: 'Целая рыба, колбасный батон, коробка обуви — 40–60×20–40 см' },
      { value: 'xlarge', label: 'Крупногабаритный', icon: 'Maximize', desc: 'Половина туши, матрас, паллетная упаковка — более 60 см' },
    ],
  },
  {
    key: 'volume' as const,
    question: 'Сколько упаковок в смену?',
    options: [
      { value: 'up-to-100', label: 'До 100', icon: 'Package' },
      { value: '100-500', label: '100–500', icon: 'Layers' },
      { value: '500-2000', label: '500–2 000', icon: 'LayoutGrid' },
      { value: '2000+', label: 'Более 2 000', icon: 'Factory' },
    ],
  },
  {
    key: 'packType' as const,
    question: 'Какой тип упаковки нужен?',
    options: [
      { value: 'vacuum', label: 'Вакуумная', icon: 'Wind' },
      { value: 'shrink', label: 'Термоусадочная', icon: 'Flame' },
      { value: 'unknown', label: 'Не знаю — помогите выбрать', icon: 'HelpCircle' },
    ],
  },
  {
    key: 'hasEquipment' as const,
    question: 'Есть ли уже оборудование?',
    options: [
      { value: 'replace', label: 'Да, хочу заменить', icon: 'RefreshCw' },
      { value: 'first', label: 'Нет, первая покупка', icon: 'ShoppingCart' },
    ],
  },
  {
    key: 'budget' as const,
    question: 'Ориентировочный бюджет?',
    options: [
      { value: 'up-to-100k', label: 'До 100 тыс. ₽', icon: 'Coins' },
      { value: '100-300k', label: '100–300 тыс. ₽', icon: 'Wallet' },
      { value: '300-700k', label: '300–700 тыс. ₽', icon: 'Banknote' },
      { value: '700k+', label: 'От 700 тыс. ₽', icon: 'Landmark' },
      { value: 'unknown', label: 'Пока не определились', icon: 'HelpCircle' },
    ],
  },
];

const TOTAL_STEPS = STEPS.length + 1;

export default function QuizWidget({ variant = 'inline', onClose }: QuizWidgetProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    product: '',
    size: '',
    volume: '',
    packType: '',
    hasEquipment: '',
    budget: '',
  });
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 11) return form.phone;
    if (digits.length === 0) return '';
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits.slice(0, 1)} (${digits.slice(1)}`;
    if (digits.length <= 7) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 9) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const selectOption = (key: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(() => setStep(prev => prev + 1), 200);
  };

  const buildComment = () => {
    const labels: Record<string, string> = {
      food: 'Продукты питания',
      'non-food': 'Непищевая продукция',
      clothes: 'Одежда',
      electronics: 'Электроника',
      other: 'Другое',
      small: 'Мелкий (до 15×10×5 см)',
      'medium-small': 'Небольшой (15–25×10–20 см)',
      medium: 'Средний (25–40×15–30 см)',
      large: 'Крупный (40–60×20–40 см)',
      xlarge: 'Крупногабаритный (более 60 см)',
      'up-to-100': 'До 100',
      '100-500': '100–500',
      '500-2000': '500–2000',
      '2000+': 'Более 2000',
      vacuum: 'Вакуумная',
      shrink: 'Термоусадочная',
      unknown: 'Не знаю — помогите выбрать',
      replace: 'Да, хочу заменить',
      first: 'Нет, первая покупка',
      'up-to-100k': 'До 100 тыс.',
      '100-300k': '100–300 тыс.',
      '300-700k': '300–700 тыс.',
      '700k+': 'От 700 тыс.',
    };

    const source = getSourcePage();
    return [
      `[КВИЗ] Подбор оборудования`,
      `Источник: ${source.label} — ${source.url}`,
      `Упаковка: ${labels[answers.product] || answers.product}`,
      `Размер: ${labels[answers.size] || answers.size}`,
      `В смену: ${labels[answers.volume] || answers.volume}`,
      `Тип: ${labels[answers.packType] || answers.packType}`,
      `Оборудование: ${labels[answers.hasEquipment] || answers.hasEquipment}`,
      `Бюджет: ${labels[answers.budget] || answers.budget}`,
    ].join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const w = window as unknown as Record<string, (...args: unknown[]) => void>;
    if (w.ym) {
      w.ym(105605669, 'reachGoal', 'fos_sent');
      w.ym(105605669, 'reachGoal', 'quiz_sent');
    }

    const source = getSourcePage();
    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email || '',
      comment: buildComment(),
      url: source.url,
      source_page: source.url,
      page_title: source.title,
      UF_CRM_1775454267: 'ДА',
      ...getUtmFromCookies(),
    };

    fetch('/api/b24-send-lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});

    toast({
      title: 'Заявка отправлена!',
      description: 'Менеджер подберёт оборудование и свяжется в течение 15 минут',
    });

    setSubmitted(true);
  };

  const currentStep = STEPS[step];
  const isFormStep = step >= STEPS.length;
  const isCompact = variant === 'sidebar';
  const hasDesc = currentStep?.options?.some(o => 'desc' in o);

  if (submitted) {
    return (
      <div className={`text-center ${isCompact ? 'py-6 px-4' : 'py-12'}`}>
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Icon name="Check" size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Спасибо за Вашу заявку!</h3>
        <p className="text-muted-foreground">Менеджер свяжется с Вами в ближайшее время</p>
        {onClose && (
          <Button variant="ghost" className="mt-4" onClick={onClose}>Закрыть</Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Шаг {step + 1} из {TOTAL_STEPS}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {!isFormStep && currentStep && (
        <div>
          <h3 className={`font-bold mb-4 ${isCompact ? 'text-lg' : 'text-xl md:text-2xl'}`}>
            {currentStep.question}
          </h3>

          <div className={`grid gap-3 ${
            hasDesc
              ? 'grid-cols-1'
              : isCompact
                ? 'grid-cols-1'
                : (currentStep.options && currentStep.options.length <= 3)
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-3'
          }`}>
            {currentStep.options?.map(opt => (
              <Card
                key={opt.value}
                className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                  answers[currentStep.key] === opt.value
                    ? 'border-primary shadow-md bg-primary/5'
                    : 'border-border'
                }`}
                onClick={() => selectOption(currentStep.key, opt.value)}
              >
                <CardContent className={`flex items-center gap-3 ${isCompact ? 'p-3' : 'p-4'}`}>
                  <div className={`${isCompact ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg bg-primary/10 flex items-center justify-center shrink-0`}>
                    <Icon name={opt.icon} size={isCompact ? 20 : 24} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <span className={`font-medium ${isCompact ? 'text-sm' : ''}`}>{opt.label}</span>
                    {'desc' in opt && opt.desc && (
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {step > 0 && (
            <div className="mt-4">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setStep(prev => prev - 1)}
              >
                <Icon name="ArrowLeft" size={16} className="mr-1" />
                Назад
              </Button>
            </div>
          )}
        </div>
      )}

      {isFormStep && (
        <div>
          <h3 className={`font-bold mb-2 ${isCompact ? 'text-lg' : 'text-xl md:text-2xl'}`}>
            Отлично! Осталось оставить контакты
          </h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Менеджер подберёт оборудование под ваши задачи и свяжется в течение 15 минут
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="quiz-name">Имя *</Label>
              <Input
                id="quiz-name"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ваше имя"
                required
              />
            </div>
            <div>
              <Label htmlFor="quiz-phone">Телефон *</Label>
              <Input
                id="quiz-phone"
                type="tel"
                value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                placeholder="+7 (999) 999-99-99"
                required
              />
            </div>
            <div>
              <Label htmlFor="quiz-email">Email</Label>
              <Input
                id="quiz-email"
                type="email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" required className="mt-1" />
                <span>
                  Отправляя форму, я соглашаюсь с{' '}
                  <a href="https://t-sib.ru/assets/politika_t-sib16.05.25.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">политикой обработки персональных данных</a>
                </span>
              </label>
            </div>
            <div className="flex gap-3 items-center">
              <Button
                variant="ghost"
                type="button"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setStep(prev => prev - 1)}
              >
                <Icon name="ArrowLeft" size={16} className="mr-1" />
                Назад
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-accent hover:bg-accent/90 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-all"
              >
                <Icon name="Send" size={20} className="mr-2" />
                Получить подбор оборудования
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}