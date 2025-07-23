import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

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

export interface NavItem {
  name: NavName;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  subNav?: SubNavName[];
}

export interface SettingsMenuData {
  nav: NavItem[];
}
