import { ChatContainer } from '@/components/chat/ChatContainer';

export default function ChatPage() {
  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full flex-col gap-4 3xl:h-lvh">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border-none">
        <ChatContainer />
      </div>
    </div>
  );
}
