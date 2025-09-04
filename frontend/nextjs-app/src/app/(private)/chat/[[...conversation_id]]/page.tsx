import { ChatContainer } from '@/components/chat/ChatContainer';
import { getConversationMessages } from '@/lib/conversations';
import { getUser } from '@/lib/users';
import { Message } from '@/types/chatTypes';
import { createAdminClient, createAnonClient } from '@/utils/supabase/server';

interface PageProps {
  params: Promise<{
    conversation_id?: string[];
  }>;
}

export default async function ChatPage({ params }: PageProps) {
  const conversation_id = (await params).conversation_id?.[0];
  const supabaseAnon = await createAnonClient();
  const { user } = await getUser(supabaseAnon);

  let messages: Message[] = [];

  if (conversation_id && user) {
    const supabaseAdmin = await createAdminClient();
    messages = await getConversationMessages(supabaseAdmin, user.id, conversation_id);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full flex-col gap-4 3xl:h-lvh">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border-none">
        <ChatContainer initialMessages={messages} />
      </div>
    </div>
  );
}
