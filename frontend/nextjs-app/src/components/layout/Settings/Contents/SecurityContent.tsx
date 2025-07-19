'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/providers/SettingsProvider';
import { ChevronRightIcon } from 'lucide-react';
import { SettingItem } from '../SettingItem';
import { SettingMenu } from '../SettingMenu';
import { ContentWrapper } from './ContentWrapper';
import { ChangePasswordContent } from './SubContents/Security/ChangePasswordContent';

export function SecurityContent() {
  const { activeMenu, activeSubMenu, setActiveSubMenu, pushBreadcrumbMenuList } = useSettings();

  if (activeMenu !== 'Security') {
    return null; // Render nothing if not in the correct menu or if a sub-menu is active
  }

  const handleChangePassword = () => {
    setActiveSubMenu('ChangePassword');
    pushBreadcrumbMenuList('ChangePassword');
  };

  const renderContent = () => {
    if (activeSubMenu === 'ChangePassword') {
      return <ChangePasswordContent />;
    }

    return (
      <SettingMenu>
        <SettingItem>
          <Button variant="ghost" onClick={handleChangePassword} className="w-full cursor-pointer justify-between">
            パスワードを変更
            <ChevronRightIcon className="ml-auto" />
          </Button>
        </SettingItem>
        <Separator className="my-2" />
        <SettingItem>
          <Button variant="dangerous" className="w-full cursor-pointer justify-between">
            アカウントを削除
            <ChevronRightIcon className="ml-auto" />
          </Button>
        </SettingItem>
      </SettingMenu>
    );
  };

  return <ContentWrapper>{renderContent()}</ContentWrapper>;
}
