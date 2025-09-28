'use server';

import { getUser } from '@/lib/auth';
import { CONVERSATION_DELETE_FAILURE_MESSAGE, CONVERSATION_DELETE_SUCCESS_MESSAGE } from '@/lib/constants';
import { deleteConversation } from '@/lib/conversations';
import { DeleteChatSchema } from '@/schemas/chatSchemas';
import { ChatActionState, DeleteChatValues } from '@/types/chatTypes';
import { createAdminClient, createAnonClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * チャット削除
 * @param _prevState
 * @param conversationId
 * @returns
 */
export async function deleteChat(_prevState: ChatActionState, formData: FormData): Promise<ChatActionState> {
  const supabaseAnon = await createAnonClient();

  const { user, userError } = await getUser(supabaseAnon);

  if (!user || userError) {
    revalidatePath('/', 'layout');
    return redirect('/auth/login');
  }

  const data: DeleteChatValues = {
    conversationId: formData.get('conversationId') as string,
  };
  const parsedSchema = DeleteChatSchema.safeParse(data);

  if (!parsedSchema.success) {
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { ok: false, formError: errorMessages };
  }

  const supabaseAdmin = await createAdminClient();

  const result = await deleteConversation(supabaseAdmin, user.id, parsedSchema.data.conversationId);

  if (!result) {
    return { ok: false, message: CONVERSATION_DELETE_FAILURE_MESSAGE };
  }

  revalidatePath('/', 'layout');

  return { ok: true, message: CONVERSATION_DELETE_SUCCESS_MESSAGE };
}
