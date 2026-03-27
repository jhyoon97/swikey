'use client';

import { useMemo } from 'react';

import { COOKIE_NAME, DEFAULT_LOCALE, getLocaleFromCookie } from './config';
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

const getClientLocale = (): Locale => {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`),
  );
  return getLocaleFromCookie(match?.[1]);
};

export const useTranslation = () => {
  const locale = getClientLocale();
  const t = useMemo(() => {
    const dict = messages[locale];
    return (key: string): string =>
      getNestedValue(dict as unknown as Record<string, unknown>, key);
  }, [locale]);

  return { t, locale };
};
