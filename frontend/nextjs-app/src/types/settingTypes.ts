import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

// ナビゲーションメニュー定義
export const NAV_NAMES = {
  General: 'General',
  Security: 'Security',
  ApiKey: 'Api Key',
} as const;

export type NavName = (typeof NAV_NAMES)[keyof typeof NAV_NAMES];

// セキュリティサブメニュー定義
export const SECURITY_SUB_NAV_NAMES = {
  ChangePassword: 'Change Password',
  TwoFactorAuthentication: 'Two-Factor Authentication',
} as const;

export type SecuritySubNavName = (typeof SECURITY_SUB_NAV_NAMES)[keyof typeof SECURITY_SUB_NAV_NAMES];

export type SubNavName = SecuritySubNavName;

// ナビゲーションメニューアイテム定義
export interface NavItem {
  name: NavName;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  subNav?: SubNavName[];
}

export interface SettingsMenuData {
  nav: NavItem[];
}

// サーバーアクションの状態定義
export interface SettingActionState {
  ok: boolean;
  message?: string;
  formError?: string;
}

// APIキーの種類定義
export const API_KEY_TYPES = {
  HUGGING_FACE: { id: '1', value: 'Hugging Face' },
} as const;

export type ApiKeyType = (typeof API_KEY_TYPES)[keyof typeof API_KEY_TYPES]['value'];

// 設定情報の型定義
export interface Settings {
  apiKey: {
    type: ApiKeyType | null | undefined;
  };
}
