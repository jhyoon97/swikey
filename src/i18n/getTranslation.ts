import { cookies } from 'next/headers';

import { COOKIE_NAME, getLocaleFromCookie } from './config';
import type { Locale } from './config';
import en from './en.json';
import ko from './ko.json';

const messages: Record<Locale, typeof ko> = { ko, en };

const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : path;
};

export const getTranslation = async () => {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookie(cookieStore.get(COOKIE_NAME)?.value);
  const dict = messages[locale];
  const t = (key: string): string =>
    getNestedValue(dict as unknown as Record<string, unknown>, key);

  return { t, locale };
};
