import { IdSchema, SourceId } from '@/lib/endpoints';
import { NextRequest, NextResponse } from 'next/server';
import { geturlOptons } from '../../_services/chatService';

// リクエストタイプの定義
interface ChatRequest {
  message: string;
}

// シンプルなサーバーレスファンクション
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ modelId: string }> }
) {
  try {
    // リクエストのボディを解析
    const body: ChatRequest = await request.json();
    const { modelId } = await params;

    // 必須フィールドの検証
    if (!body.message) {
      return NextResponse.json({ error: 'メッセージは必須です' }, { status: 400 });
    }

    if (!modelId) {
      return NextResponse.json({ error: 'モデルIDは必須です' }, { status: 400 });
    }

    const parsedModelId = IdSchema.safeParse(modelId);
    // モデルIDの検証結果をチェック
    if (!parsedModelId.success) {
      return NextResponse.json({ error: '無効なモデルIDです' }, { status: 400 });
    }
    // モデルIDをSourceId型に変換
    const sourceId = parsedModelId.data satisfies SourceId;
    const urlOptions = geturlOptons(sourceId);

    // URLが有効かどうかをチェック
    if (!urlOptions.hasUrl) {
      return NextResponse.json({ error: '無効なURLです' }, { status: 400 });
    }

    // ここで実際のAIサービスやバックエンドAPIを呼び出すことができます
    // このサンプルでは簡単なエコー応答を返します
    const response = {
      response: `「${body.message}」に対する応答です。これはサーバーレスファンクションからの応答です。`,
      timestamp: new Date().toISOString(),
    };

    // 応答を返す
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: '内部サーバーエラー' }, { status: 500 });
  }
}
