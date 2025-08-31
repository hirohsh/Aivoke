'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { HomeIcon, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { LogoIcon } from '../common/LogoIcon';

export function AppSidebar() {
  const { open, openMobile, isMobile, setOpenMobile } = useSidebar();

  const renderToggleLogoIcon = () => (
    <div className="group/icon w-fit">
      {/* ふだん表示するコンポーネント */}
      <div>
        <LogoIcon size={32} strokeWidth={20} className="text-foreground group-hover/icon:hidden" />
      </div>

      {/* ホバー中だけ表示するコンポーネント */}
      <div className="pointer-events-auto hidden cursor-pointer group-hover/icon:block">
        <SidebarTrigger className="cursor-pointer" />
      </div>
    </div>
  );

  const renderLogoIcon = () => (
    <div className="flex items-center justify-center">
      <LogoIcon size={32} strokeWidth={20} className="text-foreground" />
    </div>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pt-4">
        <div className="flex items-center justify-between">
          {open || openMobile ? renderLogoIcon() : renderToggleLogoIcon()}
          {(open || openMobile) && <SidebarTrigger className="cursor-pointer" />}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="New Chat" className="cursor-pointer">
                <SquarePen />
                <span>New Chat</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Home">
                <Link
                  href="/"
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  <HomeIcon />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {(open || openMobile) && (
          <SidebarGroup>
            <SidebarGroupLabel>Chat</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="New Chat">
                  <span>New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
