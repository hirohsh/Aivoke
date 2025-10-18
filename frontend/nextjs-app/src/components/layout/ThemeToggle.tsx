'use client';

import { ChevronDownIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface ThemeParams {
  isEllipsisMenu?: boolean;
}

export function ThemeToggle({ isEllipsisMenu }: ThemeParams) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={isEllipsisMenu ? 'menu' : 'icon'} className="hover:cursor-pointer">
          <Sun
            className={`h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 ${isEllipsisMenu ? 'text-muted-foreground' : ''}`}
          />
          <Moon
            className={`absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 ${isEllipsisMenu ? 'text-muted-foreground' : ''}`}
          />
          <span className={isEllipsisMenu ? 'flex w-full justify-between' : 'sr-only'}>
            {t('Layout.ThemeToggle.Label')} / {mounted ? t(`Layout.ThemeToggle.${resolvedTheme ?? 'system'}`) : ''}
            <ChevronDownIcon className="size-4 opacity-80" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setTheme('light')}>{t('Layout.ThemeToggle.light')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>{t('Layout.ThemeToggle.dark')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>{t('Layout.ThemeToggle.system')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
