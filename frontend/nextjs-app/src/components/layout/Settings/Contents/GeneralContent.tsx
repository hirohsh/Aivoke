'use client';

import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
import { ContentWrapper } from './ContentWrapper';

export function GeneralContent() {
  const t = useTranslations();
  return (
    <ContentWrapper>
      <div>{t('Settings.General.Title')}</div>
      <Separator />
    </ContentWrapper>
  );
}
