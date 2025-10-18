import { Locale, ParsedLocale } from '@/types/LocaleTypes';
import { cookies, headers } from 'next/headers';
import 'server-only';
import { DEFAULT_LOCALE } from '../constants';

export async function getCurrentLocale(): Promise<Locale> {
  const headersList = await headers();
  const locale = headersList.get('x-middleware-request-x-next-intl-locale') || DEFAULT_LOCALE;

  return locale as Locale;
}

export async function getCurrentLocaleFromCookie(): Promise<Locale> {
  const c = await cookies();
  const locale = c.get('NEXT_LOCALE')?.value || DEFAULT_LOCALE;
  return locale as Locale;
}

export function parseLocale(pathname: string): ParsedLocale {
  const m = pathname.match(/^\/(en|ja)(?=\/|$)/);
  const locale = (m?.[1] as Locale) ?? DEFAULT_LOCALE;
  const pathNoLocale = m ? pathname.replace(/^\/(en|ja)(?=\/|$)/, '') || '/' : pathname;
  return { locale, pathNoLocale };
}
