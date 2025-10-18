'use client';

import type { NavItem } from '@/components/layout/Header';
import { Header } from '@/components/layout/Header';
import { SUPPORTED_LOCALES } from '@/lib/constants';
import { usePathname } from 'next/navigation';

/**
 * HeaderWrapper コンポーネント
 * - usePathname フックを使用して、現在のパスに基づいてナビゲーション項目を動的に変更します。
 */
export function HeaderWrapper({ nonce }: { nonce?: string }) {
  const path = usePathname();

  // 基本ヘッダーアイテム一覧
  const defaultItems: NavItem[] = [
    { label: 'LocaleSelect', type: 'locale-select', align: 'right' },
    { label: 'ToggleTheme', type: 'theme-toggle', align: 'right' },
  ];

  // 基本ヘッダーアイテム一覧
  const homeItems: NavItem[] = [
    { label: 'Logo', type: 'logo', align: 'left' },
    ...defaultItems,
    { label: 'AuthToggleButton', type: 'auth-toggle-button', align: 'right' },
  ];

  // チャットページのヘッダーアイテム一覧
  const chatItems: NavItem[] = [
    { label: 'SidebarTrigger', type: 'sidebar-trigger', align: 'left', mobileOnly: true },
    { label: 'ModelSelect', type: 'model-select', align: 'left' },
    ...defaultItems,
    { label: 'AuthToggleButton', type: 'auth-toggle-button', align: 'right' },
  ];

  // ログインページヘッダーアイテム一覧
  const authPageItems: NavItem[] = [{ label: 'Home', type: 'link', align: 'left' }, ...defaultItems];

  const getHeaderItems = (pathValue: string): NavItem[] => {
    if (pathValue.startsWith('/chat')) return chatItems;
    if (pathValue.startsWith('/auth')) return authPageItems;
    if (pathValue === '/') return homeItems;

    return defaultItems;
  };

  const stripLocalePrefix = (path: string) => {
    for (const locale of SUPPORTED_LOCALES) {
      if (path.startsWith(`/${locale}/`)) return path.replace(`/${locale}`, '');
      if (path === `/${locale}`) return '/';
    }
    return path;
  };

  return <Header items={getHeaderItems(stripLocalePrefix(path))} nonce={nonce} />;
}
