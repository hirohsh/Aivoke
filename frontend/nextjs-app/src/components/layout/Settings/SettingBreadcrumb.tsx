'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useSettings } from '@/providers/SettingsProvider';
import {
  ApiKeySubNavName,
  GeneralSubNavName,
  NavName,
  SecuritySubNavName,
  SubNavName,
} from '@/types/settingTypes';

type Props = {
  homeLabel?: string;
};

export function SettingBreadcrumb({ homeLabel = 'Settings' }: Props) {
  const {
    data,
    setActiveMenu,
    setActiveSubMenu,
    breadcrumbMenuList,
    sliceBreadcrumbMenuList,
    isMobile,
  } = useSettings();

  const isMenu = (menu: NavName | SubNavName): menu is NavName => {
    return data.nav.some((navItem) => navItem.name === menu);
  };

  const isSubMenu = (menu: NavName | SubNavName): menu is SubNavName => {
    return data.nav.some((navItem) => {
      switch (navItem.name) {
        case 'General':
          return navItem.subNav.includes(menu as GeneralSubNavName);
        case 'Security':
          return navItem.subNav.includes(menu as SecuritySubNavName);
        case 'Api Key':
          return navItem.subNav.includes(menu as ApiKeySubNavName);
        default:
          return false;
      }
    });
  };

  const handleMenuClick = (menu: NavName | SubNavName) => {
    if (isMenu(menu)) {
      setActiveMenu(menu);
      setActiveSubMenu(null);
      sliceBreadcrumbMenuList(menu);
    } else if (isSubMenu(menu)) {
      setActiveSubMenu(menu);
      sliceBreadcrumbMenuList(menu);
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="block">
          <BreadcrumbPage className={isMobile ? 'text-lg' : ''}>{homeLabel}</BreadcrumbPage>
        </BreadcrumbItem>
        {breadcrumbMenuList.map((menu) => (
          <div
            key={menu}
            className={`flex items-center gap-1.5 sm:gap-2.5 ${isMobile ? 'hidden' : 'block'}`}
          >
            <BreadcrumbSeparator className="block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="cursor-pointer" onClick={() => handleMenuClick(menu)}>
                {menu}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
