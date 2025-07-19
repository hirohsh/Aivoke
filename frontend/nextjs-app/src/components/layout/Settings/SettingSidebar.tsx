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
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export function SettingSidebar({ children }: Props) {
  const { data, activeMenu, setActiveMenu, setBreadcrumbMenuList, isMobile } = useSettings();

  const handleMenuClick = (menu: NavName) => {
    setActiveMenu(menu);
    setBreadcrumbMenuList([menu]);
  };

  return (
    <SidebarProvider className="min-h-full items-start">
      <Sidebar collapsible="none" className={`${isMobile ? 'hidden' : 'flex'}`}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.nav.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      isActive={item.name === activeMenu}
                      onClick={() => handleMenuClick(item.name)}
                    >
                      <item.icon />
                      <span>{item.name}</span>
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
