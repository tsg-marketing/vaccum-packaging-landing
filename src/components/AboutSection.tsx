import Icon from './ui/icon';

export default function AboutSection() {
  return (
    <section id="about" className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              О компании ТЕХНОСИБ
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 font-semibold">
              Ваш надежный партнер с 2001 года
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-accent">25</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">лет на рынке</h3>
              <p className="text-gray-600">Опыт и экспертиза в упаковочном оборудовании</p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" size={32} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2 города</h3>
              <p className="text-gray-600">Офисы в Москве и Новосибирске</p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Globe" size={32} className="text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Проверенные партнеры</h3>
              <p className="text-gray-600">Из Европы, России и Китая</p>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-white p-8 md:p-12 rounded-lg shadow-2xl">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Компания <span className="font-semibold text-gray-900">«Техно‑Сиб»</span> — надежный поставщик и партнер в сфере профессионального пищевого и фасовочно‑упаковочного оборудования. Мы работаем с 2001 года и уже 25 лет помогаем предприятиям эффективно оснащать производства и склады пищевым и упаковочным оборудованием, предоставляем сервисное обслуживание, а также реализуем упаковочные и расходные материалы.
              </p>
              
              <div className="border-l-4 border-accent pl-6 py-2 bg-accent/5">
                <p className="font-medium text-gray-900 text-lg">
                  Мы сотрудничаем с ведущими заводами‑производителями Европы, России и Китая, подбирая решения под задачи и бюджет клиента.
                </p>
              </div>

              <p className="text-lg">
                Собственные офисы продаж, склады, сервисная служба и отлаженная логистика в Москве и Новосибирске позволяют нам оперативно выполнять поставки и поддерживать оборудование на территории России и стран СНГ.
              </p>

              <p className="text-lg">
                Экспертиза наших специалистов помогает решать задачи любого уровня сложности — от подбора единичной позиции до комплексного оснащения. <span className="font-semibold text-gray-900">«Техно‑Сиб»</span> всегда предложит оптимальное решение для вашего бизнеса и обеспечит надежную поддержку на всех этапах работы.
              </p>
            </div>

            {/* Advantages Grid */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Комплексные решения</h4>
                    <p className="text-gray-600">От подбора оборудования до сервисного обслуживания</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Быстрая доставка</h4>
                    <p className="text-gray-600">Собственная логистика по всей России и СНГ</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Сервисная поддержка</h4>
                    <p className="text-gray-600">Гарантийное и постгарантийное обслуживание</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={24} className="text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Экспертная консультация</h4>
                    <p className="text-gray-600">Помощь в выборе оптимального решения</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
