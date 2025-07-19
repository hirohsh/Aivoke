'use client';

import { Button } from '@/components/ui/button';
import { useSettings } from '@/providers/SettingsProvider';
import { ArrowLeft } from 'lucide-react';

export function ChangePasswordContent() {
  const { activeMenu, activeSubMenu, popBreadcrumbMenuList, setActiveSubMenu } = useSettings();

  if (activeMenu !== 'Security' || activeSubMenu !== 'ChangePassword') {
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
