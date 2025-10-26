import { ALL_MODEL_IDS } from '@/lib/constants';
import { ModelId } from '@/types/modelTypes';
import { z } from 'zod';

export const MessageSchema = z.object({
  message: z.string().trim().min(1, 'Chat.Validation.MessageRequired').max(2000, 'Chat.Validation.MessageMax'),
  conversationId: z.string().uuid('Chat.Validation.InvalidConversationId').optional(),
  key: z
    .string()
    .trim()
    .min(20, { message: 'Settings.ApiKey.Validation.MinLength' })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message: 'Settings.ApiKey.Validation.InvalidFormat',
    })
    .optional(),
});

export const AnyModelIdSchema = z.enum(ALL_MODEL_IDS as [ModelId, ...ModelId[]]);

export const DeleteChatSchema = z.object({
  conversationId: z.string().uuid('Chat.Validation.InvalidConversationId'),
  csrfToken: z.string(),
});
