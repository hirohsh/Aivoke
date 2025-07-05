import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { headers } from 'next/headers';
import { type ReactNode } from 'react';

type ThemeProviderAttribute = 'class' | 'data-theme' | 'data-mode';

interface ThemeProviderProps {
  children: ReactNode;
  attribute?: ThemeProviderAttribute;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export async function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  return (
    <NextThemesProvider
      nonce={nonce}
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      disableTransitionOnChange={disableTransitionOnChange}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
