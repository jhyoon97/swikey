export const LOCALES = ['ko', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ko';
export const COOKIE_NAME = 'NEXT_LOCALE';

export const getLocaleFromCookie = (
  cookieValue: string | undefined,
): Locale => {
  if (cookieValue && LOCALES.includes(cookieValue as Locale)) {
    return cookieValue as Locale;
  }
  return DEFAULT_LOCALE;
};
