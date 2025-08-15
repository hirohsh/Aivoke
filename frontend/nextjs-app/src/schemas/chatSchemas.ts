import { ALL_MODEL_IDS } from '@/lib/constants';
import { ModelId } from '@/types/modelTypes';
import { z } from 'zod';

export const MessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'メッセージを入力してください')
    .max(2000, 'メッセージは2000文字以内で入力してください'),
});

export const AnyModelIdSchema = z.enum(ALL_MODEL_IDS as [ModelId, ...ModelId[]]);
