import { AppSidebar } from '@/components/layout/AppSidebar';
import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ModelProvider } from '@/providers/ModelProvider';
import '@/styles/globals.css';
import { headers } from 'next/headers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  return (
    <SidebarProvider defaultOpen={true}>
      <ModelProvider>
        <AppSidebar />
        <main className="relative w-full">
          <HeaderWrapper nonce={nonce} />
          {children}
        </main>
      </ModelProvider>
    </SidebarProvider>
  );
}
