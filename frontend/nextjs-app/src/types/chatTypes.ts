import { MessageSchema } from '@/schemas/chatSchemas';
import { z } from 'zod';

export type MessageInput = z.infer<typeof MessageSchema>;

export type MessageType = 'user' | 'assistant' | 'system' | 'tool';

export type Message = {
  id: string;
  type: MessageType;
  content: string;
  timestamp?: string;
};

export type MessageRow = {
  id: string;
  conversation_id: string;
  role: MessageType;
  content: unknown;
  model: string;
  reply_to: string;
  created_at: string;
  updated_at: string;
};
