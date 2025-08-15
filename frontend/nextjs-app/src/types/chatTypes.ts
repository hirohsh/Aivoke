import { MessageSchema } from '@/schemas/chatSchemas';
import { z } from 'zod';

export type MessageInput = z.infer<typeof MessageSchema>;

export type MessageType = 'user' | 'assistant';

export type Message = {
  id: string;
  type: MessageType;
  content: string;
  timestamp?: string;
};
