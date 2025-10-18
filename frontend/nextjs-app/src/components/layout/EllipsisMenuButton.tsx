'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/providers/AuthProvider';

import { useIsMobile } from '@/hooks/use-mobile';
import { CircleUser, EllipsisVertical, LogOut, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { LocaleSelect } from './LocaleSelect';
import { SettingsDialog } from './Settings/SettingsDialog';
import { ThemeToggle } from './ThemeToggle';

export function EllipsisMenuButton() {
  const t = useTranslations();
  const { user, logoutAction, isLogoutPending } = useAuth();
  const [openLogOut, setOpenLogOut] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <div className="flex items-center gap-2 py-1 text-left text-sm">
              <CircleUser className="size-4" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs">{user ? user.email : t('Auth.NotLoggedIn')}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {isMobile && (
              <>
                <DropdownMenuItem asChild>
                  <LocaleSelect isEllipsisMenu />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <ThemeToggle isEllipsisMenu />
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={() => setOpenSettings(true)}>
              <Settings />
              {t('Settings.Breadcrumb.Home')}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenLogOut(true)} disabled={isLogoutPending}>
            <LogOut />
            {t('Auth.Logout.Label')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        onConfirm={logoutAction}
        title={t('Auth.Logout.ConfirmTitle')}
        description={t('Auth.Logout.ConfirmDescription')}
        isOpen={openLogOut}
        setOpen={setOpenLogOut}
        confirmLabel={t('Auth.Logout.ConfirmLabel')}
      />

      <SettingsDialog isOpen={openSettings} setOpen={setOpenSettings} />
    </>
  );
}
