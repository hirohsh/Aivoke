'use client';

import { useSettings } from '@/providers/SettingsProvider';
import { NAV_NAMES, NavName } from '@/types/settingTypes';
import { ApiKeyContent } from './Contents/ApiKeyContent';
import { GeneralContent } from './Contents/GeneralContent';
import { SecurityContent } from './Contents/SecurityContent';

export function SettingsContents() {
  const { data, activeMenu, isMobile } = useSettings();

  const renderContent = (menu: NavName) => {
    switch (menu) {
      case NAV_NAMES.General:
        return <GeneralContent />;
      case NAV_NAMES.Security:
        return <SecurityContent />;
      case NAV_NAMES.ApiKey:
        return <ApiKeyContent />;
      default:
        return null;
    }
  };

  const renderMobileContent = () => {
    return (
      <>
        {data.nav.map((item) => (
          <div key={item.name} className="flex flex-col gap-3">
            <h2 className="mt-3 flex items-center gap-2 text-sm font-semibold">
              <item.icon className="size-4" />
              <span>{item.name}</span>
            </h2>
            {renderContent(item.name)}
          </div>
        ))}
      </>
    );
  };

  return <>{isMobile ? renderMobileContent() : renderContent(activeMenu)}</>;
}
