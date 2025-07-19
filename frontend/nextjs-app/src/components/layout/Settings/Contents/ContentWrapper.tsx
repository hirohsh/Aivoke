'use client';

import { useSettings } from '@/providers/SettingsProvider';

type SettingMenuWrapperProps = {
  children: React.ReactNode;
};

export function ContentWrapper({ children }: SettingMenuWrapperProps) {
  const { isMobile } = useSettings();

  return (
    <div
      className={`aspect-video ${isMobile ? '' : 'min-h-full'} max-w-3xl rounded-xl bg-muted/50 p-3`}
    >
      {children}
    </div>
  );
}
