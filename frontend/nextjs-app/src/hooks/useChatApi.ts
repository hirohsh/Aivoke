'use client';

import { CHAT_ERROR_FALLBACK_MESSAGE } from '@/lib/constants';
import { useModel } from '@/providers/ModelProvider';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export function useChatApi() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const acRef = useRef<AbortController | null>(null);
  const { selectedModel } = useModel();
  const router = useRouter();

  const start = async (
    prompt: string,
    onChunk: (t: string, targetId: string) => void,
    targetId: string,
    conversationId?: string
  ) => {
    if (!selectedModel) return;

    // 既存ストリームがあれば止める
    acRef.current?.abort('new request');
    const ac = new AbortController();
    acRef.current = ac;

    setError(null);
    setIsPending(true);

    try {
      const res = await fetch(`/api/chat/${selectedModel}`, {
        method: 'POST',
        body: JSON.stringify({ message: prompt, conversationId }),
        signal: ac.signal,
      });
      if (!res.ok) {
        setError(CHAT_ERROR_FALLBACK_MESSAGE);
        return;
      }
      if (!res.body) return;

      const redirectTo = res.headers.get('X-Redirect-To');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onChunk(decoder.decode(value), targetId);
      }

      if (redirectTo) router.replace(redirectTo);
      router.refresh();
    } catch (e) {
      // AbortError のときは何もしない
      if (e instanceof DOMException && e.name === 'AbortError') {
        // 中断なので無視
      } else {
        setError(CHAT_ERROR_FALLBACK_MESSAGE);
      }
    } finally {
      acRef.current = null;
      setIsPending(false);
    }
  };

  const stop = () => acRef.current?.abort('user cancelled');

  return {
    isPending,
    error,
    start,
    stop,
  };
}
