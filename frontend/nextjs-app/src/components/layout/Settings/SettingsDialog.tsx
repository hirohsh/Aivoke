'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { SettingBreadcrumb } from './SettingBreadcrumb';
import { SettingsContents } from './SettingContents';
import { SettingSidebar } from './SettingSidebar';

type Props = {
  /** トリガー変数 */
  isOpen: boolean;
  /** トリガー変数を更新する関数 */
  setOpen: (open: boolean) => void;
};

export function SettingsDialog({ isOpen, setOpen }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-h-[550px] overflow-hidden p-0 md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">Customize your settings here.</DialogDescription>
        <SettingSidebar>
          <div className="flex h-[550px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SettingBreadcrumb />
              </div>
            </header>
            <div className="scrollbar flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              <SettingsContents />
            </div>
          </div>
        </SettingSidebar>
      </DialogContent>
    </Dialog>
  );
}
