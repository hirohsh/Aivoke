'use client';

import type { NavItem } from '@/components/layout/Header';
import { Header } from '@/components/layout/Header';
import { usePathname } from 'next/navigation';

/**
 * HeaderWrapper コンポーネント
 * - usePathname フックを使用して、現在のパスに基づいてナビゲーション項目を動的に変更します。
 */
export function HeaderWrapper() {
  const path = usePathname();

  // 基本ヘッダーアイテム一覧
  const defaultItems: NavItem[] = [
    { label: 'Home', type: 'link', align: 'left' },
    { label: 'Chat', type: 'link', align: 'left' },
    { label: 'ToggleTheme', type: 'theme-toggle', align: 'right' },
    { label: 'AuthToggleButton', type: 'auth-toggle-button', align: 'right' },
  ];

  // チャットページのヘッダーアイテム一覧
  const chatItems: NavItem[] = [
    { label: 'SidebarTrigger', type: 'sidebar-trigger', align: 'left', mobileOnly: true },
    { label: 'Home', type: 'link', align: 'left' },
    { label: 'ModelSelect', type: 'model-select', align: 'left' },
    { label: 'ToggleTheme', type: 'theme-toggle', align: 'right' },
    { label: 'AuthToggleButton', type: 'auth-toggle-button', align: 'right' },
  ];

  // ログインページヘッダーアイテム一覧
  const loginItems: NavItem[] = [
    { label: 'Home', type: 'link', align: 'left' },
    { label: 'ToggleTheme', type: 'theme-toggle', align: 'right' },
  ];

  // ログインページヘッダーアイテム一覧
  const signupItems: NavItem[] = [
    { label: 'Home', type: 'link', align: 'left' },
    { label: 'ToggleTheme', type: 'theme-toggle', align: 'right' },
  ];

  const getHeaderItems = (pathValue: string): NavItem[] => {
    if (pathValue.startsWith('/chat')) return chatItems;
    if (pathValue.startsWith('/login')) return loginItems;
    if (pathValue.startsWith('/signup')) return signupItems;

    return defaultItems;
  };

  return <Header items={getHeaderItems(path)} />;
}
