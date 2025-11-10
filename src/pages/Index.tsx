import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { ContactModal } from '@/components/ContactModal';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Index = () => {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const advantagesAnim = useScrollAnimation();
  const equipmentAnim = useScrollAnimation();
  const applicationAnim = useScrollAnimation();
  const serviceAnim = useScrollAnimation();
  const testimonialsAnim = useScrollAnimation();
  const faqAnim = useScrollAnimation();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Заявка отправлена!",
      description: "Коммерческое предложение придёт на email, менеджер свяжется в течение 15 минут",
    });
  };

  const advantages = [
    { image: 'https://cdn.poehali.dev/projects/e84451af-a3eb-4cf9-b3aa-82334790c296/files/0b71ec3e-a2c5-4e00-aceb-184876407d3b.jpg', title: 'В наличии', desc: 'Для мяса, рыбы, сыра, медицинских, косметических и прочих товаров' },
    { image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/ba2baa2b-ce3a-46f7-9e81-c3dd83001319.jpg', title: 'Экономия до 40%', desc: 'Снижение потерь продукции и увеличение срока хранения' },
    { image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/7da72073-647e-44d6-9300-d5a692be8ce0.jpg', title: 'Сервис 24/7', desc: 'Техническая поддержка и быстрая доставка запчастей' },
    { image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/6f8771c8-fe08-4846-9664-cbeb91028986.jpg', title: 'Гарантия качества', desc: 'Официальная гарантия на все оборудование от производителя' },
  ];

  const equipment = [
    {
      category: 'industrial',
      image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/7da72073-647e-44d6-9300-d5a692be8ce0.jpg',
      name: 'Напольная двухкамерная вакуумная упаковочная машина DZ-600/2SB',
      price: 'от 320 000 ₽',
      features: ['Производительность до 500 циклов/час', 'Длина сварного шва 600 мм', 'Автоматический режим работы'],
      badge: 'Хит продаж'
    },
    {
      category: 'industrial',
      image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/6f8771c8-fe08-4846-9664-cbeb91028986.jpg',
      name: 'Вакуумная камера DZ-400/2SD с опцией газонаполнения',
      price: 'от 280 000 ₽',
      features: ['Камера из нержавеющей стали', 'Система газонаполнения', 'Цифровое управление'],
      badge: null
    },
    {
      category: 'professional',
      image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/ba2baa2b-ce3a-46f7-9e81-c3dd83001319.jpg',
      name: 'Настольная вакуумная упаковочная машина DZ-260/PD',
      price: 'от 85 000 ₽',
      features: ['Компактный размер', 'Подходит для малого бизнеса', 'Простота эксплуатации'],
      badge: 'Новинка'
    },
    {
      category: 'professional',
      image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/7da72073-647e-44d6-9300-d5a692be8ce0.jpg',
      name: 'Вакууматор однокамерный DZ-300/T',
      price: 'от 95 000 ₽',
      features: ['Механическая крышка', 'Регулировка вакуума', 'Надежная конструкция'],
      badge: null
    },
    {
      category: 'consumer',
      image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/6f8771c8-fe08-4846-9664-cbeb91028986.jpg',
      name: 'Бытовой вакуумный упаковщик VacSy VS-100',
      price: 'от 8 500 ₽',
      features: ['Для домашнего использования', 'Компактное хранение', 'Работа от сети'],
      badge: 'Популярное'
    },
    {
      category: 'consumer',
      image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/ba2baa2b-ce3a-46f7-9e81-c3dd83001319.jpg',
      name: 'Вакуумный упаковщик для дома HomeSeal HS-200',
      price: 'от 12 900 ₽',
      features: ['Автоматическое определение пакета', 'Функция мариновки', 'Низкий уровень шума'],
      badge: null
    },
  ];

  const applications = [
    {
      icon: 'Beef',
      title: 'Мясо и птица',
      desc: 'Увеличение срока хранения свежего мяса до 21 дня при температуре +2°C',
      benefits: ['Сохранение свежести', 'Предотвращение окисления', 'Защита от бактерий']
    },
    {
      icon: 'Fish',
      title: 'Рыба и морепродукты',
      desc: 'Продление срока годности рыбы до 14 дней без заморозки',
      benefits: ['Сохранение аромата', 'Предотвращение высыхания', 'Защита от запахов']
    },
    {
      icon: 'Cookie',
      title: 'Сыр и молочные продукты',
      desc: 'Поддержание вкусовых качеств сыра на протяжении всего срока хранения',
      benefits: ['Предотвращение плесени', 'Сохранение текстуры', 'Защита от пересыхания']
    },
    {
      icon: 'Salad',
      title: 'Готовые блюда',
      desc: 'Сохранение свежести готовых блюд до 5-7 дней',
      benefits: ['Удобство порционирования', 'Сохранение витаминов', 'Готовность к подаче']
    },
    {
      icon: 'Package',
      title: 'Медицинские изделия',
      desc: 'Стерильная упаковка медицинских инструментов и расходных материалов',
      benefits: ['Стерильность', 'Защита от влаги', 'Длительное хранение']
    },
    {
      icon: 'Sparkles',
      title: 'Косметика и парфюмерия',
      desc: 'Защита от окисления и сохранение свойств косметических средств',
      benefits: ['Сохранение аромата', 'Защита от УФ', 'Презентабельный вид']
    },
  ];

  const services = [
    {
      icon: 'Truck',
      title: 'Доставка и установка',
      desc: 'Бесплатная доставка по России, профессиональный монтаж',
      details: ['Доставка в любой регион', 'Помощь в разгрузке', 'Установка на месте', 'Первый пуск'],
      price: 'Бесплатно при заказе от 100 000 ₽'
    },
    {
      icon: 'GraduationCap',
      title: 'Обучение персонала',
      desc: 'Комплексное обучение работе с оборудованием',
      details: ['Теоретическая часть', 'Практические занятия', 'Методические материалы', 'Сертификат'],
      price: 'от 15 000 ₽'
    },
    {
      icon: 'Wrench',
      title: 'Гарантийное обслуживание',
      desc: 'Бесплатное обслуживание в течение гарантийного срока',
      details: ['Гарантия 12-24 месяца', 'Бесплатный ремонт', 'Замена комплектующих', 'Выездной сервис'],
      price: 'Включено в стоимость'
    },
    {
      icon: 'Settings',
      title: 'Постгарантийное обслуживание',
      desc: 'Сервисная поддержка после окончания гарантии',
      details: ['Диагностика', 'Ремонт', 'Запчасти', 'Модернизация'],
      price: 'от 5 000 ₽/выезд'
    },
    {
      icon: 'Package2',
      title: 'Расходные материалы',
      desc: 'Поставка пакетов, пленки и комплектующих',
      details: ['Вакуумные пакеты', 'Рулонная пленка', 'Масло для насоса', 'Нагревательные элементы'],
      price: 'от 500 ₽'
    },
    {
      icon: 'Headphones',
      title: 'Консультационная поддержка',
      desc: 'Помощь в выборе оборудования и решении технических вопросов',
      details: ['Подбор оборудования', 'Расчет эффективности', 'Технические консультации', 'Удаленная поддержка'],
      price: 'Бесплатно'
    },
  ];

  const testimonials = [
    {
      company: 'ООО "Мясная лавка"',
      person: 'Михаил Петров, директор',
      text: 'Приобрели промышленную вакуумную машину DZ-600. Очень довольны качеством упаковки и надежностью оборудования. Окупилось за 8 месяцев за счет снижения потерь продукции.',
      rating: 5,
      image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/6f8771c8-fe08-4846-9664-cbeb91028986.jpg'
    },
    {
      company: 'Ресторан "Гурман"',
      person: 'Елена Сидорова, шеф-повар',
      text: 'Отличное решение для ресторана! Используем для су-вид и хранения заготовок. Продукты остаются свежими намного дольше. Менеджеры помогли с выбором и провели обучение.',
      rating: 5,
      image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/7da72073-647e-44d6-9300-d5a692be8ce0.jpg'
    },
    {
      company: 'ИП Соколов',
      person: 'Андрей Соколов, предприниматель',
      text: 'Купил настольную модель для небольшого цеха. Компактная, производительная, проста в использовании. Цена полностью оправдана качеством. Рекомендую!',
      rating: 5,
      image: 'https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/ba2baa2b-ce3a-46f7-9e81-c3dd83001319.jpg'
    },
  ];

  const technicalSpecs = [
    { model: 'DZ-600/2SB', type: 'Промышленная', power: '2.2 кВт', chamber: '600×520×180 мм', pump: '100 м³/ч', weight: '250 кг' },
    { model: 'DZ-400/2SD', type: 'Промышленная', power: '1.5 кВт', chamber: '400×420×150 мм', pump: '63 м³/ч', weight: '180 кг' },
    { model: 'DZ-260/PD', type: 'Настольная', power: '0.55 кВт', chamber: '260×310×120 мм', pump: '20 м³/ч', weight: '45 кг' },
    { model: 'DZ-300/T', type: 'Настольная', power: '0.75 кВт', chamber: '300×320×125 мм', pump: '25 м³/ч', weight: '52 кг' },
    { model: 'VS-100', type: 'Бытовая', power: '0.12 кВт', chamber: '300×50 мм', pump: '10 л/мин', weight: '1.2 кг' },
    { model: 'HS-200', type: 'Бытовая', power: '0.15 кВт', chamber: '320×50 мм', pump: '12 л/мин', weight: '1.5 кг' },
  ];

  const filteredEquipment = activeFilter === 'all' 
    ? equipment 
    : equipment.filter(item => item.category === activeFilter);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Package" className="text-blue-600" size={32} />
              <span className="text-2xl font-bold text-gray-900">VacuumPack</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#advantages" className="text-gray-700 hover:text-blue-600 transition-colors">Преимущества</a>
              <a href="#equipment" className="text-gray-700 hover:text-blue-600 transition-colors">Оборудование</a>
              <a href="#applications" className="text-gray-700 hover:text-blue-600 transition-colors">Применение</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">Услуги</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">Отзывы</a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</a>
            </nav>

            <div className="flex items-center gap-4">
              <Button onClick={() => setModalOpen(true)} className="hidden md:flex bg-blue-600 hover:bg-blue-700">
                <Icon name="Phone" size={18} className="mr-2" />
                Заказать звонок
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
              <a href="#advantages" className="text-gray-700" onClick={() => setMobileMenuOpen(false)}>Преимущества</a>
              <a href="#equipment" className="text-gray-700" onClick={() => setMobileMenuOpen(false)}>Оборудование</a>
              <a href="#applications" className="text-gray-700" onClick={() => setMobileMenuOpen(false)}>Применение</a>
              <a href="#services" className="text-gray-700" onClick={() => setMobileMenuOpen(false)}>Услуги</a>
              <a href="#testimonials" className="text-gray-700" onClick={() => setMobileMenuOpen(false)}>Отзывы</a>
              <a href="#faq" className="text-gray-700" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <Button onClick={() => { setModalOpen(true); setMobileMenuOpen(false); }} className="bg-blue-600 w-full">
                Заказать звонок
              </Button>
            </nav>
          )}
        </div>
      </header>

      <section className="py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-600">Оборудование в наличии</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Вакуумная упаковка для вашего бизнеса
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Сохраните свежесть продуктов в 5 раз дольше. Профессиональное оборудование для ресторанов, магазинов и производств.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                  Получить консультацию
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => document.getElementById('equipment')?.scrollIntoView({ behavior: 'smooth' })}>
                  Смотреть каталог
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle2" className="text-green-600" size={20} />
                  <span>Гарантия 12-24 мес</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle2" className="text-green-600" size={20} />
                  <span>Доставка по РФ</span>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://cdn.poehali.dev/projects/7f0941a7-b646-4462-83cf-d72a4486c6fc/files/6f8771c8-fe08-4846-9664-cbeb91028986.jpg"
                alt="Вакуумная упаковка продуктов"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="advantages" ref={advantagesAnim.ref as React.RefObject<HTMLElement>} className={`py-20 bg-white transition-all duration-1000 ${advantagesAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Почему выбирают вакуумную упаковку?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Проверенные преимущества для вашего бизнеса
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((adv, idx) => (
              <Card key={idx} className="overflow-hidden hover:shadow-xl transition-shadow">
                <img src={adv.image} alt={adv.title} className="w-full h-48 object-cover" />
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{adv.title}</h3>
                  <p className="text-gray-600">{adv.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="equipment" ref={equipmentAnim.ref as React.RefObject<HTMLElement>} className={`py-20 bg-gray-50 transition-all duration-1000 ${equipmentAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Наше оборудование
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Широкий выбор вакуумных упаковщиков для любых задач
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('all')}
                className={activeFilter === 'all' ? 'bg-blue-600' : ''}
              >
                Все
              </Button>
              <Button 
                variant={activeFilter === 'industrial' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('industrial')}
                className={activeFilter === 'industrial' ? 'bg-blue-600' : ''}
              >
                Промышленные
              </Button>
              <Button 
                variant={activeFilter === 'professional' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('professional')}
                className={activeFilter === 'professional' ? 'bg-blue-600' : ''}
              >
                Профессиональные
              </Button>
              <Button 
                variant={activeFilter === 'consumer' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('consumer')}
                className={activeFilter === 'consumer' ? 'bg-blue-600' : ''}
              >
                Бытовые
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEquipment.map((item, idx) => (
              <Card key={idx} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
                  {item.badge && (
                    <Badge className="absolute top-4 right-4 bg-blue-600">{item.badge}</Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-blue-600">{item.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <Icon name="Check" className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => setModalOpen(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                    Запросить КП
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="applications" ref={applicationAnim.ref as React.RefObject<HTMLElement>} className={`py-20 bg-white transition-all duration-1000 ${applicationAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Области применения
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Для каких продуктов подходит вакуумная упаковка
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Icon name={app.icon as any} className="text-blue-600" size={32} />
                  </div>
                  <CardTitle>{app.title}</CardTitle>
                  <CardDescription>{app.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {app.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <Icon name="CheckCircle2" className="text-green-600" size={16} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="services" ref={serviceAnim.ref as React.RefObject<HTMLElement>} className={`py-20 bg-gray-50 transition-all duration-1000 ${serviceAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Дополнительные услуги
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Полный комплекс сервисного обслуживания
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Icon name={service.icon as any} className="text-blue-600" size={28} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <Icon name="Dot" className="text-blue-600 flex-shrink-0" size={20} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">Стоимость:</p>
                    <p className="text-lg font-bold text-blue-600">{service.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" ref={testimonialsAnim.ref as React.RefObject<HTMLElement>} className={`py-20 bg-white transition-all duration-1000 ${testimonialsAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Отзывы наших клиентов
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Более 500 довольных клиентов по всей России
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={testimonial.image} alt={testimonial.company} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <CardTitle className="text-lg">{testimonial.company}</CardTitle>
                      <CardDescription>{testimonial.person}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Icon key={i} name="Star" className="text-yellow-400 fill-yellow-400" size={16} />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Технические характеристики
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Подробные спецификации нашего оборудования
            </p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Модель</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Мощность</TableHead>
                  <TableHead>Размер камеры</TableHead>
                  <TableHead>Производ. насоса</TableHead>
                  <TableHead>Вес</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {technicalSpecs.map((spec, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{spec.model}</TableCell>
                    <TableCell>{spec.type}</TableCell>
                    <TableCell>{spec.power}</TableCell>
                    <TableCell>{spec.chamber}</TableCell>
                    <TableCell>{spec.pump}</TableCell>
                    <TableCell>{spec.weight}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <section id="faq" ref={faqAnim.ref as React.RefObject<HTMLElement>} className={`py-20 bg-white transition-all duration-1000 ${faqAnim.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Часто задаваемые вопросы
            </h2>
            <p className="text-xl text-gray-600">
              Ответы на популярные вопросы о вакуумной упаковке
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Какой упаковщик выбрать для ресторана?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Для ресторана рекомендуем настольные профессиональные модели DZ-260/PD или DZ-300/T. Они компактны, имеют достаточную производительность для заведения средних размеров и подходят для технологии су-вид.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Какие пакеты нужны для вакуумной упаковки?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Используются специальные гофрированные пакеты из многослойной пленки (PA/PE). Мы поставляем пакеты разных размеров и рулонную пленку для изготовления пакетов нужного размера.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Сколько служит вакуумный упаковщик?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                При правильной эксплуатации и регулярном обслуживании оборудование служит 7-10 лет. Гарантийный срок составляет 12-24 месяца в зависимости от модели.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Нужно ли специальное обучение для работы?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Оборудование простое в эксплуатации. Мы предоставляем бесплатное базовое обучение при установке. Для более глубокого изучения возможностей предлагаем расширенный курс.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Какое техническое обслуживание требуется?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Регулярное ТО включает замену масла в вакуумном насосе (раз в 6-12 месяцев), очистку камеры, проверку уплотнителей. Мы предлагаем сервисные контракты с выездным обслуживанием.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6">
              <AccordionTrigger className="text-left">
                Возможна ли рассрочка или лизинг?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Да, мы работаем с лизинговыми компаниями и можем предложить рассрочку на выгодных условиях. Также доступна аренда оборудования для временных проектов.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Получите консультацию специалиста
              </h2>
              <p className="text-xl text-blue-100">
                Оставьте заявку, и мы подберем оптимальное решение для вашего бизнеса
              </p>
            </div>
            
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Форма обратной связи</CardTitle>
                <CardDescription>Заполните форму, и менеджер свяжется с вами в течение 15 минут</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name">Имя *</Label>
                      <Input id="contact-name" placeholder="Ваше имя" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-phone">Телефон *</Label>
                      <Input id="contact-phone" type="tel" placeholder="+7 (___) ___-__-__" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input id="contact-email" type="email" placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-company">Компания</Label>
                    <Input id="contact-company" placeholder="Название компании" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Комментарий</Label>
                    <Textarea id="contact-message" placeholder="Расскажите о ваших потребностях..." rows={4} />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить заявку
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Package" className="text-blue-400" size={28} />
                <span className="text-xl font-bold">VacuumPack</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Профессиональное оборудование для вакуумной упаковки
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  <span>+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>info@vacuumpack.ru</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Продукция</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#equipment" className="hover:text-white transition-colors">Промышленные</a></li>
                <li><a href="#equipment" className="hover:text-white transition-colors">Профессиональные</a></li>
                <li><a href="#equipment" className="hover:text-white transition-colors">Бытовые</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Расходные материалы</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Отзывы</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Услуги</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Доставка</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Гарантия</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Сервис</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 VacuumPack. Все права защищены.</p>
          </div>
        </div>
      </footer>

      <ContactModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};

export default Index;
