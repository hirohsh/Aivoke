'use client';

import { deleteUserAccount } from '@/actions/authActions';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useMutationToast } from '@/hooks/useMutationToast';
import { useRouter } from '@/i18n/routing';
import { SECURITY_SUB_NAV_NAMES } from '@/lib/constants';
import { useAuth } from '@/providers/AuthProvider';
import { useCsrf } from '@/providers/CsrfProvider';
import { useSettings } from '@/providers/SettingsProvider';
import { AuthState } from '@/types/authTypes';
import { ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startTransition, useActionState, useState } from 'react';
import { SettingItem } from '../SettingItem';
import { SettingMenu } from '../SettingMenu';
import { ContentWrapper } from './ContentWrapper';
import { ChangePasswordContent } from './SubContents/Security/ChangePasswordContent';

export function SecurityContent() {
  const t = useTranslations();
  const { activeSubMenu, setActiveSubMenu, pushBreadcrumbMenuList } = useSettings();
  const { isEmailProvider } = useAuth();
  const [deleteState, deleteUser, deletePending] = useActionState<AuthState, FormData>(deleteUserAccount, {
    ok: false,
  });
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();
  const { token } = useCsrf();

  const onSuccess = () => {
    router.push('/auth/login');
  };

  useMutationToast({
    state: deleteState,
    pending: deletePending,
    onSuccess,
    toastOptions: {
      duration: 10000,
      position: 'top-center',
      action: {
        label: t('Common.Close'),
        onClick: () => {},
      },
    },
  });

  const handleChangePassword = () => {
    setActiveSubMenu(SECURITY_SUB_NAV_NAMES.ChangePassword);
    pushBreadcrumbMenuList(SECURITY_SUB_NAV_NAMES.ChangePassword);
  };

  const handleDeleteAccount = () => {
    const fd = new FormData();
    fd.append('csrfToken', token || '');
    startTransition(() => {
      deleteUser(fd);
    });
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
              {t('Settings.Security.ChangePassword')}
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
              {t('Settings.Security.DeleteAccount')}
              <ChevronRightIcon className="ml-auto" />
            </Button>
          </SettingItem>
        </SettingMenu>
        <ConfirmDialog
          onConfirm={handleDeleteAccount}
          title={t('Settings.Security.DeleteConfirmTitle')}
          description={t('Settings.Security.DeleteConfirmDescription')}
          isOpen={openDelete}
          setOpen={setOpenDelete}
          confirmLabel={t('Common.Delete')}
          confirmVariant="destructive"
        />
      </>
    );
  };

  return <ContentWrapper>{renderContent()}</ContentWrapper>;
}
