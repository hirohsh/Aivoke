import { cn } from '@/lib/utils';
import { MessageType } from '@/types/chatTypes';
import { MarkdownSafe } from './MarkdownSafe';

interface ChatMessageProps {
  type: MessageType;
  message: string;
  timestamp?: string;
}

export function ChatMessage({ type, message }: ChatMessageProps) {
  const isUser = type === 'user';

  return (
    <div className={cn('flex w-full max-w-4xl items-start gap-4 py-4', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-3xl border border-none p-3 text-sm shadow-none',
          isUser ? 'bg-dark-gray-bright' : 'bg-transparent'
        )}
      >
        <div className="prose prose-sm dark:prose-invert">
          <MarkdownSafe>{message}</MarkdownSafe>
        </div>
      </div>
    </div>
  );
}
