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
import { Link } from '@/i18n/routing';
import { useModel } from '@/providers/ModelProvider';
import { useSettings } from '@/providers/SettingsProvider';
import { ConversationRow } from '@/types/chatTypes';
import { ModelId } from '@/types/modelTypes';
import { HomeIcon, SquarePen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ConversationMenuButton } from '../chat/ConversationMenuButton';
import { LogoIcon } from '../common/LogoIcon';

interface AppSidebarProps {
  convList?: ConversationRow[];
}

export function AppSidebar({ convList }: AppSidebarProps) {
  const t = useTranslations();
  const { open, openMobile, isMobile, setOpenMobile } = useSidebar();
  const { handleModelChange } = useModel();
  const { settings } = useSettings();
  const [list, setList] = useState<ConversationRow[]>(convList || []);
  const params = useParams();
  const conversationIdParam = Array.isArray(params?.conversation_id)
    ? params?.conversation_id[0]
    : params?.conversation_id;

  useEffect(() => {
    setList(convList || []);
  }, [convList]);

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

  const handleConversationClick = (conv: ConversationRow) => {
    if (isMobile) setOpenMobile(false);
    handleModelChange(settings?.apiKey.type ? (conv.model as ModelId) : '');
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="pt-4">
          <div className="flex items-center justify-between">
            {open || openMobile ? renderLogoIcon() : renderToggleLogoIcon()}
            {(open || openMobile) && <SidebarTrigger className="cursor-pointer" />}
          </div>
        </SidebarHeader>
        <SidebarContent className="scrollbar overflow-hidden">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('Layout.Sidebar.NewChat')} className="cursor-pointer">
                  <Link
                    href="/chat"
                    onClick={() => {
                      if (isMobile) setOpenMobile(false);
                    }}
                  >
                    <SquarePen />
                    <span>{t('Layout.Sidebar.NewChat')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('Layout.Sidebar.Home')}>
                  <Link
                    href="/"
                    onClick={() => {
                      if (isMobile) setOpenMobile(false);
                    }}
                  >
                    <HomeIcon />
                    <span>{t('Layout.Sidebar.Home')}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          {(open || openMobile) && (
            <SidebarGroup>
              <SidebarGroupLabel>{t('Layout.Sidebar.Chat')}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem className="scrollbar h-[60vh] overflow-y-auto">
                  {list &&
                    list.length > 0 &&
                    list.map((conv) => {
                      const isActive = conv.id === conversationIdParam;
                      return (
                        <div key={conv.id} className="group/item relative">
                          <SidebarMenuButton
                            asChild
                            className={
                              isActive
                                ? 'my-1 bg-input/60 dark:bg-input/30'
                                : 'my-1 cursor-pointer group-hover/item:bg-input/60 dark:group-hover/item:bg-input/30'
                            }
                          >
                            <Link href={`/chat/${conv.id}`} onClick={() => handleConversationClick(conv)}>
                              <span>{conv.title}</span>
                            </Link>
                          </SidebarMenuButton>
                          <ConversationMenuButton
                            conversationId={conv.id}
                            activeConversationId={conversationIdParam}
                            className="absolute top-0 right-0 z-1000 text-transparent group-hover/item:text-foreground"
                          />
                        </div>
                      );
                    })}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    </>
  );
}
