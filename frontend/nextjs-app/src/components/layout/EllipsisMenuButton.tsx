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

import { CircleUser, EllipsisVertical, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { SettingsDialog } from './Settings/SettingsDialog';

export function EllipsisMenuButton() {
  const { signOut } = useAuth();
  const { user } = useAuth();
  const [openLogOut, setOpenLogOut] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>
            <div className="flex items-center gap-2 py-1 text-left text-sm">
              <CircleUser className="size-4" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs">{user ? user.email : 'Not logged in'}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setOpenSettings(true)}>
              <Settings />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenLogOut(true)}>
            <LogOut />
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        onConfirm={signOut}
        title="ログアウトの確認"
        description="ログアウトしますか？"
        isOpen={openLogOut}
        setOpen={setOpenLogOut}
        confirmLabel="ログアウト"
      />

      <SettingsDialog isOpen={openSettings} setOpen={setOpenSettings} />
    </>
  );
}
