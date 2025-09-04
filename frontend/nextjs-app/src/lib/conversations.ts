import { ConversationRow, Message, MessageRow } from '@/types/chatTypes';
import { Database } from '@/types/database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import 'server-only';

export const getConversationMessages = async (
  supabaseAdmin: SupabaseClient<Database, 'public', Database['public']>,
  userId: string,
  conversationId?: string
): Promise<Message[]> => {
  const result: Message[] = [];

  if (!conversationId) return result;

  const { data, error } = await supabaseAdmin.rpc('rpc_list_messages', {
    p_conversation_id: conversationId,
    p_user_id: userId,
    p_limit: 500,
  });

  if (error) {
    console.error('Error fetching messages');
    return result;
  }

  if (data) {
    data.forEach((msg: MessageRow) => {
      result.push({
        id: msg.id,
        type: msg.role,
        content: String(msg.content),
        timestamp: msg.created_at,
      });
    });
  }

  return result;
};

export const getConversationList = async (
  supabaseAdmin: SupabaseClient<Database, 'public', Database['public']>,
  userId: string,
  limit?: number
): Promise<ConversationRow[]> => {
  const result: ConversationRow[] = [];

  const { data, error } = await supabaseAdmin.rpc('rpc_list_conversations', {
    p_user_id: userId,
    p_limit: limit ?? 100,
  });

  if (error) {
    console.error('Error fetching conversations');
    return result;
  }

  if (data) {
    data.forEach((conv) => {
      if (!conv.id || !conv.title || !conv.model || !conv.created_at) return;
      result.push({
        id: conv.id,
        title: conv.title,
        model: conv.model,
        created_at: conv.created_at,
      });
    });
  }

  return result;
};
