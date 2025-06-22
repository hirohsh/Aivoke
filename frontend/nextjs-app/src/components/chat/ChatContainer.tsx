'use client';
import { useChatApi } from '@/hooks/useChatApi';
import { useEffect, useRef, useState } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage, MessageType } from './ChatMessage';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp?: string;
}

interface ChatContainerProps {
  initialMessages?: Message[];
}

export function ChatContainer({ initialMessages = [] }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isLoading, error } = useChatApi();

  // スクロールを一番下に移動する関数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // メッセージが追加されたら自動的に下にスクロール
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // エラーが発生した場合にコンソールに記録
  useEffect(() => {
    if (error) {
      console.error('Chat API error:', error);
    }
  }, [error]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 新しいユーザーメッセージを追加
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // サーバーレスファンクションにリクエストを送信
      const response = await sendMessage(content);

      // APIからの応答メッセージを追加
      const botResponse: Message = {
        id: response.message.id,
        type: response.message.type,
        content: response.message.content,
        timestamp: response.message.timestamp,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 ? (
        // メッセージがない場合、テキストとChatInputを中央に表示
        <div className="flex h-full flex-col items-center justify-center p-4">
          <p className="mb-4 text-center text-lg text-foreground">
            メッセージはまだありません。会話を始めましょう！
          </p>
          <div className="flex w-full justify-center p-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="メッセージを入力..."
            />
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
            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="メッセージを入力..."
            />
          </div>
        </>
      )}
    </div>
  );
}
