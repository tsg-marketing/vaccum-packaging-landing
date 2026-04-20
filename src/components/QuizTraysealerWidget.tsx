import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { getUtmFromCookies } from '@/lib/utm';

interface QuizAnswers {
  product: string;
  volume: string;
  map: string;
  equipment: string;
}

interface QuizTraysealerWidgetProps {
  variant?: 'inline' | 'modal' | 'sidebar';
  onClose?: () => void;
}

const STEPS = [
  {
    key: 'product' as const,
    question: 'Что вы упаковываете?',
    options: [
      { value: 'meat', label: 'Мясо, птица, полуфабрикаты', emoji: '\u{1F969}' },
      { value: 'fish', label: 'Рыба и морепродукты', emoji: '\u{1F41F}' },
      { value: 'dairy', label: 'Молочная продукция, сыры', emoji: '\u{1F9C0}' },
      { value: 'ready-food', label: 'Готовая еда, кулинария, салаты', emoji: '\u{1F957}' },
      { value: 'produce', label: 'Овощи, фрукты, зелень', emoji: '\u{1F353}' },
      { value: 'non-food', label: 'Непищевая продукция (медицина, техника, комплектующие)', emoji: '\u{2699}' },
      { value: 'choosing', label: 'Пока в процессе выбора / запускаю новый продукт', emoji: '\u{1F914}' },
    ],
  },
  {
    key: 'volume' as const,
    question: 'Сколько лотков в смену нужно запаивать?',
    options: [
      { value: 'up-to-200', label: 'До 200 лотков/смену', desc: 'Небольшое производство или стартап' },
      { value: '200-1000', label: '200–1 000 лотков/смену', desc: 'Малое производство, фермерское хозяйство' },
      { value: '1000-5000', label: '1 000–5 000 лотков/смену', desc: 'Среднее производство' },
      { value: '5000+', label: 'Более 5 000 лотков/смену', desc: 'Крупное производство, поставки в сети' },
      { value: 'unknown', label: 'Пока не знаю — нужна помощь с расчётом', desc: '' },
    ],
  },
  {
    key: 'map' as const,
    question: 'Нужна ли упаковка в модифицированной газовой среде (MAP)?',
    options: [
      { value: 'yes', label: 'Да, нужна MAP — хочу продлить срок годности', emoji: '\u{2705}' },
      { value: 'future', label: 'Возможно в будущем — хочу аппарат «на вырост»', emoji: '\u{1F504}' },
      { value: 'no', label: 'Нет, достаточно обычной запайки лотка', emoji: '\u{274C}' },
      { value: 'consult', label: 'Не знаю, нужна консультация', emoji: '\u{2753}' },
    ],
  },
  {
    key: 'equipment' as const,
    question: 'Какое упаковочное оборудование у вас сейчас?',
    options: [
      { value: 'none', label: 'Ничего нет — упаковываем вручную или на аутсорсе', emoji: '\u{1F6AB}' },
      { value: 'basic', label: 'Есть бытовой вакууматор / простой запайщик лотков', emoji: '\u{1F4E6}' },
      { value: 'outdated', label: 'Есть трейсилер, но он устарел / не справляется с объёмами', emoji: '\u{2699}' },
      { value: 'line', label: 'Есть линия, нужен дополнительный аппарат или замена', emoji: '\u{1F3ED}' },
    ],
  },
];

const TOTAL_STEPS = STEPS.length + 1;

const LABELS: Record<string, string> = {
  meat: 'Мясо, птица, полуфабрикаты',
  fish: 'Рыба и морепродукты',
  dairy: 'Молочная продукция, сыры',
  'ready-food': 'Готовая еда, кулинария, салаты',
  produce: 'Овощи, фрукты, зелень',
  'non-food': 'Непищевая продукция',
  choosing: 'Пока выбирает / новый продукт',
  'up-to-200': 'До 200 лотков/смену',
  '200-1000': '200–1 000 лотков/смену',
  '1000-5000': '1 000–5 000 лотков/смену',
  '5000+': 'Более 5 000 лотков/смену',
  unknown: 'Не знает — нужен расчёт',
  yes: 'Да, нужна MAP',
  future: 'Возможно в будущем',
  no: 'Нет, обычная запайка',
  consult: 'Нужна консультация',
  none: 'Ничего нет / ручная упаковка',
  basic: 'Бытовой вакууматор / простой запайщик',
  outdated: 'Устаревший трейсилер',
  line: 'Есть линия, нужна замена / доп. аппарат',
};

export default function QuizTraysealerWidget({ variant = 'inline', onClose }: QuizTraysealerWidgetProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    product: '',
    volume: '',
    map: '',
    equipment: '',
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
    return [
      `[КВИЗ ТРЕЙСИЛЕРЫ] Подбор оборудования`,
      `Продукт: ${LABELS[answers.product] || answers.product}`,
      `Объём: ${LABELS[answers.volume] || answers.volume}`,
      `MAP: ${LABELS[answers.map] || answers.map}`,
      `Текущее оборудование: ${LABELS[answers.equipment] || answers.equipment}`,
    ].join('\n');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const w = window as unknown as Record<string, (...args: unknown[]) => void>;
    if (w.ym) {
      w.ym(105605669, 'reachGoal', 'fos_sent');
      w.ym(105605669, 'reachGoal', 'quiz_traysealer_sent');
    }

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email || '',
      comment: buildComment(),
      url: window.location.href,
      ...getUtmFromCookies(),
    };

    fetch('/api/b24-send-lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});

    toast({
      title: 'Заявка отправлена!',
      description: 'Менеджер подберёт трейсилер и свяжется в течение 15 минут',
    });

    setSubmitted(true);
  };

  const currentStep = STEPS[step];
  const isFormStep = step >= STEPS.length;
  const isCompact = variant === 'sidebar';
  const hasDesc = currentStep?.options?.some(o => 'desc' in o && (o as { desc?: string }).desc);

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

          <div className="grid grid-cols-1 gap-3">
            {currentStep.options.map(opt => {
              const o = opt as { value: string; label: string; emoji?: string; desc?: string };
              return (
                <Card
                  key={o.value}
                  className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
                    answers[currentStep.key] === o.value
                      ? 'border-primary shadow-md bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => selectOption(currentStep.key, o.value)}
                >
                  <CardContent className={`flex items-center gap-3 ${isCompact ? 'p-3' : 'p-4'}`}>
                    {o.emoji && (
                      <div className={`${isCompact ? 'w-10 h-10 text-xl' : 'w-12 h-12 text-2xl'} rounded-lg bg-primary/10 flex items-center justify-center shrink-0`}>
                        <span>{o.emoji}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className={`font-medium ${isCompact ? 'text-sm' : ''}`}>{o.label}</span>
                      {hasDesc && o.desc && (
                        <p className="text-xs text-muted-foreground mt-0.5">{o.desc}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
            Менеджер подберёт трейсилер под ваши задачи и свяжется в течение 15 минут
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="quiz-t-name">Имя *</Label>
              <Input
                id="quiz-t-name"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ваше имя"
                required
              />
            </div>
            <div>
              <Label htmlFor="quiz-t-phone">Телефон *</Label>
              <Input
                id="quiz-t-phone"
                type="tel"
                value={form.phone}
                onChange={e => setForm(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                placeholder="+7 (999) 999-99-99"
                required
              />
            </div>
            <div>
              <Label htmlFor="quiz-t-email">Email</Label>
              <Input
                id="quiz-t-email"
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
                Получить подбор трейсилера
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
