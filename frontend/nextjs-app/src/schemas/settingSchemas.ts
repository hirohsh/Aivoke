import { API_KEY_TYPES, ApiKeyType } from '@/types/settingTypes';
import { z } from 'zod';

// APIキー用スキーマ定義
export const apiKeySchema = z.object({
  type: z.enum(Object.values(API_KEY_TYPES).map((v) => v.id) as [string, ...string[]]),
  key: z
    .string()
    .trim()
    .min(20, { message: 'API Key (min. 20 characters)' })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message: 'Invalid API key format.',
    }),
});

export type ApiKeyFormValues = z.infer<typeof apiKeySchema>;

// 設定取得RPC用スキーマ定義
export const userSettingsRpcSchema = z.object({
  provider_name: z
    .optional(z.enum(Object.values(API_KEY_TYPES).map((v) => v.value) as [ApiKeyType, ...ApiKeyType[]]))
    .nullable(),
});

export type UserSettingsRpcValues = z.infer<typeof userSettingsRpcSchema>;
