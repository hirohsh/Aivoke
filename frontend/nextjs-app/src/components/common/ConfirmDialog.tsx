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
import { startTransition } from 'react';

type Props = {
  /** クリック時に実行する処理 */
  onConfirm: () => void | Promise<void>;
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
  title = '確認',
  description = 'この操作を実行しますか？',
  confirmLabel = 'OK',
  cancelLabel = 'キャンセル',
  confirmVariant = 'default',
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            className="cursor-pointer"
            onClick={() => {
              startTransition(onConfirm);
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
