import { FALLBACK_MESSAGE } from '@/lib/constants';
import { getUser } from '@/lib/server/auth';
import { getConversationMessages } from '@/lib/server/conversations';
import { AnyModelIdSchema, MessageSchema } from '@/schemas/chatSchemas';
import { Message, MessageInput } from '@/types/chatTypes';
import { ModelId } from '@/types/modelTypes';
import { ApiKeyType } from '@/types/settingTypes';
import { createAdminClient, createAnonClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { concatUint8, executeChat, truncateText } from '../../_services/chatService';

export const runtime = 'edge';

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
    let key: string;
    if (parsedMessage.data.key) {
      key = parsedMessage.data.key;
    } else {
      const { data: apiKey, error: apiKeyError } = await supabaseAdmin.rpc('get_api_key_secret', {
        p_user_id: user.id,
      });
      if (apiKeyError || !apiKey) {
        return NextResponse.json({ error: 'API key not found' }, { status: 400 });
      }
      key = apiKey;
    }

    // チャットを保存する
    let convId: string = '';
    if (parsedMessage.data.conversationId) {
      const { error: saveError } = await supabaseAdmin.rpc('rpc_create_message', {
        p_user_id: user.id,
        p_conversation_id: parsedMessage.data.conversationId,
        p_role: 'user',
        p_content: parsedMessage.data.message,
      });
      if (saveError) {
        return NextResponse.json({ error: 'Failed to save chat message' }, { status: 400 });
      }
    } else {
      const { data: conversationId, error: saveConversationError } = await supabaseAdmin.rpc(
        'rpc_create_conversation',
        {
          p_user_id: user.id,
          p_title: truncateText(parsedMessage.data.message),
          p_model: parsedModelId.data,
        }
      );
      if (saveConversationError || !conversationId) {
        return NextResponse.json({ error: 'Failed to save chat message' }, { status: 400 });
      }
      const { error: saveError } = await supabaseAdmin.rpc('rpc_create_message', {
        p_user_id: user.id,
        p_conversation_id: conversationId,
        p_role: 'user',
        p_content: parsedMessage.data.message,
      });
      if (saveError) {
        return NextResponse.json({ error: 'Failed to save chat message' }, { status: 400 });
      }
      convId = conversationId;
    }

    // メッセージ履歴を取得
    const messages: Message[] = await getConversationMessages(
      supabaseAdmin,
      user.id,
      parsedMessage.data.conversationId ?? convId
    );
    if (!messages) {
      return NextResponse.json({ error: 'Failed to fetch message history' }, { status: 400 });
    }

    // 生成AI呼び出し
    const upstream = await executeChat(providerName as ApiKeyType, parsedModelId.data, key, messages, request.signal);

    const reader = upstream.getReader();
    const chunks: Uint8Array[] = [];
    const decoder = new TextDecoder();

    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        const { value, done } = await reader.read();
        try {
          if (done) {
            // ここでまとめて保存（レスポンスのクローズ直前）
            const fullText = decoder.decode(concatUint8(chunks));
            try {
              await supabaseAdmin.rpc('rpc_create_message', {
                p_user_id: user.id,
                p_conversation_id: parsedMessage.data.conversationId ?? convId,
                p_role: 'assistant',
                p_content: fullText,
              });
              try {
                revalidatePath('/', 'layout');
              } catch {}
            } finally {
              controller.close();
            }
            return;
          }
          if (value) {
            chunks.push(value); // DB用にためる
            controller.enqueue(value); // クライアントへ流す
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          controller.error(new Error('Generation failed'));
        }
      },
      cancel(reason) {
        reader.cancel(reason);
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Redirect-To': convId ? `/chat/${convId}` : '',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: FALLBACK_MESSAGE }, { status: 500 });
  }
}
