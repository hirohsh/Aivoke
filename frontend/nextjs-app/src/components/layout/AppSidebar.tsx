'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { LogoIcon } from '../common/LogoIcon';

export function AppSidebar() {
  const { open, openMobile } = useSidebar();

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
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
