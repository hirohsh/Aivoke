import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/constants';
import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

// 利用可能な言語とデフォルト言語を設定
export const routing = defineRouting({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

// ナビゲーション用のユーティリティを作成
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
