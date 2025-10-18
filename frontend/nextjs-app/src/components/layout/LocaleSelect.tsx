'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from '@/i18n/routing';
import { Locale, LocaleItem } from '@/types/LocaleTypes';
import { ChevronDownIcon, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

interface LocaleParams {
  isEllipsisMenu?: boolean;
}

const locales: LocaleItem[] = [
  { code: 'ja', label: 'Common.Language.Japanese' },
  { code: 'en', label: 'Common.Language.English' },
];

export function LocaleSelect({ isEllipsisMenu }: LocaleParams) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const t = useTranslations();

  const currentKey = locales.find((l) => l.code === currentLocale)?.label ?? 'Common.Language.English';
  const current = t(currentKey);

  const switchLocale = (newLocale: Locale) => {
    router.push(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={isEllipsisMenu ? 'menu' : 'default'}
          className={`flex w-full items-center justify-start`}
        >
          <span className={isEllipsisMenu ? 'text-muted-foreground' : ''}>
            <Globe />
          </span>
          <span className="flex w-full items-center justify-between gap-2">
            {current} <ChevronDownIcon className="size-4 opacity-80" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => switchLocale(locale.code)}
            className={`cursor-pointer ${currentLocale === locale.code ? 'font-semibold text-primary' : ''}`}
          >
            {t(locale.label)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
