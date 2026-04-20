const BASE_URL = 'https://vacuum.t-sib.ru';

export interface SourcePageInfo {
  url: string;
  title: string;
  label: string;
}

export function getSourcePage(): SourcePageInfo {
  if (typeof window === 'undefined') {
    return {
      url: `${BASE_URL}/`,
      title: 'Вакуумное оборудование',
      label: 'Вакуумное оборудование',
    };
  }

  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path.startsWith('/traysealers')) {
    return {
      url: `${BASE_URL}/traysealers/`,
      title: 'Запайщики лотков (трейсилеры)',
      label: 'Запайщики лотков',
    };
  }

  if (path.startsWith('/termousadka')) {
    return {
      url: `${BASE_URL}/termousadka/`,
      title: 'Термоусадочное оборудование',
      label: 'Термоусадка',
    };
  }

  return {
    url: `${BASE_URL}/`,
    title: 'Вакуумное оборудование',
    label: 'Вакуумное оборудование',
  };
}

export function buildSourceLine(): string {
  const s = getSourcePage();
  return `[Источник: ${s.label} — ${s.url}]`;
}
