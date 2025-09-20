'use client';

import type { NavItem } from '@/components/layout/Header';
import { Header } from '@/components/layout/Header';
import { usePathname } from 'next/navigation';

/**
 * HeaderWrapper コンポーネント
 * - usePathname フックを使用して、現在のパスに基づいてナビゲーション項目を動的に変更します。
 */
export function HeaderWrapper({ nonce }: { nonce?: string }) {
  const path = usePathname();

  // 基本ヘッダーアイテム一覧
  const defaultItems: NavItem[] = [{ label: 'ToggleTheme', type: 'theme-toggle', align: 'right' }];

  // 基本ヘッダーアイテム一覧
  const homeItems: NavItem[] = [
    { label: 'Logo', type: 'logo', align: 'left' },
    { label: 'ToggleTheme', type: 'theme-toggle', align: 'right' },
    { label: 'AuthToggleButton', type: 'auth-toggle-button', align: 'right' },
  ];

  // チャットページのヘッダーアイテム一覧
  const chatItems: NavItem[] = [
    { label: 'SidebarTrigger', type: 'sidebar-trigger', align: 'left', mobileOnly: true },
    { label: 'ModelSelect', type: 'model-select', align: 'left' },
    { label: 'ToggleTheme', type: 'theme-toggle', align: 'right' },
    { label: 'AuthToggleButton', type: 'auth-toggle-button', align: 'right' },
  ];

  // ログインページヘッダーアイテム一覧
  const authPageItems: NavItem[] = [
    { label: 'Home', type: 'link', align: 'left' },
    { label: 'ToggleTheme', type: 'theme-toggle', align: 'right' },
  ];

  const getHeaderItems = (pathValue: string): NavItem[] => {
    if (pathValue.startsWith('/chat')) return chatItems;
    if (pathValue.startsWith('/auth')) return authPageItems;
    if (pathValue === '/') return homeItems;

    return defaultItems;
  };

  return <Header items={getHeaderItems(path)} nonce={nonce} />;
}
