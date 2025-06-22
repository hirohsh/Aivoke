'use client';

import { useState } from 'react';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ChatApiResponse {
  message: ChatMessage;
}

export function useChatApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string): Promise<ChatApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // サーバーレスファンクションのエンドポイントURL
      const apiUrl = '/api/chat';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        message: {
          id: Date.now().toString(),
          type: 'assistant',
          content: data.response || '応答がありませんでした',
          timestamp: new Date().toISOString(),
        },
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
      setError(errorMessage);

      return {
        message: {
          id: Date.now().toString(),
          type: 'assistant',
          content: 'メッセージの送信中にエラーが発生しました。後でもう一度お試しください。',
          timestamp: new Date().toISOString(),
        },
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    error,
  };
}
