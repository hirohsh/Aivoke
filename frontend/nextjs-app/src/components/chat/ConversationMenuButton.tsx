'use client';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { deleteChat } from '@/actions/chatActions';
import { useMutationToast } from '@/hooks/useMutationToast';
import { useRouter } from '@/i18n/routing';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState, useState } from 'react';
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
  const t = useTranslations();
  const [state, chatDeleteAction, isPending] = useActionState(deleteChat, { ok: false });
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const router = useRouter();
  const conversationFormData = new FormData();
  conversationFormData.append('conversationId', conversationId);

  const onSuccess = () => {
    router.refresh();
    if (conversationId === activeConversationId) {
      router.push('/chat');
    }
  };

  useMutationToast({
    state,
    pending: isPending,
    onSuccess,
  });

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
            {t('Chat.Menu.Delete.Button')}
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        onConfirm={chatDeleteAction.bind(null, conversationFormData)}
        title={t('Chat.Menu.Delete.Title')}
        description={t('Chat.Menu.Delete.Description')}
        isOpen={openDelete}
        setOpen={setOpenDelete}
        confirmLabel={t('Common.Delete')}
      />
    </div>
  );
}
