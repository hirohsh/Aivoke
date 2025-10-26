'use server';

import { CONVERSATION_DELETE_FAILURE_MESSAGE, CONVERSATION_DELETE_SUCCESS_MESSAGE } from '@/lib/constants';
import { getUser } from '@/lib/server/auth';
import { deleteConversation } from '@/lib/server/conversations';
import { getCurrentLocale } from '@/lib/server/Locale';
import { DeleteChatSchema } from '@/schemas/chatSchemas';
import { ChatActionState, DeleteChatValues } from '@/types/chatTypes';
import { createAdminClient, createAnonClient } from '@/utils/supabase/server';
import { getTranslations } from 'next-intl/server';
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
  const locale = await getCurrentLocale();
  const t = await getTranslations({ locale });

  const { user, userError } = await getUser(supabaseAnon);

  if (!user || userError) {
    revalidatePath('/', 'layout');
    return redirect(`/${locale}/auth/login`);
  }

  const data: DeleteChatValues = {
    conversationId: formData.get('conversationId') as string,
    csrfToken: formData.get('csrfToken') as string,
  };
  const parsedSchema = DeleteChatSchema.safeParse(data);

  if (!parsedSchema.success) {
    const errorMessages = parsedSchema.error.errors.map((error) => error.message).join(', ');
    return { ok: false, formError: errorMessages };
  }

  const supabaseAdmin = await createAdminClient();

  const result = await deleteConversation(supabaseAdmin, user.id, parsedSchema.data.conversationId);

  if (!result) {
    return { ok: false, message: t(CONVERSATION_DELETE_FAILURE_MESSAGE) };
  }

  revalidatePath('/', 'layout');

  return { ok: true, message: t(CONVERSATION_DELETE_SUCCESS_MESSAGE) };
}
