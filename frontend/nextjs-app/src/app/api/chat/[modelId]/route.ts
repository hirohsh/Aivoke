import { FALLBACK_MESSAGE } from '@/lib/constants';
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
    const { data: userData, error: userError } = await supabaseAnon.auth.getUser();
    if (userError) {
      return NextResponse.json({ error: 'ユーザー情報が取得できません' }, { status: 400 });
    }

    const supabaseAdmin = await createAdminClient();

    // Apiプロバイダーを取得
    const { data: providerName, error: providerError } = await supabaseAdmin.rpc('get_user_provider_name', {
      p_user_id: userData.user?.id,
    });
    if (providerError || !providerName) {
      return NextResponse.json({ error: 'APIプロバイダーが見つかりません' }, { status: 400 });
    }

    // APIキーを取得
    const { data: apiKey, error: apiKeyError } = await supabaseAdmin.rpc('get_api_key_secret', {
      p_user_id: userData.user?.id,
    });
    if (apiKeyError || !apiKey) {
      return NextResponse.json({ error: 'APIキーが見つかりません' }, { status: 400 });
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
