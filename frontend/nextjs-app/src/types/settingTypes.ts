import { API_KEY_TYPES, NAV_NAMES, SECURITY_SUB_NAV_NAMES } from '@/lib/constants';
import { apiKeySchema, userSettingsRpcSchema } from '@/schemas/settingSchemas';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import z from 'zod';

export type ApiKeyFormValues = z.infer<typeof apiKeySchema>;

export type UserSettingsRpcValues = z.infer<typeof userSettingsRpcSchema>;

export type ApiKeyType = (typeof API_KEY_TYPES)[keyof typeof API_KEY_TYPES]['value'];

export type NavName = (typeof NAV_NAMES)[keyof typeof NAV_NAMES];

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

export interface SettingActionState {
  ok: boolean;
  message?: string;
  formError?: string;
}

export interface Settings {
  apiKey: {
    type: ApiKeyType | null | undefined;
  };
}
