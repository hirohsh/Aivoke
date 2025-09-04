import { API_PROVIDERS, MODEL_DEFINITIONS_BY_API_PROVIDER } from '@/lib/constants';
import { ModelId } from '@/types/modelTypes';
import { ApiKeyType } from '@/types/settingTypes';
import { chatCompletionStream } from '@huggingface/inference';
import 'server-only';

const getLlmModelId = (providerName: ApiKeyType, modelId: ModelId): string => {
  const modelDefinitions = MODEL_DEFINITIONS_BY_API_PROVIDER[providerName];
  return modelDefinitions[modelId]?.modelId ?? '';
};

const invokeHuggingFaceTextStream = (llmModelId: string, apiKey: string, prompt: string, signal?: AbortSignal) => {
  const encoder = new TextEncoder();

  // 上流停止用のコントローラ（req.signal も連動）
  const upstream = new AbortController();
  if (signal) {
    if (signal.aborted) upstream.abort(signal.reason);
    else signal.addEventListener('abort', () => upstream.abort(signal.reason), { once: true });
  }

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const events = chatCompletionStream(
          {
            accessToken: apiKey,
            model: llmModelId,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1024,
            temperature: 0.7,
          },
          { signal: upstream.signal }
        );

        for await (const ev of events) {
          const chunk = ev.choices?.[0]?.delta?.content ?? '';
          if (chunk) controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        console.error(err);
        controller.error(new Error('Generation failed'));
      } finally {
        controller.close();
      }
    },
    cancel() {
      /* no-op: 呼び出し側の AbortController に任せる */
      upstream.abort('client disconnected');
    },
  });
};

export const executeChat = (
  providerName: ApiKeyType,
  modelId: ModelId,
  apiKey: string,
  prompt: string,
  signal?: AbortSignal
) => {
  const llmModelId = getLlmModelId(providerName, modelId);

  switch (providerName) {
    case API_PROVIDERS.HUGGING_FACE.value:
      // Hugging Face APIを呼び出す
      return invokeHuggingFaceTextStream(llmModelId, apiKey, prompt, signal);
    default:
      throw new Error('Unsupported provider');
  }
};

export const concatUint8 = (arrays: Uint8Array[]) => {
  const len = arrays.reduce((n, a) => n + a.length, 0);
  const out = new Uint8Array(len);
  let off = 0;
  for (const a of arrays) {
    out.set(a, off);
    off += a.length;
  }
  return out;
};

export const truncateText = (text: string, maxLength: number = 10): string => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};
