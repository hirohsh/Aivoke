'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronRightIcon } from 'lucide-react';
import { SettingItem } from '../SettingItem';
import { SettingMenu } from '../SettingMenu';
import { ContentWrapper } from './ContentWrapper';

export function SecurityContent() {
  return (
    <ContentWrapper>
      <SettingMenu>
        <SettingItem>
          <Button variant="ghost" className="w-full cursor-pointer justify-between">
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
    </ContentWrapper>
  );
}
