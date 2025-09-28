'use client';

import { deleteUserAccount } from '@/actions/authActions';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SECURITY_SUB_NAV_NAMES } from '@/lib/constants';
import { useAuth } from '@/providers/AuthProvider';
import { useSettings } from '@/providers/SettingsProvider';
import { AuthState } from '@/types/authTypes';
import { ChevronRightIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { SettingItem } from '../SettingItem';
import { SettingMenu } from '../SettingMenu';
import { ContentWrapper } from './ContentWrapper';
import { ChangePasswordContent } from './SubContents/Security/ChangePasswordContent';

export function SecurityContent() {
  const { activeSubMenu, setActiveSubMenu, pushBreadcrumbMenuList } = useSettings();
  const { isEmailProvider } = useAuth();
  const [deleteState, deleteUser, deletePending] = useActionState<AuthState>(deleteUserAccount, {
    ok: false,
  });
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!deleteState.message) return; // 初期レンダリング時は無視
    if (deletePending) return; // リクエスト中は無視
    toast.dismiss(); // 既存のトーストをクリア

    if (deleteState.ok) {
      toast.success(deleteState.message, {
        duration: 10000,
        position: 'top-center',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      });
      router.push('/auth/login');
    } else {
      toast.error(deleteState.message, {
        duration: 10000,
        position: 'top-center',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      });
    }
  }, [deleteState.ok, deleteState.message, deletePending, router]);

  const handleChangePassword = () => {
    setActiveSubMenu(SECURITY_SUB_NAV_NAMES.ChangePassword);
    pushBreadcrumbMenuList(SECURITY_SUB_NAV_NAMES.ChangePassword);
  };

  const renderContent = () => {
    if (activeSubMenu === SECURITY_SUB_NAV_NAMES.ChangePassword) {
      return <ChangePasswordContent />;
    }

    return (
      <>
        <SettingMenu>
          <SettingItem>
            <Button
              variant="ghost"
              onClick={handleChangePassword}
              className="w-full cursor-pointer justify-between"
              disabled={!isEmailProvider}
            >
              Change Password
              <ChevronRightIcon className="ml-auto" />
            </Button>
          </SettingItem>
          <Separator className="my-2" />
          <SettingItem>
            <Button
              variant="dangerous"
              onClick={() => setOpenDelete(true)}
              className="w-full cursor-pointer justify-between"
            >
              Delete Account
              <ChevronRightIcon className="ml-auto" />
            </Button>
          </SettingItem>
        </SettingMenu>
        <ConfirmDialog
          onConfirm={deleteUser}
          title="アカウント削除の確認"
          description="アカウントを削除しますか？"
          isOpen={openDelete}
          setOpen={setOpenDelete}
          confirmLabel="削除"
          confirmVariant="destructive"
        />
      </>
    );
  };

  return <ContentWrapper>{renderContent()}</ContentWrapper>;
}
