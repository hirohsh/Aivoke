import { AppSidebar } from '@/components/layout/AppSidebar';
import { HeaderWrapper } from '@/components/layout/HeaderWrapper';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getUser } from '@/lib/auth';
import { getConversationList } from '@/lib/conversations';
import { ModelProvider } from '@/providers/ModelProvider';
import '@/styles/globals.css';
import { ConversationRow } from '@/types/chatTypes';
import { createAdminClient, createAnonClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  const supabaseAnon = await createAnonClient();
  const { user } = await getUser(supabaseAnon);

  let convList: ConversationRow[] = [];

  if (user) {
    const supabaseAdmin = await createAdminClient();
    convList = await getConversationList(supabaseAdmin, user.id);
  }
  return (
    <SidebarProvider defaultOpen={true}>
      <ModelProvider>
        <AppSidebar convList={convList} />
        <main className="relative w-full">
          <HeaderWrapper nonce={nonce} />
          {children}
        </main>
      </ModelProvider>
    </SidebarProvider>
  );
}
