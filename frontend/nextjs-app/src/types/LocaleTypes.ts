import { SUPPORTED_LOCALES } from '@/lib/constants';

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export interface ParsedLocale {
  locale: Locale;
  pathNoLocale: string;
}

export interface LocaleItem {
  code: Locale;
  label: string;
}

export interface LocaleParam {
  locale: string;
}
