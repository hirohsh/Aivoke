import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSchema } from '@/schemas/chatSchemas';
import { MessageInput } from '@/types/chatTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Square } from 'lucide-react';
import { useParams } from 'next/navigation';
import { KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';

interface ChatInputProps {
  onSendMessage: (message: string, conversationId?: string) => void;
  handleCancel?: () => void;
  isPending?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  handleCancel,
  isPending = false,
  placeholder = 'メッセージを入力してください...',
}: ChatInputProps) {
  const params = useParams<{ conversation_id?: string[] }>();

  const form = useForm<MessageInput>({
    resolver: zodResolver(MessageSchema),
    mode: 'onSubmit',
    defaultValues: {
      message: '',
      conversationId: params?.conversation_id?.[0],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
    watch,
  } = form;

  const messageValue = watch('message');

  const onValid = (data: MessageInput) => {
    if (!isPending && !isSubmitting) {
      onSendMessage(data.message.trim(), data.conversationId);
      form.reset({ message: '', conversationId: params?.conversation_id?.[0] });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey && messageValue?.trim()) {
      e.preventDefault();
      if (messageValue?.trim() || !isPending || !isSubmitting) {
        void handleSubmit(onValid)();
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onValid)} className="relative w-full max-w-4xl">
        <FormField
          control={control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormMessage className="py-2 text-center" />
              <FormControl>
                <Textarea
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="scrollbar max-h-[25vh] min-h-[80px] resize-none rounded-md border border-input py-3 pr-12 text-sm"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {!isPending && (
          <Button
            type="submit"
            size="icon"
            className="absolute right-1.5 bottom-1.5 cursor-pointer"
            disabled={!messageValue?.trim() || isPending || isSubmitting}
          >
            <Send />
          </Button>
        )}
        {isPending && (
          <Button
            type="button"
            size="icon"
            className="absolute right-1.5 bottom-1.5 cursor-pointer"
            disabled={!isPending}
            onClick={handleCancel}
          >
            <Square />
          </Button>
        )}
      </form>
    </Form>
  );
}
