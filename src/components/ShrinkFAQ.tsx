import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqCategory {
  title: string;
  icon: string;
  items: FaqItem[];
}

const faqData: FaqCategory[] = [
  {
    title: 'Общие вопросы о термоусадке',
    icon: 'Package',
    items: [
      {
        question: 'Что такое термоусадочное оборудование и как оно работает?',
        answer: (
          <div className="space-y-3">
            <p>Термоусадочное оборудование — это упаковочные машины, которые оборачивают продукт в специальную термоусадочную плёнку и пропускают через термотоннель. Под воздействием горячего воздуха (150–250°C) плёнка равномерно сжимается и плотно облегает продукт, повторяя его форму.</p>
            <p className="font-medium">Процесс состоит из 3 этапов:</p>
            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li>Продукт помещается в рукав или полурукав плёнки</li>
              <li>Плёнка обрезается и сваривается</li>
              <li>Продукт проходит через термотоннель, где плёнка усаживается</li>
            </ol>
            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg mt-3">
              <p className="text-sm">Весь цикл занимает от 3 до 15 секунд в зависимости от модели аппарата.</p>
            </div>
          </div>
        ),
      },
      {
        question: 'Чем термоусадка отличается от вакуумной упаковки?',
        answer: (
          <div className="space-y-3">
            <p>Это принципиально разные технологии с разными задачами:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 border-b border-border">Параметр</th>
                    <th className="text-left p-2 border-b border-border">Термоусадка</th>
                    <th className="text-left p-2 border-b border-border">Вакуум</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border-b border-border">Воздух внутри</td><td className="p-2 border-b border-border">Остаётся</td><td className="p-2 border-b border-border">Полностью удаляется</td></tr>
                  <tr><td className="p-2 border-b border-border">Главная задача</td><td className="p-2 border-b border-border">Презентация, защита, групповая упаковка</td><td className="p-2 border-b border-border">Продление срока годности</td></tr>
                  <tr><td className="p-2 border-b border-border">Срок хранения</td><td className="p-2 border-b border-border">Практически не увеличивает</td><td className="p-2 border-b border-border">Увеличивает в 3–10 раз</td></tr>
                  <tr><td className="p-2">Внешний вид</td><td className="p-2">Глянцевый, прозрачный</td><td className="p-2">Плёнка плотно прижата к продукту</td></tr>
                </tbody>
              </table>
            </div>
            <p className="font-medium mt-2">Простое правило:</p>
            <ul className="space-y-1 pl-2">
              <li>Нужно <strong>красиво упаковать и защитить</strong> → термоусадка</li>
              <li>Нужно <strong>сохранить свежим надолго</strong> → вакуум</li>
            </ul>
          </div>
        ),
      },
      {
        question: 'Что можно упаковывать термоусадочным оборудованием?',
        answer: (
          <div className="space-y-2">
            <p>Практически всё, что помещается в камеру аппарата:</p>
            <ul className="space-y-1.5 pl-2">
              <li><strong>Напитки</strong> — мультипаки бутылок (ПЭТ, стекло), банок</li>
              <li><strong>Коробки</strong> — кондитерские изделия, парфюмерия, подарочные наборы</li>
              <li><strong>Полиграфия</strong> — книги, журналы, каталоги, тетради</li>
              <li><strong>Бытовая химия</strong> — групповая упаковка моющих средств</li>
              <li><strong>Фармацевтика</strong> — обтяжка коробок с лекарствами (тамперинг)</li>
              <li><strong>Продукты на лотках</strong> — обтяжка подложек с мясом, овощами, полуфабрикатами</li>
              <li><strong>Запчасти</strong> — подшипники, фильтры, комплектующие</li>
              <li><strong>Строительные материалы</strong> — плитка, панели, профили</li>
            </ul>
          </div>
        ),
      },
      {
        question: 'Термоусадка продлевает срок годности продуктов?',
        answer: (
          <div className="space-y-3">
            <p><strong>Нет.</strong> Это распространённое заблуждение. Термоусадочная плёнка:</p>
            <ul className="space-y-1 pl-2">
              <li className="flex items-start gap-2"><Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" /> Защищает от пыли, влаги и механических повреждений</li>
              <li className="flex items-start gap-2"><Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" /> Фиксирует продукт на лотке/подложке</li>
              <li className="flex items-start gap-2"><Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" /> Придаёт товарный вид</li>
              <li className="flex items-start gap-2"><Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" /> Обеспечивает контроль вскрытия (тамперинг)</li>
            </ul>
            <p>Но <strong>не удаляет воздух</strong> из упаковки и <strong>не создаёт барьерную среду</strong>.</p>
            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
              <p className="text-sm">Если ваша задача — продлить срок годности, рекомендуем рассмотреть <strong>вакуумное оборудование</strong> или <strong>упаковку в модифицированную газовую среду (MAP)</strong>.</p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    title: 'Вопросы о плёнке',
    icon: 'Film',
    items: [
      {
        question: 'Какую плёнку использовать — ПОФ или ПВХ?',
        answer: (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 border-b border-border">Параметр</th>
                    <th className="text-left p-2 border-b border-border">ПОФ (POF)</th>
                    <th className="text-left p-2 border-b border-border">ПВХ (PVC)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border-b border-border">Прозрачность</td><td className="p-2 border-b border-border">Высокая, глянцевая</td><td className="p-2 border-b border-border">Хорошая, но чуть мутнее</td></tr>
                  <tr><td className="p-2 border-b border-border">Прочность</td><td className="p-2 border-b border-border">Высокая (устойчива к проколам)</td><td className="p-2 border-b border-border">Средняя</td></tr>
                  <tr><td className="p-2 border-b border-border">Запах при нагреве</td><td className="p-2 border-b border-border">Без запаха</td><td className="p-2 border-b border-border">Лёгкий специфический запах</td></tr>
                  <tr><td className="p-2 border-b border-border">Контакт с пищей</td><td className="p-2 border-b border-border">Безопасна (пищевой допуск)</td><td className="p-2 border-b border-border">Ограниченно (зависит от марки)</td></tr>
                  <tr><td className="p-2 border-b border-border">Экологичность</td><td className="p-2 border-b border-border">Более экологична, перерабатывается</td><td className="p-2 border-b border-border">Менее экологична</td></tr>
                  <tr><td className="p-2">Усадка</td><td className="p-2">Равномерная, до 75%</td><td className="p-2">Хорошая, до 50%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="font-medium">Рекомендации:</p>
            <ul className="space-y-1 pl-2">
              <li><strong>ПОФ</strong> — для пищевых продуктов, презентабельной упаковки, товаров для торговых сетей</li>
              <li><strong>ПВХ</strong> — для непищевых товаров, канцелярии, коробок, где важна экономия</li>
            </ul>
          </div>
        ),
      },
      {
        question: 'Какой толщины плёнку выбрать?',
        answer: (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 border-b border-border">Толщина</th>
                    <th className="text-left p-2 border-b border-border">Применение</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border-b border-border font-medium">12–15 мкм</td><td className="p-2 border-b border-border">Лёгкие предметы: канцелярия, DVD-диски, мелкая продукция</td></tr>
                  <tr><td className="p-2 border-b border-border font-medium">15–19 мкм</td><td className="p-2 border-b border-border">Самый популярный диапазон: коробки, лотки с продуктами, наборы</td></tr>
                  <tr><td className="p-2 border-b border-border font-medium">19–25 мкм</td><td className="p-2 border-b border-border">Тяжёлые и крупные предметы: бутылки, банки, групповая упаковка</td></tr>
                  <tr><td className="p-2 font-medium">25–30 мкм</td><td className="p-2">Мультипаки тяжёлых бутылок, строительные материалы</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
              <p className="text-sm">Чем тяжелее и больше продукт — тем толще плёнка. Если не уверены — пришлите нам образец продукта, подберём оптимальную толщину.</p>
            </div>
          </div>
        ),
      },
      {
        question: 'Сколько плёнки расходуется на одну упаковку?',
        answer: (
          <p>Зависит от размера продукта и типа подачи плёнки. Точный расчёт можем сделать <strong>бесплатно</strong> под ваш конкретный продукт — оставьте заявку, и менеджер подготовит расчёт.</p>
        ),
      },
    ],
  },
  {
    title: 'Выбор оборудования',
    icon: 'Settings',
    items: [
      {
        question: 'Какие виды термоусадочных аппаратов бывают?',
        answer: (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-2 border-b border-border">Тип</th>
                  <th className="text-left p-2 border-b border-border">Производительность</th>
                  <th className="text-left p-2 border-b border-border">Для кого</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2 border-b border-border font-medium">Ручной (термофен)</td><td className="p-2 border-b border-border">50–100 уп/ч</td><td className="p-2 border-b border-border">Микробизнес, разовые задачи</td></tr>
                <tr><td className="p-2 border-b border-border font-medium">Полуавтомат настольный</td><td className="p-2 border-b border-border">100–400 уп/ч</td><td className="p-2 border-b border-border">Малый бизнес, небольшие партии</td></tr>
                <tr><td className="p-2 border-b border-border font-medium">Полуавтомат напольный</td><td className="p-2 border-b border-border">300–800 уп/ч</td><td className="p-2 border-b border-border">Средний бизнес, стабильные объёмы</td></tr>
                <tr><td className="p-2 border-b border-border font-medium">Автомат</td><td className="p-2 border-b border-border">600–1 500 уп/ч</td><td className="p-2 border-b border-border">Средние и крупные производства</td></tr>
                <tr><td className="p-2 font-medium">Автоматическая линия</td><td className="p-2">1 500–3 000+ уп/ч</td><td className="p-2">Крупные предприятия, конвейерное производство</td></tr>
              </tbody>
            </table>
          </div>
        ),
      },
      {
        question: 'Как выбрать аппарат под мой продукт?',
        answer: (
          <div className="space-y-3">
            <p className="font-medium">Нужно определить 5 ключевых параметров:</p>
            <ol className="list-decimal list-inside space-y-1.5 pl-2">
              <li><strong>Что упаковываете?</strong> — размеры продукта (длина × ширина × высота)</li>
              <li><strong>Какой объём?</strong> — сколько упаковок в час/смену нужно</li>
              <li><strong>Какая плёнка?</strong> — ПОФ, ПВХ или полиэтилен</li>
              <li><strong>Ручная или автоматическая подача?</strong> — есть ли оператор</li>
              <li><strong>Интеграция в линию?</strong> — нужно ли встроить в существующий конвейер</li>
            </ol>
            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
              <p className="text-sm">Не хотите разбираться самостоятельно? <strong>Пришлите фото продукта и укажите объём</strong> — мы подберём оптимальный аппарат за 1 рабочий день.</p>
            </div>
          </div>
        ),
      },
      {
        question: 'Нужен ли термотоннель или можно без него?',
        answer: (
          <div className="space-y-3">
            <p><strong>Термотоннель — это обязательная часть</strong> термоусадочного процесса. Именно в нём происходит усадка плёнки.</p>
            <p className="font-medium">Варианты:</p>
            <ul className="space-y-1.5 pl-2">
              <li><strong>Встроенный тоннель</strong> — в составе автоматических аппаратов (всё в одном корпусе)</li>
              <li><strong>Отдельный тоннель</strong> — покупается дополнительно к сварочному аппарату</li>
              <li><strong>Термофен</strong> — заменяет тоннель при ручной упаковке малых партий (но качество и скорость значительно ниже)</li>
            </ul>
            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
              <p className="text-sm">Мы продаём тоннели <strong>как в комплекте с аппаратом, так и отдельно</strong> — если нужно доукомплектовать существующую линию.</p>
            </div>
          </div>
        ),
      },
      {
        question: 'Какой аппарат подойдёт для упаковки бутылок в мультипаки?',
        answer: (
          <div className="space-y-3">
            <p>Для групповой упаковки бутылок (вода, пиво, соки, масло) рекомендуем:</p>
            <ul className="space-y-1.5 pl-2">
              <li><strong>Полуавтомат</strong> — если до 500 мультипаков/ч, оператор формирует группу вручную</li>
              <li><strong>Автомат с группирователем</strong> — если свыше 500 мультипаков/ч, автоматическая подача и формирование</li>
            </ul>
            <p className="font-medium">Важные параметры:</p>
            <ul className="space-y-1 pl-2">
              <li>Ширина рабочей зоны — должна вмещать группу бутылок</li>
              <li>Мощность тоннеля — для толстой плёнки (19–30 мкм) нужен мощный тоннель</li>
              <li>Тип плёнки — для бутылок обычно ПЭ или толстая ПОФ</li>
            </ul>
          </div>
        ),
      },
    ],
  },
  {
    title: 'Покупка и доставка',
    icon: 'ShoppingCart',
    items: [
      {
        question: 'Есть ли рассрочка или лизинг?',
        answer: (
          <div className="space-y-2">
            <ul className="space-y-1.5 pl-2">
              <li className="flex items-start gap-2"><Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" /><span><strong>Рассрочка</strong> предоставляется на индивидуальных условиях. Оставьте заявку — менеджер даст детальную информацию.</span></li>
              <li className="flex items-start gap-2"><Icon name="Check" size={16} className="text-green-600 mt-0.5 shrink-0" /><span><strong>Лизинг</strong> предоставляется через партнёрские лизинговые компании.</span></li>
            </ul>
          </div>
        ),
      },
      {
        question: 'Доставляете ли в регионы?',
        answer: (
          <div className="space-y-3">
            <p>Да, доставляем по всей России и СНГ через транспортные компании (СДЭК, Деловые Линии, ПЭК и др.).</p>
            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
              <p className="text-sm font-medium">Доставка до терминала транспортной компании — бесплатно при заказе от 50 000 ₽.</p>
            </div>
          </div>
        ),
      },
      {
        question: 'Какая гарантия на оборудование?',
        answer: (
          <p>Гарантия на всё оборудование — <strong>12 месяцев</strong>. Гарантия распространяется на заводские дефекты и выход из строя узлов при нормальной эксплуатации.</p>
        ),
      },
      {
        question: 'Можно ли протестировать оборудование перед покупкой?',
        answer: (
          <div className="space-y-3">
            <p className="font-medium">Да, есть два варианта:</p>
            <ol className="list-decimal list-inside space-y-1.5 pl-2">
              <li><strong>Тестовая упаковка ваших образцов</strong> — пришлите нам образцы продукции, мы упакуем на нашем оборудовании и отправим результат (фото/видео + образцы)</li>
              <li><strong>Визит в шоу-рум</strong> — приезжайте и протестируйте оборудование лично</li>
            </ol>
            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
              <p className="text-sm">Оба варианта — <strong>бесплатно и без обязательств</strong>.</p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    title: 'Эксплуатация и обслуживание',
    icon: 'Wrench',
    items: [
      {
        question: 'Сложно ли обслуживать термоусадочный аппарат?',
        answer: (
          <div className="space-y-3">
            <p><strong>Нет.</strong> Термоусадочное оборудование — одно из самых простых в обслуживании:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-medium text-sm mb-1.5">Ежедневно:</p>
                <ul className="text-sm space-y-0.5 pl-2">
                  <li>Протирка рабочих поверхностей</li>
                  <li>Проверка натяжения плёнки</li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-medium text-sm mb-1.5">Еженедельно:</p>
                <ul className="text-sm space-y-0.5 pl-2">
                  <li>Очистка тефлоновых покрытий</li>
                  <li>Проверка режущего элемента</li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-medium text-sm mb-1.5">Ежемесячно:</p>
                <ul className="text-sm space-y-0.5 pl-2">
                  <li>Проверка нагревательных элементов</li>
                  <li>Смазка подвижных частей</li>
                </ul>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-medium text-sm mb-1.5">Раз в 6–12 месяцев:</p>
                <ul className="text-sm space-y-0.5 pl-2">
                  <li>Замена нихромовой проволоки</li>
                  <li>Замена тефлоновой ленты</li>
                  <li>Проверка электросоединений</li>
                </ul>
              </div>
            </div>
            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
              <p className="text-sm">Все расходники для обслуживания <strong>есть у нас в наличии</strong>.</p>
            </div>
          </div>
        ),
      },
      {
        question: 'Нужно ли специальное обучение для оператора?',
        answer: (
          <div className="space-y-2">
            <p className="font-medium">Обучение минимальное:</p>
            <ul className="space-y-1.5 pl-2">
              <li><strong>Полуавтомат</strong> — оператор осваивает работу за 15–30 минут</li>
              <li><strong>Автомат</strong> — обучение занимает 1–2 часа</li>
              <li><strong>Автоматическая линия</strong> — обучение 4–8 часов (проводит наш инженер при пуско-наладке)</li>
            </ul>
          </div>
        ),
      },
      {
        question: 'Какое электропитание требуется?',
        answer: (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 border-b border-border">Тип аппарата</th>
                    <th className="text-left p-2 border-b border-border">Напряжение</th>
                    <th className="text-left p-2 border-b border-border">Мощность</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border-b border-border">Полуавтомат настольный</td><td className="p-2 border-b border-border">220В, однофазное</td><td className="p-2 border-b border-border">1,5–3 кВт</td></tr>
                  <tr><td className="p-2 border-b border-border">Полуавтомат напольный</td><td className="p-2 border-b border-border">220В, однофазное</td><td className="p-2 border-b border-border">3–5 кВт</td></tr>
                  <tr><td className="p-2 border-b border-border">Автомат</td><td className="p-2 border-b border-border">380В, трёхфазное</td><td className="p-2 border-b border-border">5–12 кВт</td></tr>
                  <tr><td className="p-2">Автоматическая линия</td><td className="p-2">380В, трёхфазное</td><td className="p-2">10–25 кВт</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
              <p className="text-sm text-amber-900">Перед покупкой проверьте доступную мощность в вашем цеху.</p>
            </div>
          </div>
        ),
      },
      {
        question: 'Какая температура нужна для усадки?',
        answer: (
          <div className="space-y-3">
            <p>Зависит от типа плёнки:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 border-b border-border">Плёнка</th>
                    <th className="text-left p-2 border-b border-border">Температура усадки</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border-b border-border">ПОФ (POF)</td><td className="p-2 border-b border-border">150–180°C</td></tr>
                  <tr><td className="p-2 border-b border-border">ПВХ (PVC)</td><td className="p-2 border-b border-border">130–160°C</td></tr>
                  <tr><td className="p-2">Полиэтилен (ПЭ)</td><td className="p-2">160–200°C</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded-r-lg">
              <p className="text-sm">Все наши аппараты имеют <strong>плавную регулировку температуры</strong>, что позволяет точно настроить режим под конкретную плёнку и продукт.</p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    title: 'Быстрые ответы',
    icon: 'Zap',
    items: [
      {
        question: 'Работаете с юрлицами и ИП?',
        answer: (
          <p>Да, работаем с ООО, ИП и физлицами. Полный комплект документов (счёт, договор, УПД, счёт-фактура).</p>
        ),
      },
      {
        question: 'Можно ли купить только термотоннель?',
        answer: (
          <p>Да, продаём тоннели отдельно для доукомплектации существующих линий.</p>
        ),
      },
      {
        question: 'Поставляете ли плёнку на постоянной основе?',
        answer: (
          <p>Да, заключаем договоры на регулярную поставку плёнки. Для постоянных клиентов — специальные условия.</p>
        ),
      },
      {
        question: 'Есть ли скидки при покупке оборудования + плёнка?',
        answer: (
          <p>Скидки есть. Предоставляются на индивидуальных условиях. Подробная информация у менеджеров.</p>
        ),
      },
      {
        question: 'Изготавливаете ли оборудование на заказ?',
        answer: (
          <p>Да, можем изготовить или модифицировать аппарат под нестандартные размеры продукта. Срок — от 90 дней.</p>
        ),
      },
    ],
  },
];

const ShrinkFAQ = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 max-w-md mx-auto">
        {faqData.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(idx)}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
              activeCategory === idx
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
            }`}
          >
            <Icon name={cat.icon} size={16} />
            {cat.title}
          </button>
        ))}
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqData[activeCategory].items.map((item, idx) => (
            <AccordionItem key={`${activeCategory}-${idx}`} value={`item-${idx}`} className="border border-border rounded-lg mb-3 px-4 last:mb-0">
              <AccordionTrigger className="text-left text-base hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center pt-4">
        <Badge variant="outline" className="text-sm px-4 py-2">
          <Icon name="MessageCircle" size={14} className="mr-2" />
          Не нашли ответ? Свяжитесь с нами — ответим за 15 минут
        </Badge>
      </div>
    </div>
  );
};

export default ShrinkFAQ;