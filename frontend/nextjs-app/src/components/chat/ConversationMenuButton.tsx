'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { deleteChat } from '@/actions/chatActions';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface ConversationMenuButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  conversationId: string;
  activeConversationId?: string;
}

export function ConversationMenuButton({
  className,
  conversationId,
  activeConversationId,
}: ConversationMenuButtonProps) {
  const [state, chatDeleteAction, isPending] = useActionState(deleteChat, { ok: false });
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();
  const conversationFormData = new FormData();
  conversationFormData.append('conversationId', conversationId);

  useEffect(() => {
    if (!state.message) return; // 初期レンダリング時は無視
    if (isPending) return; // リクエスト中は無視
    toast.dismiss(); // 既存のトーストをクリア

    if (state.ok) {
      toast.success(state.message, {
        duration: 3000,
        position: 'top-center',
      });
      router.refresh();
      if (conversationId === activeConversationId) {
        router.push('/chat');
      }
    } else {
      toast.error(state.message, {
        duration: 3000,
        position: 'top-center',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, state.message, state.ok, router]);

  return (
    <div className={className}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="noBg" size="sm" className={cn('cursor-pointer', open && 'text-foreground')}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <Button
            variant="outlineDangerous"
            className="w-full justify-start"
            onClick={() => setOpenDelete(true)}
            disabled={isPending}
          >
            <Trash2 />
            Delete Chat
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        onConfirm={chatDeleteAction.bind(null, conversationFormData)}
        title="Delete Chat"
        description="Are you sure you want to delete this chat?"
        isOpen={openDelete}
        setOpen={setOpenDelete}
        confirmLabel="Delete"
      />
    </div>
  );
}
