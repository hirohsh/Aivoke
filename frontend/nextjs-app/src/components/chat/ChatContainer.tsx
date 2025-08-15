'use client';
import { useChatApi } from '@/hooks/useChatApi';
import { Message, MessageType } from '@/types/chatTypes';
import { useEffect, useRef, useState } from 'react';
import { v7 } from 'uuid';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';

interface ChatContainerProps {
  initialMessages?: Message[];
}

export function ChatContainer({ initialMessages = [] }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isPending, error, start } = useChatApi();

  // スクロールを一番下に移動する関数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSetMessage = (input: string, type: MessageType, id?: string) => {
    const newMessage: Message = {
      id: id || v7(),
      type,
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleOnChunk = (chunk: string, targetId: string) => {
    setMessages((ms) => ms.map((m) => (m.id === targetId ? { ...m, content: m.content + chunk } : m)));
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 新しいユーザーメッセージを追加
    handleSetMessage(content, 'user');

    const assistantId = v7();
    handleSetMessage('', 'assistant', assistantId);

    await start(content, handleOnChunk, assistantId);
  };

  // メッセージが追加されたら自動的に下にスクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      handleSetMessage(error, 'assistant');
    }
  }, [error]);

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 ? (
        // メッセージがない場合、テキストとChatInputを中央に表示
        <div className="flex h-full flex-col items-center justify-center p-4">
          <p className="mb-4 text-center text-lg text-foreground">メッセージはまだありません。会話を始めましょう！</p>
          <div className="flex w-full justify-center p-4">
            <ChatInput onSendMessage={handleSendMessage} isPending={isPending} placeholder="メッセージを入力..." />
          </div>
        </div>
      ) : (
        // メッセージがある場合の通常レイアウト
        <>
          <div className="scrollbar flex flex-1 flex-col items-center overflow-y-auto p-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                type={message.type}
                message={message.content}
                timestamp={message.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex w-full justify-center p-4">
            <ChatInput onSendMessage={handleSendMessage} isPending={isPending} placeholder="メッセージを入力..." />
          </div>
        </>
      )}
    </div>
  );
}
