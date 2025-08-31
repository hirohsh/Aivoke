import { FALLBACK_MESSAGE } from '@/lib/constants';
import { getUser } from '@/lib/users';
import { AnyModelIdSchema, MessageSchema } from '@/schemas/chatSchemas';
import { MessageInput } from '@/types/chatTypes';
import { ModelId } from '@/types/modelTypes';
import { ApiKeyType } from '@/types/settingTypes';
import { createAdminClient, createAnonClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { executeChat } from '../../_services/chatService';

export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: Promise<{ modelId: ModelId }> }) {
  try {
    // リクエストのボディを解析
    const body: MessageInput = await request.json();
    const { modelId } = await params;

    const parsedMessage = MessageSchema.safeParse(body);
    if (!parsedMessage.success) {
      return NextResponse.json({ error: 'ValidationError', issues: parsedMessage.error.flatten() }, { status: 400 });
    }

    const parsedModelId = AnyModelIdSchema.safeParse(modelId);
    if (!parsedModelId.success) {
      return NextResponse.json({ error: 'ValidationError', issues: parsedModelId.error.flatten() }, { status: 400 });
    }

    const supabaseAnon = await createAnonClient();

    // ユーザー情報を取得
    const { user, userError } = await getUser(supabaseAnon);
    if (!user || userError) {
      return NextResponse.json({ error: 'Failed to retrieve user information' }, { status: 400 });
    }

    const supabaseAdmin = await createAdminClient();

    // API providerを取得
    const { data: providerName, error: providerError } = await supabaseAdmin.rpc('get_user_provider_name', {
      p_user_id: user.id,
    });
    if (providerError || !providerName) {
      return NextResponse.json({ error: 'API provider not found' }, { status: 400 });
    }

    // APIキーを取得
    const { data: apiKey, error: apiKeyError } = await supabaseAdmin.rpc('get_api_key_secret', {
      p_user_id: user.id,
    });
    if (apiKeyError || !apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 400 });
    }

    const stream = executeChat(
      providerName as ApiKeyType,
      parsedModelId.data,
      apiKey,
      parsedMessage.data.message,
      request.signal
    );

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: FALLBACK_MESSAGE }, { status: 500 });
  }
}
