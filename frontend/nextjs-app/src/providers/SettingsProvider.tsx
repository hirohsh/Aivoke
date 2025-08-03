'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import {
  API_KEY_TYPES,
  ApiKeyType,
  NAV_NAMES,
  NavName,
  SECURITY_SUB_NAV_NAMES,
  Settings,
  SettingsMenuData,
  SubNavName,
} from '@/types/settingTypes';
import { KeyRound, LockKeyhole } from 'lucide-react';
import { createContext, useContext, useEffect, useState } from 'react';

type SettingsContextType = {
  activeMenu: NavName;
  setActiveMenu: (menu: NavName) => void;
  activeSubMenu: SubNavName | null;
  setActiveSubMenu: (menu: SubNavName | null) => void;
  breadcrumbMenuList: (NavName | SubNavName)[];
  setBreadcrumbMenuList: (list: (NavName | SubNavName)[]) => void;
  pushBreadcrumbMenuList: (menu: NavName | SubNavName) => void;
  sliceBreadcrumbMenuList: (menu: NavName | SubNavName) => void;
  popBreadcrumbMenuList: () => void;
  data: SettingsMenuData;
  settings: Settings | null;
  setSettings: (settings: Settings | null) => void;
  getProviderId: (apiKey: ApiKeyType | null | undefined) => string;
  isMobile: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({
  initialSettings,
  children,
}: {
  initialSettings: Settings | null;
  children: React.ReactNode;
}) => {
  // ナビゲーションメニューとサブメニューの初期データ
  const data: SettingsMenuData = {
    nav: [
      { name: NAV_NAMES.ApiKey, icon: KeyRound },
      { name: NAV_NAMES.Security, icon: LockKeyhole, subNav: Object.values(SECURITY_SUB_NAV_NAMES) },
    ],
  };

  // パンくずリスト用状態定義
  const [activeMenu, setActiveMenu] = useState(data.nav[0].name);
  const [activeSubMenu, setActiveSubMenu] = useState<SubNavName | null>(null);
  const [breadcrumbMenuList, setBreadcrumbMenuList] = useState<(NavName | SubNavName)[]>([data.nav[0].name]);

  // モバイルデバイスかどうかのフック
  const isMobile = useIsMobile();

  // パンくずリストの末尾にメニュー追加
  const pushBreadcrumbMenuList = (menu: NavName | SubNavName) => {
    setBreadcrumbMenuList((prev) => [...prev, menu]);
  };

  // パンくずリストの末尾からメニュー削除
  const popBreadcrumbMenuList = () => {
    setBreadcrumbMenuList((prev) => prev.slice(0, -1));
  };

  // パンくずリストの特定メニューまでスライス
  const sliceBreadcrumbMenuList = (menu: NavName | SubNavName) => {
    setBreadcrumbMenuList((prev) => {
      const index = prev.indexOf(menu);
      if (index !== -1) {
        return prev.slice(0, index + 1);
      }
      return prev;
    });
  };

  // 設定状態定義
  const [settings, setSettings] = useState<Settings | null>(initialSettings);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const getProviderId = (apiKey: ApiKeyType | null | undefined) => {
    const provider = Object.values(API_KEY_TYPES).find((v) => v.value === apiKey);
    return provider ? provider.id : API_KEY_TYPES.HUGGING_FACE.id;
  };

  return (
    <SettingsContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        activeSubMenu,
        setActiveSubMenu,
        breadcrumbMenuList,
        setBreadcrumbMenuList,
        pushBreadcrumbMenuList,
        popBreadcrumbMenuList,
        sliceBreadcrumbMenuList,
        data,
        settings,
        setSettings,
        getProviderId,
        isMobile,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
