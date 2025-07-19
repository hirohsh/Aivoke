'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { NavName, SettingsMenuData, SubNavName } from '@/types/settingTypes';
import { KeyRound, LockKeyhole } from 'lucide-react';
import { createContext, useContext, useState } from 'react';

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
  isMobile: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const data: SettingsMenuData = {
    nav: [
      { name: 'Security', icon: LockKeyhole, subNav: ['ChangePassword'] },
      { name: 'Api Key', icon: KeyRound, subNav: [] },
    ],
  };

  const [activeMenu, setActiveMenu] = useState(data.nav[0].name);
  const [activeSubMenu, setActiveSubMenu] = useState<SubNavName | null>(null);
  const [breadcrumbMenuList, setBreadcrumbMenuList] = useState<(NavName | SubNavName)[]>([data.nav[0].name]);

  const isMobile = useIsMobile();

  const pushBreadcrumbMenuList = (menu: NavName | SubNavName) => {
    setBreadcrumbMenuList((prev) => [...prev, menu]);
  };

  const popBreadcrumbMenuList = () => {
    setBreadcrumbMenuList((prev) => prev.slice(0, -1));
  };

  const sliceBreadcrumbMenuList = (menu: NavName | SubNavName) => {
    setBreadcrumbMenuList((prev) => {
      const index = prev.indexOf(menu);
      if (index !== -1) {
        return prev.slice(0, index + 1);
      }
      return prev;
    });
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
