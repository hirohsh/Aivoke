'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { API_KEY_TYPES, SETTING_ITEMS } from '@/lib/constants';
import { ApiKeyType, NavName, Settings, SettingsMenuData, SubNavName } from '@/types/settingTypes';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

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
  // パンくずリスト用状態定義
  const [activeMenu, setActiveMenu] = useState(SETTING_ITEMS.nav[0].name);
  const [activeSubMenu, setActiveSubMenu] = useState<SubNavName | null>(null);
  const [breadcrumbMenuList, setBreadcrumbMenuList] = useState<(NavName | SubNavName)[]>([SETTING_ITEMS.nav[0].name]);
  const [settings, setSettings] = useState<Settings | null>(initialSettings);

  // モバイルデバイスかどうかのフック
  const isMobile = useIsMobile();

  // パンくずリストの末尾にメニュー追加
  const pushBreadcrumbMenuList = useCallback(
    (menu: NavName | SubNavName) => setBreadcrumbMenuList((prev) => [...prev, menu]),
    []
  );

  // パンくずリストの末尾からメニュー削除
  const popBreadcrumbMenuList = useCallback(() => setBreadcrumbMenuList((prev) => prev.slice(0, -1)), []);

  // パンくずリストの特定メニューまでスライス
  const sliceBreadcrumbMenuList = useCallback(
    (menu: NavName | SubNavName) =>
      setBreadcrumbMenuList((prev) => {
        const idx = prev.indexOf(menu);
        return idx !== -1 ? prev.slice(0, idx + 1) : prev;
      }),
    []
  );

  const getProviderId = useCallback((apiKey: ApiKeyType | null | undefined) => {
    const provider = Object.values(API_KEY_TYPES).find((v) => v.value === apiKey);
    return provider ? provider.id : API_KEY_TYPES.HUGGING_FACE.id;
  }, []);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

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
        data: SETTING_ITEMS,
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
