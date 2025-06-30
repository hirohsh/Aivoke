import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import '@/styles/globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderWrapper />
      {children}
    </>
  );
}
