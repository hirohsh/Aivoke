import { API_PROVIDERS } from '@/lib/constants';
import { enumFromConst } from '@/lib/utils';
import { Constants } from '@/types/database.types';
import { ApiKeyType } from '@/types/settingTypes';
import { z } from 'zod';

// APIキー用スキーマ定義
export const apiKeySchema = z.object({
  type: z.enum(Object.values(API_PROVIDERS).map((v) => v.id) as [string, ...string[]]),
  key: z
    .string()
    .trim()
    .min(20, { message: 'Settings.ApiKey.Validation.MinLength' })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message: 'Settings.ApiKey.Validation.InvalidFormat',
    }),
  csrfToken: z.string(),
});

// APIキーローカル保存用スキーマ定義
export const apiKeyLocalSchema = z.object({
  type: z.enum(Object.values(API_PROVIDERS).map((v) => v.id) as [string, ...string[]]),
  csrfToken: z.string(),
});

// 設定取得RPC用スキーマ定義
export const userSettingsRpcSchema = z.object({
  provider_name: z
    .optional(z.enum(Object.values(API_PROVIDERS).map((v) => v.value) as [ApiKeyType, ...ApiKeyType[]]))
    .nullable(),
  storage: enumFromConst(Constants.public.Enums.storage_type).nullable().optional(),
});
