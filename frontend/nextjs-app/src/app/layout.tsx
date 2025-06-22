import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import '../styles/globals.css';

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'AI Developer',
  description: 'generative ai developer app',
  keywords: 'next, react, app, ai, developer, generative ai',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${notoSansJP.variable} font-noto antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <HeaderWrapper />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
