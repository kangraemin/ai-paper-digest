import type { Lang } from './types';

export function getLocalizedField(ko: string | null, en: string | null, lang: Lang): string | null {
  if (lang === 'en') return en || ko;
  return ko;
}
