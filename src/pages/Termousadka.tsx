import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { ContactModal } from '@/components/ContactModal';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import ShrinkCatalog from '@/components/ShrinkCatalog';
import SimpleCatalog from '@/components/SimpleCatalog';
import ShrinkFAQ from '@/components/ShrinkFAQ';
import QuizWidget from '@/components/QuizWidget';
import QuizSidebar from '@/components/QuizSidebar';
import { getUtmFromCookies } from '@/lib/utm';
import VideoCard from '@/components/VideoCard';

const Termousadka = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', url: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    utmParams.forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        document.cookie = `${param}=${value}; path=/; max-age=2592000`;
      }
    });
  }, []);

  const advantagesAnim = useScrollAnimation();
  const catalogAnim = useScrollAnimation();
  const applicationAnim = useScrollAnimation();
  const signsAnim = useScrollAnimation();
  const consumablesAnim = useScrollAnimation();
  const accessoriesAnim = useScrollAnimation();
  const serviceAnim = useScrollAnimation();
  const aboutAnim = useScrollAnimation();
  const faqAnim = useScrollAnimation();
  const contactAnim = useScrollAnimation();
  const quizAnim = useScrollAnimation();

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

    const sourcePage = 'https://vacuum.t-sib.ru/termousadka/';
    const productValue = selectedProduct || '';
    const sourceLine = `[Источник: Термоусадочное оборудование — ${sourcePage}]`;
    const productLine = productValue ? `[Товар: ${productValue}]` : '';
    const combined = [sourceLine, productLine].filter(Boolean).join('\n');
    const submitData = {
      ...formData,
      comment: combined,
      message: combined,
      comments: combined,
      product: productValue,
      product_name: productValue,
      productName: productValue,
      model: productValue,
      modeltype: productValue,
      productType: productValue,
      url: sourcePage,
      source_page: sourcePage,
      page_title: 'Термоусадочное оборудование',
      lead_title: productValue ? `Термоусадка: ${productValue}` : 'Термоусадка',
      ...getUtmFromCookies(),
    };

    fetch('/api/b24-send-lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    }).catch(() => {});

    toast({
      title: "Заявка отправлена!",
      description: "Коммерческое предложение придёт на email, менеджер свяжется в течение 15 минут",
    });
    setFormData({ name: '', phone: '', email: '', url: '' });
  };

  const advantages = [
    { icon: 'Package', title: 'Широкий ассортимент', desc: 'В наличии ручные и полуавтоматические упаковщики, а также автоматические линии' },
    { icon: 'Layers', title: 'Штучная и групповая', desc: 'Термоусадочные машины для штучной и групповой упаковки' },
    { icon: 'Film', title: 'Любой тип плёнки', desc: 'Для ПОФ/ПВХ или полиэтиленовой (ПЭ) плёнки' },
    { icon: 'Gauge', title: 'Высокая скорость', desc: 'Производительность от 300 до 3 600 упаковок в час' },
    { icon: 'Minimize', title: 'Компактная упаковка', desc: 'Самый компактный вид упаковки' },
    { icon: 'Shield', title: 'Надёжная защита', desc: 'Надёжная защита товара от вскрытия и внешней среды' },
    { icon: 'Settings', title: 'Простота и универсальность', desc: 'Простота эксплуатации и универсальность' },
    { icon: 'ShoppingCart', title: 'E-commerce', desc: 'Самый востребованный вид упаковки товаров в E-commerce' },
  ];

  const applications = [
    {
      emoji: '\u{1F969}',
      title: 'Пищевая промышленность',
      items: ['Обтяжка лотков и подложек', 'Групповая упаковка бутылок/банок/пакетов', 'Защита от пыли и загрязнений', 'Контроль вскрытия'],
    },
    {
      emoji: '\u{1F37A}',
      title: 'Напитки и розлив',
      items: ['Мультипаки бутылок (ПЭТ, стекло)', 'Термоусадочные колпачки', 'Групповая упаковка банок', 'Палетная обмотка'],
    },
    {
      emoji: '\u{1F4E6}',
      title: 'Полиграфия и канцелярия',
      items: ['Упаковка книг/журналов/каталогов', 'Обтяжка наборов тетрадей', 'Защита от влаги и пыли', 'Презентабельный товарный вид'],
    },
    {
      emoji: '\u{1F9F4}',
      title: 'Бытовая химия и хозтовары',
      items: ['Групповая упаковка моющих средств', 'Фиксация крышек и дозаторов', 'Упаковка наборов и промо-комплектов', 'Защита этикетки'],
    },
    {
      emoji: '\u{1F48A}',
      title: 'Фармацевтика',
      items: ['Обтяжка коробок с лекарствами', 'Герметичная защита от вскрытия', 'Соответствие стандартам GMP', 'Защита от контрафакта'],
    },
    {
      emoji: '\u{1F527}',
      title: 'Запчасти и комплектующие',
      items: ['Упаковка подшипников/фильтров', 'Защита от коррозии и влаги', 'Комплектация наборов', 'Удобная идентификация на складе'],
    },
    {
      emoji: '\u{1F381}',
      title: 'Подарки и сувениры',
      items: ['Обтяжка подарочных коробок', 'Эстетичный глянцевый вид', 'Упаковка нестандартных форм', 'Перфорация для лёгкого вскрытия'],
    },
    {
      emoji: '\u{1F3ED}',
      title: 'Строительные материалы',
      items: ['Групповая упаковка плитки/панелей', 'Обтяжка длинномерных изделий', 'Защита от повреждений', 'Палетная стабилизация'],
    },
  ];

  const signs = [
    {
      emoji: '\u{270B}',
      title: 'Вы до сих пор упаковываете вручную',
      items: [
        'Ручная обмотка — потеря 3\u20135 часов в смену',
        'Неравномерная усадка, заломы',
        'Торговые сети отказывают в приёмке',
        'Решение: базовый полуавтомат окупается за 2\u20134 месяца',
      ],
    },
    {
      emoji: '\u{1F4C8}',
      title: 'Текущий аппарат не справляется с объёмами',
      items: [
        'Заказов больше, аппарат на пределе',
        'Очереди на упаковку тормозят отгрузку',
        'Теряете клиентов из-за срывов сроков',
        'Решение: переход на более производительную модель',
      ],
    },
    {
      emoji: '\u{1F527}',
      title: 'Частые поломки и простои',
      items: [
        'Аппарат ломается чаще раза в месяц',
        'Запчасти ждать неделями',
        'Стоимость ремонтов за год приближается к цене нового',
        'Решение: замена на современный аппарат с гарантией',
      ],
    },
    {
      emoji: '\u{274C}',
      title: 'Высокий процент брака упаковки',
      items: [
        'Плёнка морщится, не усаживается',
        'Прожоги и отверстия',
        'Переупаковка 10\u201315% продукции',
        'Решение: современные модели снижают брак до 1\u20132%',
      ],
    },
    {
      emoji: '\u{1F39E}\u{FE0F}',
      title: 'Оборудование не работает с нужным типом плёнки',
      items: [
        'Старый аппарат только на ПВХ, нужна ПОФ',
        'Невозможность перейти на экологичные материалы',
        'Клиенты требуют конкретный тип',
        'Решение: новые аппараты работают с ПОФ, ПВХ, ПЭ',
      ],
    },
    {
      emoji: '\u{1F3EA}',
      title: 'Вы выходите в торговые сети или на маркетплейсы',
      items: [
        'Жёсткие требования к качеству',
        'Wildberries, Ozon требуют герметичную упаковку',
        'Ручная упаковка не проходит приёмку',
        'Решение: термоусадочный аппарат обеспечивает стандарты ритейла',
      ],
    },
    {
      emoji: '\u{1F680}',
      title: 'Вы запускаете новый продукт или линейку',
      items: [
        'Новый продукт требует другого формата',
        'Нужна групповая упаковка или мультипаки',
        'Существующее оборудование не подходит по размерам',
        'Решение: подбор аппарата точно под габариты',
      ],
    },
  ];

  const services = [
    { icon: 'MapPin', title: 'Наличие на складах', desc: 'В Новосибирске и Москве' },
    { icon: 'Truck', title: 'Доставка РФ и СНГ', desc: 'Экспресс-отправка со склада в день оплаты' },
    { icon: 'GraduationCap', title: 'Обучение персонала', desc: 'Инструктаж на объекте клиента включён' },
    { icon: 'CreditCard', title: 'Лизинг и рассрочка', desc: 'Гибкие условия оплаты и финансирования' },
  ];

  const industryBadges = [
    'Пищевая промышленность',
    'Напитки',
    'Фарма/Косметика',
    'Бытовая химия',
    'Склады/Логистика',
    'E-commerce',
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-xl text-primary">
            <img src="https://cdn.poehali.dev/files/34a7b0b3-ab44-4d30-b123-e01bb56afd38.jpg" alt="Техносиб" className="h-11" />
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="tel:+74951471362" className="text-lg font-bold text-primary hover:text-accent transition-colors flex items-center gap-2" onClick={() => { if (typeof window !== 'undefined' && (window as any).ym) { (window as any).ym(105605669, 'reachGoal', 'сlick_phone'); } }}>
              <Icon name="Phone" size={20} />+7 (495) 147-13-62
            </a>
            <div className="relative group">
              <button className="text-sm hover:text-primary transition-colors flex items-center gap-1">
                Оборудование
                <Icon name="ChevronDown" size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="bg-white border border-border shadow-lg rounded-lg py-2 min-w-[240px]">
                  <a href="/" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">Вакуумное оборудование</a>
                  <a href="/traysealers" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">Запайщики лотков</a>
                </div>
              </div>
            </div>
            <a href="#advantages" className="text-sm hover:text-primary transition-colors">Преимущества</a>
            <a href="#catalog" className="text-sm hover:text-primary transition-colors">Каталог</a>
            <a href="#application" className="text-sm hover:text-primary transition-colors">Применение</a>
            <a href="#signs" className="text-sm hover:text-primary transition-colors">Когда покупать</a>
            <a href="#service" className="text-sm hover:text-primary transition-colors">Сервис</a>
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
              <div className="py-2 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Оборудование</p>
                <a href="/" className="block text-sm hover:text-primary transition-colors py-1.5 pl-3" onClick={() => setMobileMenuOpen(false)}>Вакуумное оборудование</a>
                <a href="/traysealers" className="block text-sm hover:text-primary transition-colors py-1.5 pl-3" onClick={() => setMobileMenuOpen(false)}>Запайщики лотков</a>
              </div>
              <a href="#advantages" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Преимущества</a>
              <a href="#catalog" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Каталог</a>
              <a href="#application" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Применение</a>
              <a href="#signs" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Когда покупать</a>
              <a href="#service" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Сервис</a>
              <a href="#contact" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Контакты</a>
            </nav>
          </div>
        )}
      </header>

      <section className="relative bg-gradient-to-r from-secondary via-secondary to-primary overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6 animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading leading-tight">
                Термоусадочное оборудование до 3 600 упаковок в час
              </h1>
              <ul className="text-lg sm:text-xl md:text-2xl text-white/85 leading-relaxed space-y-3">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-accent mt-1 shrink-0" />
                  <span>Оборудование под любые размеры и формы от европейских, азиатских и российских производителей</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-accent mt-1 shrink-0" />
                  <span>Для штучной и групповой упаковки. Термоусадочные танки и термоформеры</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-accent mt-1 shrink-0" />
                  <span>Ровный шов без налипания пленки</span>
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-lg font-bold px-8 py-6 shadow-lg transform hover:scale-105 transition-all"
                  onClick={() => setModalOpen(true)}
                >
                  <Icon name="Phone" size={20} className="mr-2" />
                  Получить КП
                </Button>
                <Button
                  size="lg"
                  className="bg-white/20 backdrop-blur border-2 border-white/30 text-white hover:bg-white/30 text-lg font-bold px-8 py-6"
                  onClick={() => {
                    document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Icon name="ClipboardList" size={20} className="mr-2" />
                  Подобрать оборудование
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 border-2 text-white hover:bg-white/20 bg-white/10 text-lg font-bold px-8 py-6"
                  onClick={() => {
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Icon name="ArrowDown" size={20} className="mr-2" />
                  Смотреть каталог
                </Button>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <img
                src="https://cdn.poehali.dev/files/2eff1564-1e44-49bf-b3b2-da1d458d1ea0.png"
                alt="Термоусадочное оборудование"
                className="rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>

      </section>

      <section
        id="advantages"
        ref={advantagesAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              Преимущества термоусадочного оборудования от Техно-Сиб
            </h2>
          </div>
          <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${advantagesAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            {advantages.map((adv, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-border/50">
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon name={adv.icon} size={24} className="text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-heading">{adv.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-base sm:text-lg">{adv.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="catalog"
        ref={catalogAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              Каталог термоусадочного оборудования
            </h2>
          </div>
          <div>
            <ShrinkCatalog onInquiry={(productName) => {
              setSelectedProduct(productName);
              setModalOpen(true);
            }} />
          </div>
        </div>
      </section>

      <section
        id="application"
        ref={applicationAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              Где применяется термоусадочное оборудование?
            </h2>
          </div>
          <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${applicationAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            {applications.map((app, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-border/50">
                <CardHeader className="pb-3">
                  <div className="text-4xl mb-2">{app.emoji}</div>
                  <CardTitle className="text-xl sm:text-2xl font-heading">{app.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {app.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-base sm:text-lg text-muted-foreground">
                        <Icon name="Check" size={16} className="text-primary mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-center mb-4">Посмотрите как работает наше оборудование</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">Видео с реальной работой термоусадочного оборудования на производстве</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <VideoCard embedId="cea7e294490190af4e9d0dd10a018f75" title="Термоусадочная упаковка" />
            <VideoCard embedId="3aa838c3f9ac0f034175ba042f4d88c6" title="Термоусадочный тоннель" />
          </div>
        </div>
      </section>

      <section
        id="signs"
        ref={signsAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              7 признаков, что вам нужен новый термоусадочный аппарат
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Узнали хотя бы 2 пункта? Пора действовать.
            </p>
          </div>
          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10 transition-all duration-700 ${signsAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            {signs.map((sign, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{sign.emoji}</span>
                    <CardTitle className="text-xl sm:text-2xl font-heading">
                      <span className="text-primary font-bold mr-2">{index + 1}.</span>
                      {sign.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sign.items.map((item, i) => (
                      <li key={i} className={`flex items-start gap-2 text-base sm:text-lg ${i === sign.items.length - 1 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                        <Icon name={i === sign.items.length - 1 ? 'CheckCircle' : 'AlertCircle'} size={18} className={`mt-0.5 shrink-0 ${i === sign.items.length - 1 ? 'text-primary' : 'text-accent'}`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12">
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold font-heading mb-3">Узнали свою ситуацию?</h3>
                <p className="text-white/80 mb-6 text-lg">
                  Оставьте заявку — подберём оптимальный аппарат под ваши задачи и бюджет за 1 рабочий день.
                </p>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-lg font-bold px-8 py-6 shadow-lg transform hover:scale-105 transition-all"
                  onClick={() => setModalOpen(true)}
                >
                  <Icon name="Send" size={20} className="mr-2" />
                  Получить персональный подбор
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="consumables"
        ref={consumablesAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              Расходные материалы
            </h2>
          </div>
          <div className={`transition-all duration-700 ${consumablesAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <SimpleCatalog
              categories={[
                { id: 354, name: 'Плёнка ПВХ' },
                { id: 357, name: 'Плёнка ПОФ' },
              ]}
              cacheKey="consumablesProducts"
              onInquiry={() => setModalOpen(true)}
            />
          </div>
        </div>
      </section>

      <section
        id="accessories"
        ref={accessoriesAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              Сопутствующие товары
            </h2>
          </div>
          <div className={`transition-all duration-700 ${accessoriesAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <SimpleCatalog
              categories={[
                { id: 353, name: 'Лотки' },
                { id: 355, name: 'Плёнка ПВД' },
              ]}
              cacheKey="accessoriesProducts"
              onInquiry={() => setModalOpen(true)}
            />
          </div>
        </div>
      </section>

      <section
        id="service"
        ref={serviceAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              Сервис и доставка
            </h2>
          </div>
          <div className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${serviceAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            {services.map((srv, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-border/50 text-center">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon name={srv.icon} size={28} className="text-primary" />
                  </div>
                  <CardTitle className="text-lg font-heading">{srv.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{srv.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="quiz"
        ref={quizAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-10 transition-all duration-700 ${quizAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-3">
              Подберём оборудование
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ответьте на 6 вопросов, и мы предложим оптимальное решение под ваши задачи
            </p>
          </div>
          <div className={`max-w-3xl mx-auto bg-background rounded-2xl shadow-lg border p-6 md:p-10 transition-all duration-700 ${quizAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <QuizWidget />
          </div>
        </div>
      </section>

      <section
        ref={aboutAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              О компании ТЕХНО-СИБ
            </h2>
          </div>
          <div className={`transition-all duration-700 ${aboutAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon name="Calendar" size={28} className="text-primary" />
                  </div>
                  <CardTitle className="text-lg font-heading">25 лет на рынке</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Опыт работы с 2001 года</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon name="MapPin" size={28} className="text-primary" />
                  </div>
                  <CardTitle className="text-lg font-heading">2 города</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Офисы в Москве и Новосибирске</p>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon name="Globe" size={28} className="text-primary" />
                  </div>
                  <CardTitle className="text-lg font-heading">Проверенные партнёры</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">Из Европы, России и Китая</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-xl">
              <CardContent className="p-6 sm:p-10">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Компания <strong className="text-foreground">«Техно-Сиб»</strong> — надёжный поставщик и партнёр в сфере профессионального пищевого и фасовочно-упаковочного оборудования. Мы работаем с 2001 года и уже 25 лет помогаем предприятиям эффективно оснащать производства и склады, предоставляем сервисное обслуживание, а также реализуем упаковочные и расходные материалы.
                </p>

                <div className="border-l-4 border-primary bg-primary/5 rounded-r-lg p-4 sm:p-6 my-6">
                  <p className="text-foreground font-medium">
                    Мы сотрудничаем с ведущими заводами-производителями Европы, России и Китая, подбирая решения под задачи и бюджет клиента.
                  </p>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Собственные офисы продаж, склады, сервисная служба и отлаженная логистика в Москве и Новосибирске позволяют нам оперативно выполнять поставки и поддерживать оборудование на территории России и стран СНГ.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Экспертиза наших специалистов помогает решать задачи любого уровня сложности — от подбора единичной позиции до комплексного оснащения. <strong className="text-foreground">«Техно-Сиб»</strong> всегда предложит оптимальное решение для вашего бизнеса и обеспечит надёжную поддержку на всех этапах работы.
                </p>

                <div className="border-t border-border mt-8 pt-8">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Icon name="CheckCircle" size={22} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">Комплексные решения</p>
                        <p className="text-sm text-muted-foreground">От подбора оборудования до сервисного обслуживания</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="CheckCircle" size={22} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">Быстрая доставка</p>
                        <p className="text-sm text-muted-foreground">Собственная логистика по всей России и СНГ</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="CheckCircle" size={22} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">Сервисная поддержка</p>
                        <p className="text-sm text-muted-foreground">Гарантийное и постгарантийное обслуживание</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="CheckCircle" size={22} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">Экспертная консультация</p>
                        <p className="text-sm text-muted-foreground">Помощь в выборе оптимального решения</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        ref={faqAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              Часто задаваемые вопросы
            </h2>
          </div>
          <div className={`transition-all duration-700 ${faqAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <ShrinkFAQ />
          </div>
        </div>
      </section>

      <section
        id="contact"
        ref={contactAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24 bg-gradient-to-r from-secondary to-primary"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4 text-white">
              Получите коммерческое предложение
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Заполните форму — менеджер свяжется в течение 15 минут
            </p>
          </div>
          <div className={`max-w-xl mx-auto transition-all duration-700 ${contactAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}>
            <Card className="shadow-2xl">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Имя *</Label>
                      <Input
                        id="contact-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ваше имя"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-phone">Телефон *</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                        placeholder="+7 (999) 999-99-99"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
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
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 py-6 text-lg font-bold shadow-lg transform hover:scale-105 transition-all">
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-white/70 text-sm">Поставка упаковочного оборудования и расходных материалов для пищевой и непищевой промышленности</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Контакты</h3>
              <div className="space-y-2 text-white/70 text-sm">
                <a href="tel:+74951471362" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Icon name="Phone" size={16} />+7 (495) 147-13-62
                </a>
                <a href="mailto:vacuum@t-sib.ru" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Icon name="Mail" size={16} />vacuum@t-sib.ru
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">Навигация</h3>
              <div className="space-y-2 text-white/70 text-sm">
                <a href="/" className="block hover:text-white transition-colors">Вакуумные упаковщики</a>
                <a href="/termousadka" className="block hover:text-white transition-colors">Термоусадочное оборудование</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/50 text-sm">
            &copy; 2026 Техносиб. Все права защищены.
          </div>
        </div>
      </footer>

      <ContactModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setSelectedProduct('');
        }}
        productName={selectedProduct}
      />
      <QuizSidebar />
    </div>
  );
};

export default Termousadka;