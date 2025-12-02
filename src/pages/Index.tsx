import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { ContactModal } from '@/components/ContactModal';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import ProductCatalog from '@/components/ProductCatalog';
import Messengers from '@/components/Messengers';

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', company: '', productType: '', modeltype: '', comment: '', url: '' });
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const advantagesAnim = useScrollAnimation();
  const equipmentAnim = useScrollAnimation();
  const applicationAnim = useScrollAnimation();
  const serviceAnim = useScrollAnimation();
  const testimonialsAnim = useScrollAnimation();
  const faqAnim = useScrollAnimation();

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(105605669, 'reachGoal', 'fos_sent');
    }
    toast({
      title: "Заявка отправлена!",
      description: "Коммерческое предложение придёт на email, менеджер свяжется в течение 15 минут",
    });
    setFormData({ name: '', phone: '', email: '', company: '', productType: '', modeltype: '', comment: '', url: window.location.href+window.location.pathname });
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
  };

  const advantages = [
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/0b71ec3e-a2c5-4e00-aceb-184876407d3b.jpg', title: 'В наличии', desc: 'Для мяса, рыбы, сыра, медицинских, косметических и прочих товаров' },
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/4faf9fb3-7edd-4d3a-8c09-b6551720734d.jpg', title: 'Линейка моделей', desc: 'Настольные/напольные, 1/2 камеры' },
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/c1dfcac8-cfbc-4e54-abee-f17a524ad124.jpg', title: 'До 3-х лет гарантия', desc: 'Надёжность и стабильность' },
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/626e45bb-7048-4bec-89ee-b50bffb73d39.jpg', title: 'Полная комплектация', desc: 'Газонаполнение, запайка/обрезка' },
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/0f2978d8-ac25-42e5-bf6e-7c8dd395493a.jpg', title: 'Герметичный пакет', desc: 'Защита от окисления и влаги' },
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/3a94f915-36ab-405b-b26c-c33981ead825.jpg', title: 'Универсальность', desc: 'Пищевые и непищевые товары' },
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/dad14336-d4ac-450d-b13a-3d21ff7de97d.jpg', title: 'Автопрограммы', desc: 'Быстрая настройка упаковки' },
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/f74ea2d4-d362-4f28-9fd4-135b90c82a82.jpg', title: 'Оперативный сервис', desc: 'Расходники на складе' },
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/45afc7b4-929c-4ca1-99d6-6fffa5270673.jpg', title: 'Мощные насосы', desc: 'Высокая производительность' },
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/5284600a-e3a3-44ec-99b1-5ba84c1ecd7d.jpg', title: 'Двойной шов', desc: 'Идеально для мяса и рыбы' },
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/02f2ea66-3e7e-4020-b624-1ac163334b6c.jpg', title: 'Сертификация', desc: 'CE, ISO 9001' },
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/de1bfb06-9393-4e5f-ad96-42b4b0f475c5.jpg', title: 'Работа 24/7', desc: 'Стабильная непрерывная работа' },
  ];

  const models = [
    {
      id: 1,
      name: 'HVC-400/2T (DZ-400/2T)',
      type: 'tabletop',
      chambers: 2,
      application: 'universal',
      image: 'https://cdn.poehali.dev/files/9c7ca575-7502-41a8-bb53-38a599d3d21b.png',
      voltage: '220 В',
      power: '900 Вт',
      sealingBars: '2',
      sealLength: '400 мм',
      sealWidth: '10 мм',
      pump: '20 м³/ч',
      sealPower: '500 Вт',
      chamberSize: '400×350×70 мм',
      externalChamber: '440×420×135 мм',
      weight: '94 кг',
      packageSize: '680×610×630 мм',
      inStock: true,
      warranty: '3 года',
      price: 'Запросить цену',
      body: '',
    },
    {
      id: 2,
      name: 'Вакуумный упаковщик напольный',
      type: 'floor',
      chambers: 2,
      application: 'universal',
      image: 'https://cdn.poehali.dev/files/0a82f194-5bc8-4995-830b-c1cf62a9ec9f.jpg',
      voltage: '220 или 380 В (под заказ)',
      power: '750 Вт',
      sealingBars: '2',
      sealLength: '410 + 410 мм',
      sealWidth: '10 мм, 2×3 мм, 3 мм + Обрезка',
      pump: '20 м³/ч',
      sealPower: '500 Вт',
      chamberSize: '450×450×140 мм',
      externalChamber: '',
      weight: '',
      packageSize: '',
      inStock: true,
      warranty: '3 года',
      price: 'Запросить цену',
      body: 'Нерж. сталь SUS304',
    },
    {
      id: 3,
      name: 'HVC-400/2T-G (DZQ-400/2T)',
      type: 'tabletop',
      chambers: 2,
      application: 'universal',
      image: 'https://cdn.poehali.dev/files/66e73a17-7ec1-42bc-9f38-703f28f96f8c.png',
      voltage: '220 В',
      power: '900 Вт',
      sealingBars: '2',
      sealLength: '400 мм',
      sealWidth: '10 мм',
      pump: '20 м³/ч',
      sealPower: '500 Вт',
      chamberSize: '400×365×130 (50×80) мм',
      externalChamber: '',
      weight: '94 кг',
      packageSize: '680×610×630 мм',
      inStock: true,
      warranty: '3 года',
      price: 'Запросить цену',
      body: 'Нержавеющая сталь',
    },
  ];

  const filteredModels = models;

  const applications = [
    {
      title: 'Идеально для мяса',
      benefits: ['Увеличение срока хранения до 3x', 'Защита от окисления', 'Презентабельный вид', 'Сохранение вкуса и структуры'],
      icon: 'Beef',
    },
    {
      title: 'Идеально для рыбы',
      benefits: ['Защита от обветривания', 'Герметичная упаковка', 'Сохранение свежести', 'Удобная презентация'],
      icon: 'Fish',
    },
    {
      title: 'Идеально для сыра',
      benefits: ['Контроль созревания', 'Защита от плесени', 'Товарный вид', 'Длительное хранение'],
      icon: 'Milk',
    },
    {
      title: 'Идеально для орехов',
      benefits: ['Прекращение доступа кислорода', 'Защита от влаги', 'Защита от пыли и загрязнений', 'Предотвращение засыхания ядер'],
      icon: 'Shell',
    },
    {
      title: 'Для непищевых товаров',
      benefits: ['Защита от влаги и пыли', 'Презентация продукции', 'Сохранность при транспортировке', 'Универсальность'],
      icon: 'Box',
    },
    {
      title: 'Для медицинских товаров',
      benefits: ['Стерильность упаковки', 'Длительное хранение', 'Защита от загрязнений', 'Соответствие стандартам'],
      icon: 'Heart',
    },
    {
      title: 'Для косметических товаров',
      benefits: ['Сохранение свойств', 'Защита от окисления', 'Презентабельный вид', 'Увеличение срока годности'],
      icon: 'Sparkles',
    },
    {
      title: 'Для товаров для животных',
      benefits: ['Свежесть корма', 'Защита от влаги', 'Удобная фасовка', 'Длительное хранение'],
      icon: 'Cat',
    },
  ];

  const workflowSteps = [
    { step: '1', title: 'Загрузка', desc: 'Размещение продукта в камере', icon: 'PackageOpen' },
    { step: '2', title: 'Настройка', desc: 'Выбор программы на панели', icon: 'Settings2' },
    { step: '3', title: 'Вакуумирование', desc: 'Откачка воздуха из пакета', icon: 'Wind' },
    { step: '4', title: 'Газонаполнение', desc: 'MAP - замена воздуха газом (опция)', icon: 'Droplets' },
    { step: '5', title: 'Запайка', desc: 'Двойная запайка, широкая запайка, запайка-обрезка', icon: 'Scissors' },
    { step: '6', title: 'Контроль', desc: 'Проверка герметичности шва', icon: 'CheckCircle2' },
  ];

  const faqs = [
    {
      q: 'Чем отличается однокамерная и двухкамерная модель?',
      a: 'Двухкамерные модели обеспечивают в 2 раза большую производительность за счёт параллельной работы камер. Подходят для крупных производств с высоким потоком упаковки.',
    },
    {
      q: 'Зачем газонаполнение и когда оно нужно?',
      a: 'Газонаполнение (MAP) замещает воздух инертным газом, что снижает окисление и увеличивает срок хранения до 5 раз. Критично для красного мяса, полуфабрикатов и деликатесов.',
    },
    {
      q: 'Насколько надёжен двойной шов?',
      a: 'Двойная запайка состоит из двух 3,5 мм выпуклых струн. Это позволит быть уверенным, что остатки продукта или жидкости будут вытеснены с зоны шва во время запаечного цикла. Обеспечивает максимальную герметичность и исключает развакуум пакета при транспортировке.',
    },
    {
      q: 'Какие пакеты подходят и как выбрать размер?',
      a: 'Используются специальные вакуумные пакеты с рифлением или гладкие плёнки. Размер выбирается исходя из габаритов продукта + 5-7 см запаса на запайку. Наши специалисты помогут подобрать оптимальный тип.',
    },
    {
      q: 'Сроки поставки и условия гарантии?',
      a: 'Оборудование в наличии на складе — отгрузка в день оплаты. Доставка по РФ 2-7 дней. Гарантия до 3 лет на оборудование, консультация по подключению и эксплуатации.',
    },
    {
      q: 'Как организована пусконаладка и обучение?',
      a: 'Инженер проводит установку, настройку оборудования и обучение персонала на объекте клиента в течение 1 дня. Услуга включена в стоимость оборудования, за исключением командировочных расходов сервисного инженера.',
    },
    {
      q: 'Как обслуживать насос и планку запайки?',
      a: 'Регламент обслуживания включает: проверку уровня масла в насосе раз в месяц, очистку планки запайки после смены, замену тефлоновой ленты раз в 3-6 месяцев. Обучение включено, сервис по договору.',
    },
    {
      q: 'Какие есть сертификаты?',
      a: 'Все модели имеют сертификаты CE (европейский стандарт безопасности), ISO 9001 (система менеджмента качества), декларацию соответствия ТР ТС для работы в РФ и СНГ.',
    },
    {
      q: 'Есть ли лизинг и рассрочка?',
      a: 'Да, работаем с ведущими лизинговыми компаниями. Возможна рассрочка на индивидуальных условиях. Оформление от 1 дня.',
    },
    {
      q: 'Сколько стоит данное оборудование?',
      a: 'Стоимость нашего оборудования от 50 тыс. руб. Точная стоимость зависит от характеристик модели, условий доставки, наличия товара на складе. Оставьте заявку в форме обратной связи, менеджер свяжется с вами в ближайшее время и предоставит детальную информацию.',
    },
    {
      q: 'Какую модель выбрать?',
      a: 'Выбор модели зависит от ваших задач: объема упаковки, типа продукции, размеров продукта. Наш менеджер поможет подобрать оптимальное оборудование под ваши потребности. Оставьте заявку, и мы проконсультируем вас по всем вопросам выбора.',
    },
  ];

  const testimonials = [
    {
      name: 'Дмитрий Соколов',
      company: 'Мясной цех "Премиум"',
      text: 'Приобрели напольную модель с двумя камерами для упаковки мяса. Оборудование работает безупречно уже полгода, производительность выросла в 2 раза. Менеджеры помогли с выбором, инженер быстро настроил и обучил персонал.',
      rating: 5,
    },
    {
      name: 'Елена Морозова',
      company: 'Рыбный магазин "Океан"',
      text: 'Заказали настольную модель для небольшого магазина. Отличное качество упаковки, рыба сохраняет свежесть в несколько раз дольше. Покупатели отмечают презентабельный вид продукции. Рекомендую!',
      rating: 5,
    },
    {
      name: 'Алексей Петров',
      company: 'Сыроварня "Традиции"',
      text: 'Взяли оборудование с функцией газонаполнения для упаковки сыра. Срок годности увеличился до 3 месяцев без потери качества. Окупилось за 4 месяца. Сервис на высоте, все расходники всегда в наличии.',
      rating: 5,
    },
    {
      name: 'Ольга Васильева',
      company: 'Производство полуфабрикатов "Домашние"',
      text: 'Работаем с вакуумными упаковщиками от Техносиб уже 2 года. За это время ни одной поломки! Гарантийное обслуживание отработало четко. Планируем расширяться и заказать еще одну модель.',
      rating: 5,
    },
  ];

  const compareData = [
    { feature: 'Тип', t300: 'Настольная', f500: 'Напольная', f600d: 'Напольная' },
    { feature: 'Камеры', t300: '1', f500: '1', f600d: '2' },
    { feature: 'Размер камеры', t300: '300×250×100', f500: '500×400×150', f600d: '600×500×200' },
    { feature: 'Производительность', t300: '2-3 цикла/мин', f500: '3-4 цикла/мин', f600d: '5-6 циклов/мин' },
    { feature: 'Насос', t300: '20 м³/ч', f500: '40 м³/ч', f600d: '63 м³/ч' },
    { feature: 'Запайка', t300: '300 мм', f500: '500 мм', f600d: '600 мм' },
    { feature: 'Газонаполнение', t300: '✓', f500: '✓', f600d: '✓' },
    { feature: 'Цена', t300: 'от 150 000 ₽', f500: 'от 280 000 ₽', f600d: 'от 420 000 ₽' },
  ];

  const options = [
    {
      title: 'Газонаполнение (MAP)',
      desc: 'Модифицированная атмосфера с инертным газом увеличивает срок годности в 3-5 раз',
      benefits: ['Снижение окисления на 90%', 'Сохранение цвета мяса', 'Защита от бактерий'],
      icon: 'Droplets',
    },
    {
      title: 'Автоматическая запайка/обрезка',
      desc: 'Двойной шов и чистая обрезка края пакета за один цикл',
      benefits: ['Идеальный товарный вид', 'Экономия времени', '100% герметичность'],
      icon: 'Scissors',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-primary"><img src="https://cdn.poehali.dev/files/34a7b0b3-ab44-4d30-b123-e01bb56afd38.jpg" alt="Техносиб" className="h-11" /></div>
          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="tel:+74951471362" 
              className="text-lg font-bold text-primary hover:text-accent transition-colors flex items-center gap-2"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).ym) {
                  (window as any).ym(105605669, 'reachGoal', 'сlick_phone');
                }
              }}
            >
              <Icon name="Phone" size={20} />
              +7 (495) 147-13-62
            </a>
            <a href="#equipment" className="text-sm hover:text-primary transition-colors">Оборудование</a>
            <a href="#advantages" className="text-sm hover:text-primary transition-colors">Преимущества</a>
            <a href="#catalog" className="text-sm hover:text-primary transition-colors">Каталог</a>
            <a href="#application" className="text-sm hover:text-primary transition-colors">Применение</a>
            <a href="#options" className="text-sm hover:text-primary transition-colors">Опции</a>
            <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">Как работает</a>
            <a href="#service" className="text-sm hover:text-primary transition-colors">Сервис</a>
            <a href="#faq" className="text-sm hover:text-primary transition-colors">FAQ</a>
            <a href="#contact" className="text-sm hover:text-primary transition-colors">Контакты</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button className="bg-accent hover:bg-accent/90 text-base sm:text-lg font-bold px-5 py-5 sm:px-6 sm:py-6 shadow-lg transform hover:scale-105 transition-all" onClick={() => setModalOpen(true)}>
              <Icon name="Phone" size={20} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Заказать звонок</span>
              <span className="sm:hidden">Звонок</span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
            </Button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white animate-fade-in">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <a href="#equipment" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Оборудование</a>
              <a href="#advantages" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Преимущества</a>
              <a href="#catalog" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Каталог</a>
              <a href="#application" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Применение</a>
              <a href="#options" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Опции</a>
              <a href="#how-it-works" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Как работает</a>
              <a href="#service" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Сервис</a>
              <a href="#faq" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <a href="#contact" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Контакты</a>
            </nav>
          </div>
        )}
      </header>

      <section className="relative bg-gradient-to-br from-secondary via-secondary to-primary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                Промышленные вакуум-упаковщики по доступным ценам
              </h1>
              <p className="text-base sm:text-lg mb-3 md:mb-4 text-white/90">
                Гарантия до 3 лет. Мощные насосы. Напольные и настольные модели. Двойной шов. Газонаполнение. Автоматические программы. Мягкий обжим. Китайские и европейские производители
              </p>
              <p className="text-sm sm:text-base mb-6 md:mb-8 text-white/80">
                Бесплатное тестирование в демозале
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 mb-6 md:mb-8">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto text-base sm:text-xl font-bold px-8 py-6 shadow-2xl transform hover:scale-105 transition-all" onClick={() => setModalOpen(true)}>
                  <Icon name="FileText" size={24} className="mr-3" />
                  <span className="truncate">Получить КП</span>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/30 border-2 text-white hover:bg-white/20 w-full sm:w-auto text-base sm:text-xl font-bold px-8 py-6 transform hover:scale-105 transition-all" onClick={() => setModalOpen(true)}>
                  <Icon name="Calendar" size={24} className="mr-3" />
                  Записаться в демозал
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="ShieldCheck" size={18} className="flex-shrink-0" />
                  <span>CE, ISO 9001</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={18} className="flex-shrink-0" />
                  <span>24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Truck" size={18} className="flex-shrink-0" />
                  <span>Доставка РФ и СНГ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Settings" size={18} className="flex-shrink-0" />
                  <span>Пусконаладка бесплатно</span>
                </div>
              </div>
            </div>
            <div className="relative animate-scale-in hidden md:block">
              <img
                src="https://cdn.poehali.dev/files/9c7ca575-7502-41a8-bb53-38a599d3d21b.png"
                alt="Вакуумный упаковщик HVC-400/2T"
                className="rounded-lg shadow-2xl w-full bg-white p-8"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent text-white p-4 md:p-6 rounded-lg shadow-xl">
                <div className="text-xl md:text-2xl font-bold whitespace-nowrap">До 3-х лет</div>
                <div className="text-xs md:text-sm">гарантия</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="advantages" ref={advantagesAnim.ref as React.RefObject<HTMLElement>} className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className={`text-4xl sm:text-5xl font-bold text-center mb-12 ${advantagesAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>Преимущества оборудования</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {advantages.map((adv, idx) => (
              <Card key={idx} className={`text-center hover:shadow-lg transition-shadow ${advantagesAnim.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: `${idx * 0.05}s` }}>
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 overflow-hidden rounded-lg">
                    <img src={adv.image} alt={adv.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold mb-2 text-base sm:text-lg">{adv.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{adv.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 w-full sm:w-auto text-base sm:text-xl font-bold px-10 py-7 shadow-2xl transform hover:scale-105 transition-all" onClick={() => setModalOpen(true)}>
              <Icon name="Zap" size={24} className="mr-3" />
              <span className="hidden sm:inline">🎯 Подобрать модель под вашу задачу</span>
              <span className="sm:hidden">🎯 Подобрать модель</span>
            </Button>
          </div>
        </div>
      </section>

      <section id="catalog" ref={equipmentAnim.ref as React.RefObject<HTMLElement>} className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in-up">Каталог оборудования</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Выберите подходящее вакуумно-упаковочное оборудование для вашего производства
          </p>
          <ProductCatalog onInquiry={(productName) => {
            setModalOpen(true);
          }} />
        </div>
      </section>

      <section id="application" ref={applicationAnim.ref as React.RefObject<HTMLElement>} className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${applicationAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>Применение</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {applications.map((app, idx) => (
              <Card key={idx} className={`hover:shadow-lg transition-shadow ${applicationAnim.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon name={app.icon} size={32} className="text-primary" />
                  </div>
                  <CardTitle className="text-lg">{app.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {app.benefits.map((benefit, bidx) => (
                      <li key={bidx} className="flex items-start gap-2 text-sm">
                        <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-xl font-bold px-8 py-6 border-4 border-accent text-accent hover:bg-accent hover:text-white transform hover:scale-105 transition-all shadow-xl" onClick={() => setModalOpen(true)}>
              <Icon name="MessageCircle" size={24} className="mr-3" />
              <span className="hidden sm:inline">Получить рекомендации по упаковке вашего продукта</span>
              <span className="sm:hidden">Получить рекомендации</span>
            </Button>
          </div>
        </div>
      </section>

      <section id="options" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Опции и расходные материалы</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            {options.map((option, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <Icon name={option.icon} size={32} className="text-accent" />
                  </div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {option.benefits.map((benefit, bidx) => (
                      <li key={bidx} className="flex items-start gap-2 text-sm">
                        <Icon name="Check" size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>

                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" size="lg" onClick={() => setModalOpen(true)}>
              <Icon name="Package" size={18} className="mr-2" />
              Заказать расходники со склада
            </Button>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Как это работает</h2>
          <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto">
            Полный цикл вакуумной упаковки с автоматическими программами и контролем качества
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {workflowSteps.map((step, idx) => (
              <Card key={idx} className="bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name={step.icon} size={20} className="text-accent" />
                        <h3 className="font-bold">{step.title}</h3>
                      </div>
                      <p className="text-sm text-white/80">{step.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base sm:text-xl font-bold px-10 py-7 shadow-2xl transform hover:scale-105 transition-all" onClick={() => setModalOpen(true)}>
              <Icon name="Play" size={24} className="mr-3" />
              <span className="hidden sm:inline">🎬 Посмотреть демонстрацию</span>
              <span className="sm:hidden">🎬 Демонстрация</span>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur border-white/30 border-4 text-white hover:bg-white/20 w-full sm:w-auto text-base sm:text-xl font-bold px-10 py-7 shadow-2xl transform hover:scale-105 transition-all" onClick={() => setModalOpen(true)}>
              <Icon name="Calendar" size={24} className="mr-3" />
              📅 Записаться в демозал
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Гарантии и сертификаты</h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Icon name="ShieldCheck" size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Гарантия до 3 лет</div>
                    <div className="text-sm text-muted-foreground">На всё оборудование с бесплатной пусконаладкой</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Award" size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Сертификация CE, ISO 9001</div>
                    <div className="text-sm text-muted-foreground">Соответствие международным стандартам качества</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="FileCheck" size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold mb-1">Декларация соответствия</div>
                    <div className="text-sm text-muted-foreground">Документы для работы на территории РФ и СНГ</div>
                  </div>
                </div>
              </div>

            </div>
            <div className="relative">
              <img
                src="https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/218b98b1-a3fe-4c2b-aa7d-95189e411ab1.jpg"
                alt="Вакуумная упаковка продукции"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="service" ref={serviceAnim.ref as React.RefObject<HTMLElement>} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${serviceAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>Сервис и доставка</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className={`${serviceAnim.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0s' }}>
              <CardHeader>
                <Icon name="MapPin" size={32} className="text-primary mb-2" />
                <CardTitle className="text-lg">Наличие на складах</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">В Новосибирске и Москве</p>
              </CardContent>
            </Card>
            <Card className={`${serviceAnim.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <Icon name="Truck" size={32} className="text-primary mb-2" />
                <CardTitle className="text-lg">Доставка РФ и СНГ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Экспресс-отправка со склада в день оплаты</p>
              </CardContent>
            </Card>
            <Card className={`${serviceAnim.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <Icon name="GraduationCap" size={32} className="text-primary mb-2" />
                <CardTitle className="text-lg">Обучение персонала</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Инструктаж на объекте клиента включён</p>
              </CardContent>
            </Card>
            <Card className={`${serviceAnim.isVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <Icon name="CreditCard" size={32} className="text-primary mb-2" />
                <CardTitle className="text-lg">Лизинг и рассрочка</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Гибкие условия оплаты и финансирования</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="testimonials" ref={testimonialsAnim.ref as React.RefObject<HTMLElement>} className="py-16">
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${testimonialsAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>Отзывы наших клиентов</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className={`hover:shadow-lg transition-shadow ${testimonialsAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${idx * 0.15}s` }}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="User" size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </section>

      <section id="faq" ref={faqAnim.ref as React.RefObject<HTMLElement>} className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className={`text-3xl font-bold text-center mb-12 ${faqAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>Часто задаваемые вопросы</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className={`bg-white border rounded-lg px-6 ${faqAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-8">
            <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base" onClick={() => setModalOpen(true)}>
              <Icon name="HelpCircle" size={18} className="mr-2" />
              <span className="hidden sm:inline">Не нашли ответ? Задайте вопрос</span>
              <span className="sm:hidden">Задать вопрос</span>
            </Button>
          </div>
        </div>
      </section>

      <section id="contact" className="py-12 sm:py-16 bg-gradient-to-br from-secondary to-primary text-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">Получить коммерческое предложение</h2>
          <p className="text-center mb-6 sm:mb-8 text-white/80 text-sm sm:text-base">Заполните форму — менеджер свяжется в течение 15 минут</p>
          <form onSubmit={handleFormSubmit} className="bg-white rounded-lg p-4 sm:p-8 text-foreground">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="name">Имя *</Label>
                <Input id="name" required className="mt-1" onChange={(e) => setFormData({ ...formData, name: e.target.value })}/>
              </div>
              <div>
                <Label htmlFor="phone">Телефон *</Label>
                <Input id="phone" type="tel" required className="mt-1" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })} placeholder="+7 (999) 999-99-99"/>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required className="mt-1" onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
              </div>
              <div>
                <Label htmlFor="company">Компания</Label>
                <Input id="company" className="mt-1" onChange={(e) => setFormData({ ...formData, company: e.target.value })}/>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="producttype">Тип продукта</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, productType: value })}>
                  <SelectTrigger id="producttype" className="mt-1">
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meat">Мясо</SelectItem>
                    <SelectItem value="fish">Рыба</SelectItem>
                    <SelectItem value="cheese">Сыр</SelectItem>
                    <SelectItem value="other">Непищевой</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="modeltype">Тип модели</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, modeltype: value })}>
                  <SelectTrigger id="modeltype" className="mt-1">
                    <SelectValue placeholder="Выберите"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tabletop-1">Настольная, 1 камера</SelectItem>
                    <SelectItem value="tabletop-2">Настольная, 2 камеры</SelectItem>
                    <SelectItem value="floor-1">Напольная, 1 камера</SelectItem>
                    <SelectItem value="floor-2">Напольная, 2 камеры</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="comment">Комментарий</Label>
              <Textarea id="comment" rows={3} className="mt-1" onChange={(e) => setFormData({ ...formData, comment: e.target.value })}/>
            </div>
            <div className="flex items-start gap-2 mb-6">
              <input type="checkbox" id="consent" required className="mt-1" />
              <Label htmlFor="consent" className="text-sm text-muted-foreground">
                Согласен на обработку персональных данных
              </Label>
            </div>
            <div className="mb-4">
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
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-white">
              <Icon name="Send" size={18} className="mr-2" />
              Получить коммерческое предложение
            </Button>
          </form>
        </div>
      </section>

      <footer className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Техносиб</h3>
              <p className="text-sm text-white/70">
                Промышленное вакуум-упаковочное оборудование от проверенных производителей
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Меню</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#equipment" className="text-white/70 hover:text-white transition-colors">Оборудование</a></li>
                <li><a href="#advantages" className="text-white/70 hover:text-white transition-colors">Преимущества</a></li>
                <li><a href="#application" className="text-white/70 hover:text-white transition-colors">Применение</a></li>
                <li><a href="#service" className="text-white/70 hover:text-white transition-colors">Сервис</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#catalog" className="text-white/70 hover:text-white transition-colors">Каталог оборудования</a></li>
                <li><a href="https://t-sib.ru/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">Смотреть весь каталог</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  <a 
                    href="tel:+74951471362" 
                    className="text-white/70 hover:text-white transition-colors"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).ym) {
                        (window as any).ym(105605669, 'reachGoal', 'сlick_phone');
                      }
                    }}
                  >
                    +7 (495) 147-13-62
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="MapPin" size={16} className="mt-1 flex-shrink-0" />
                  <span className="text-white/70">Москва: ш. Энтузиастов, д. 56, стр. 32, офис 115</span>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="MapPin" size={16} className="mt-1 flex-shrink-0" />
                  <span className="text-white/70">Новосибирск: ул. Электрозаводская, 2 к1, офис 304,314</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 text-center text-sm text-white/60 space-y-2">
            <p>© 2025 Техносиб. Все права защищены.</p>
            <p className="text-xs">
              Информация, представленная на сайте, не является публичной офертой. Данный интернет-сайт носит исключительно информационный характер и не является публичной офертой, определяемой положениями ч. 2 ст. 437 Гражданского кодекса РФ.
            </p>
          </div>
        </div>
      </footer>

      <ContactModal open={modalOpen} onOpenChange={setModalOpen} />
      {/* <Messengers /> */}
    </div>
  );
};

export default Index;