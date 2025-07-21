'use client';

import { Button } from '@/components/ui/button';
import { useSettings } from '@/providers/SettingsProvider';
import { NAV_NAMES, SECURITY_SUB_NAV_NAMES } from '@/types/settingTypes';
import { ArrowLeft } from 'lucide-react';

export function ChangePasswordContent() {
  const { activeMenu, activeSubMenu, popBreadcrumbMenuList, setActiveSubMenu } = useSettings();

  if (activeMenu !== NAV_NAMES.Security || activeSubMenu !== SECURITY_SUB_NAV_NAMES.ChangePassword) {
    return null; // Render nothing if not in the correct menu or sub-menu
  }

  const handleBack = () => {
    setActiveSubMenu(null);
    popBreadcrumbMenuList();
  };

  return (
    <div className="flex w-full justify-between">
      <h2>Change Password</h2>
      <Button variant="ghost" type="button" size="icon" onClick={handleBack}>
        <ArrowLeft />
      </Button>
    </div>
  );
}
