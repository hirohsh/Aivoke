'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { useSettings } from '@/providers/SettingsProvider';
import { NavName } from '@/types/settingTypes';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function SettingSidebar({ children }: Props) {
  const t = useTranslations();
  const { data, activeMenu, setActiveMenu, setBreadcrumbMenuList, isMobile, setActiveSubMenu } = useSettings();

  const handleMenuClick = (menu: NavName) => {
    setActiveMenu(menu);
    setActiveSubMenu(null);
    setBreadcrumbMenuList([menu]);
  };

  return (
    <SidebarProvider className="h-full items-start">
      <Sidebar collapsible="none" className={`${isMobile ? 'hidden' : 'flex'}`}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.nav.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton isActive={item.name === activeMenu} onClick={() => handleMenuClick(item.name)}>
                      <item.icon />
                      <span>{t(`Settings.Nav.${item.name}`)}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      {children}
    </SidebarProvider>
  );
}
