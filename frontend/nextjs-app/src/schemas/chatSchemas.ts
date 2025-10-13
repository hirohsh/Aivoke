import { ALL_MODEL_IDS } from '@/lib/constants';
import { ModelId } from '@/types/modelTypes';
import { z } from 'zod';

export const MessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Please enter a message')
    .max(2000, 'Please enter a message within 2000 characters'),
  conversationId: z.string().uuid('Invalid conversation ID').optional(),
  key: z
    .string()
    .trim()
    .min(20, { message: 'API Key (min. 20 characters)' })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message: 'Invalid API key format.',
    })
    .optional(),
});

export const AnyModelIdSchema = z.enum(ALL_MODEL_IDS as [ModelId, ...ModelId[]]);

export const DeleteChatSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation ID'),
});
