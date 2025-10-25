'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';

type Props = {
  /** クリック時に実行する処理 */
  onConfirm: (payload?: FormData) => void;
  /** ダイアログ見出し（既定: '確認'） */
  title?: string;
  /** 本文（既定: 'この操作を実行しますか？'） */
  description?: string;
  /** 確定ボタンのラベル（既定: 'OK'） */
  confirmLabel?: string;
  /** キャンセルボタンのラベル（既定: 'キャンセル'） */
  cancelLabel?: string;
  /** 確定ボタン variant */
  confirmVariant?: 'default' | 'destructive' | 'secondary' | 'outline';
  /** トリガー変数 */
  isOpen: boolean;
  /** トリガー変数を更新する関数 */
  setOpen: (open: boolean) => void;
};

export function ConfirmDialog({
  onConfirm,
  isOpen,
  setOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmVariant = 'default',
}: Props) {
  const t = useTranslations();
  const resolvedTitle = title ?? t('Common.ConfirmTitle');
  const resolvedDescription = description ?? t('Common.ConfirmDescription');
  const resolvedConfirm = confirmLabel ?? t('Common.OK');
  const resolvedCancel = cancelLabel ?? t('Common.Cancel');
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{resolvedTitle}</DialogTitle>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            {resolvedCancel}
          </Button>
          <form action={onConfirm} onSubmit={() => setOpen(false)}>
            <Button variant={confirmVariant} className="w-full cursor-pointer" type="submit">
              {resolvedConfirm}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
