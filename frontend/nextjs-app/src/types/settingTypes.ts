import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export type NavName = 'General' | 'Security' | 'Api Key';

export type GeneralSubNavName = 'Language';
export type SecuritySubNavName = 'Password' | 'Two-Factor Authentication';
export type ApiKeySubNavName = 'create' | 'list' | 'delete';

export type SubNavName = GeneralSubNavName | SecuritySubNavName | ApiKeySubNavName;

type SubNavMap = {
  General: GeneralSubNavName[];
  Security: SecuritySubNavName[];
  'Api Key': ApiKeySubNavName[];
};

export interface BaseNavItem<T extends NavName> {
  name: T;
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  subNav: SubNavMap[T];
}

export type NavItem = BaseNavItem<'General'> | BaseNavItem<'Security'> | BaseNavItem<'Api Key'>;

export interface SettingsMenuData {
  nav: NavItem[];
}
