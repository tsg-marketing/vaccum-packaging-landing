import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { ContactModal } from '@/components/ContactModal';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import TraysealerCatalog from '@/components/TraysealerCatalog';
import { getUtmFromCookies } from '@/lib/utm';

const Traysealers = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    productType: '',
    modeltype: '',
    comment: '',
    url: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const serviceAnim = useScrollAnimation();
  const aboutAnim = useScrollAnimation();
  const contactAnim = useScrollAnimation();

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

    const submitData = { ...formData, url: window.location.href, ...getUtmFromCookies() };

    fetch('/api/b24-send-lead.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData),
    }).catch(() => {});

    toast({
      title: 'Заявка отправлена!',
      description: 'Коммерческое предложение придёт на email, менеджер свяжется в течение 15 минут',
    });
    setFormData({ name: '', phone: '', email: '', company: '', productType: '', modeltype: '', comment: '', url: '' });
  };

  const handleCatalogInquiry = (productName: string) => {
    setFormData(prev => ({ ...prev, comment: `Интересует: ${productName}` }));
    setModalOpen(true);
  };

  const advantages = [
    { icon: 'Package', title: 'Любая ширина плёнки', desc: 'В наличии машины под ширину плёнки от 100 мм до 600 мм' },
    { icon: 'Cpu', title: 'Автоподача продукта', desc: 'Комплектация системами автоматической подачи продукта' },
    { icon: 'Wind', title: 'Газ, спирт, вакуум', desc: 'Опции подачи газа (MAP), впрыска спирта, откачки воздуха' },
    { icon: 'Eye', title: 'Работа с плёнкой с печатью', desc: 'Все машины комплектуются фотодатчиками' },
    { icon: 'ArrowDownUp', title: 'Верхняя и нижняя подача', desc: 'Цепной и ленточный конвейер — подберём под ваш продукт' },
    { icon: 'RefreshCw', title: 'Разные системы запайки', desc: 'Ротационные 2–4-х позиционные, box-motion' },
    { icon: 'Film', title: 'Любая плёнка', desc: 'BOPP, барьерные, термоусадочные POF/PVC-плёнки' },
    { icon: 'Printer', title: 'Дополнительные опции', desc: 'Принтеры, аппликаторы этикетки, перфорация, еврослот' },
  ];

  const services = [
    { icon: 'MapPin', title: 'Наличие на складах', desc: 'В Новосибирске и Москве' },
    { icon: 'Truck', title: 'Доставка РФ и СНГ', desc: 'Экспресс-отправка со склада в день оплаты' },
    { icon: 'GraduationCap', title: 'Обучение персонала', desc: 'Инструктаж на объекте клиента включён' },
    { icon: 'CreditCard', title: 'Лизинг и рассрочка', desc: 'Гибкие условия оплаты и финансирования' },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-xl text-primary">
            <img src="https://cdn.poehali.dev/files/34a7b0b3-ab44-4d30-b123-e01bb56afd38.jpg" alt="Техносиб" className="h-11" />
          </a>
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
                  <a href="/termousadka" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">Термоусадка</a>
                  <a href="/traysealers" className="block px-4 py-2 text-sm hover:bg-muted transition-colors font-semibold text-primary">Запайщики лотков</a>
                </div>
              </div>
            </div>
            <a href="#advantages" className="text-sm hover:text-primary transition-colors">Преимущества</a>
            <a href="#catalog" className="text-sm hover:text-primary transition-colors">Каталог</a>
            <a href="#service" className="text-sm hover:text-primary transition-colors">Сервис</a>
            <a href="#contact" className="text-sm hover:text-primary transition-colors">Контакты</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              className="bg-accent hover:bg-accent/90 text-base sm:text-lg font-bold px-5 py-5 sm:px-6 sm:py-6 shadow-lg transform hover:scale-105 transition-all"
              onClick={() => setModalOpen(true)}
            >
              <Icon name="Phone" size={20} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Заказать звонок</span>
              <span className="sm:hidden">Звонок</span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white animate-fade-in">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <div className="py-2 border-b border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Оборудование</p>
                <a href="/" className="block text-sm hover:text-primary transition-colors py-1.5 pl-3" onClick={() => setMobileMenuOpen(false)}>Вакуумное оборудование</a>
                <a href="/termousadka" className="block text-sm hover:text-primary transition-colors py-1.5 pl-3" onClick={() => setMobileMenuOpen(false)}>Термоусадка</a>
                <a href="/traysealers" className="block text-sm text-primary font-semibold py-1.5 pl-3" onClick={() => setMobileMenuOpen(false)}>Запайщики лотков</a>
              </div>
              <a href="#advantages" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Преимущества</a>
              <a href="#catalog" className="text-sm hover:text-primary transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Каталог</a>
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
                Запайщики лотков до <span className="whitespace-nowrap">3&nbsp;600</span> упаковок в час
              </h1>
              <ul className="text-lg sm:text-xl md:text-2xl text-white/85 leading-relaxed space-y-3">
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-accent mt-1 shrink-0" />
                  <span>Автоматические, полуавтоматические, ручные запайщики в наличии</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-accent mt-1 shrink-0" />
                  <span>Герметичная запайка в вакуум, газ, скин</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="Check" size={20} className="text-accent mt-1 shrink-0" />
                  <span>Увеличивает срок хранения в 3–5 раз</span>
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
                src="https://cdn.poehali.dev/files/2c117cb4-9982-45bf-8444-b1c037f9439c.jpg"
                alt="Запайщик лотков HLV-400T"
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
              Преимущества запайщиков лотков от Техно-Сиб
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
        className="py-16 md:py-24 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              Каталог запайщиков лотков
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Выберите модель по типу управления и задаче
            </p>
          </div>
          <div>
            <TraysealerCatalog onInquiry={handleCatalogInquiry} />
          </div>
        </div>
      </section>

      <section id="showroom" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mb-4">
              Посмотрите оборудование в нашем Демо-Зале
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Приезжайте посмотреть, как работают запайщики лотков, вживую
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon name="MapPin" size={24} className="text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-heading">Москва</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base mb-4">
                  ш. Энтузиастов, д. 56, стр. 32, офис 115
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open('https://yandex.ru/maps/?text=Москва, шоссе Энтузиастов 56 строение 32', '_blank')}
                  >
                    <Icon name="Map" size={18} className="mr-2" />
                    На карте
                  </Button>
                  <Button
                    className="flex-1 bg-accent hover:bg-accent/90"
                    onClick={() => setModalOpen(true)}
                  >
                    <Icon name="Calendar" size={18} className="mr-2" />
                    Записаться
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon name="MapPin" size={24} className="text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-heading">Новосибирск</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base mb-4">
                  ул. Электрозаводская, 2 к1
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open('https://yandex.ru/maps/?text=Новосибирск, улица Электрозаводская 2 к1', '_blank')}
                  >
                    <Icon name="Map" size={18} className="mr-2" />
                    На карте
                  </Button>
                  <Button
                    className="flex-1 bg-accent hover:bg-accent/90"
                    onClick={() => setModalOpen(true)}
                  >
                    <Icon name="Calendar" size={18} className="mr-2" />
                    Записаться
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="warranty-delivery" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading mb-4">
              Гарантия и доставка
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Всё, что нужно знать об условиях получения оборудования
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <Card className="bg-muted/60 border-0 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center shrink-0">
                    <Icon name="ShieldCheck" size={24} className="text-background" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-heading">Гарантия</h3>
                </div>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Гарантийный срок на оборудование составляет <strong className="text-foreground">12 месяцев</strong> с момента передачи товара покупателю.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-0 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <Icon name="Truck" size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold font-heading">Доставка</h3>
                </div>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-5">
                  Мы доставляем оборудование <strong className="text-foreground">по всей России</strong> через транспортные компании.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Icon name="CheckCircle2" size={20} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-sm sm:text-base text-muted-foreground">
                      По желанию клиента — <strong className="text-foreground">БЕСПЛАТНАЯ доставка</strong> до терминала любой транспортной компании в пределах г. Новосибирск.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="Building2" size={20} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-sm sm:text-base text-muted-foreground">
                      Перевозчики: <strong className="text-foreground">«Деловые линии», «ПЭК», «СДЭК»</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="Clock" size={20} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-sm sm:text-base text-muted-foreground">
                      Сроки поставки зависят от места назначения и выбора перевозчика.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="CreditCard" size={20} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-sm sm:text-base text-muted-foreground">
                      Оплата доставки осуществляется заказчиком при получении по тарифам перевозчика.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="service"
        ref={serviceAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24"
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
        ref={aboutAnim.ref as React.RefObject<HTMLElement>}
        className="py-16 md:py-24 bg-muted/30"
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
                        <p className="font-semibold">Индивидуальный подход</p>
                        <p className="text-sm text-muted-foreground">Подбор решений под задачи и бюджет клиента</p>
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
        id="contact"
        ref={contactAnim.ref as React.RefObject<HTMLElement>}
        className="py-12 sm:py-16 bg-gradient-to-br from-secondary to-primary text-white"
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4">Получить коммерческое предложение</h2>
          <p className="text-center mb-6 sm:mb-8 text-white/80 text-sm sm:text-base">Заполните форму — менеджер свяжется в течение 15 минут</p>
          <form onSubmit={handleFormSubmit} className="bg-white rounded-lg p-4 sm:p-8 text-foreground">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="name">Имя *</Label>
                <Input id="name" required className="mt-1" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Телефон *</Label>
                <Input id="phone" type="tel" required className="mt-1" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })} placeholder="+7 (999) 999-99-99" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required className="mt-1" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="company">Компания</Label>
                <Input id="company" className="mt-1" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="producttype">Тип продукта</Label>
                <Select value={formData.productType} onValueChange={(value) => setFormData({ ...formData, productType: value })}>
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
                <Label htmlFor="modeltype">Тип запайщика</Label>
                <Select value={formData.modeltype} onValueChange={(value) => setFormData({ ...formData, modeltype: value })}>
                  <SelectTrigger id="modeltype" className="mt-1">
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Автоматический</SelectItem>
                    <SelectItem value="semiauto">Полуавтоматический</SelectItem>
                    <SelectItem value="manual">Ручной</SelectItem>
                    <SelectItem value="map">С газонаполнением (MAP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="comment">Комментарий</Label>
              <Textarea id="comment" rows={3} className="mt-1" value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} />
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
                Промышленное упаковочное оборудование от проверенных производителей
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Меню</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-white/70 hover:text-white transition-colors">Вакуумное оборудование</a></li>
                <li><a href="/termousadka" className="text-white/70 hover:text-white transition-colors">Термоусадка</a></li>
                <li><a href="/traysealers" className="text-white/70 hover:text-white transition-colors">Запайщики лотков</a></li>
                <li><a href="#advantages" className="text-white/70 hover:text-white transition-colors">Преимущества</a></li>
                <li><a href="#service" className="text-white/70 hover:text-white transition-colors">Сервис</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Каталог</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="text-white/70 hover:text-white transition-colors text-left"
                  >
                    Подобрать оборудование
                  </button>
                </li>
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
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <a
                    href="mailto:vacuum@t-sib.ru"
                    className="text-white/70 hover:text-white transition-colors"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).ym) {
                        (window as any).ym(105605669, 'reachGoal', 'click_email');
                      }
                    }}
                  >
                    vacuum@t-sib.ru
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
          <div className="border-t border-white/20 pt-6 text-center text-sm text-white/60">
            <p>© 2026 Техносиб. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <ContactModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Traysealers;