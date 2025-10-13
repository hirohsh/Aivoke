import { AuthState } from '@/types/authTypes';
import { ChatActionState } from '@/types/chatTypes';
import { SettingActionState } from '@/types/settingTypes';
import { useEffect } from 'react';
import { ExternalToast, toast } from 'sonner';

type MutationState = AuthState | SettingActionState | ChatActionState;

type UseMutationToastParams = {
  /** API の結果状態（ok / message） */
  state: MutationState;
  /** リクエスト中はトースト判定をスキップ */
  pending: boolean;
  /** 成功時に追加で実行する処理（例: router.refresh や setState など） */
  onSuccess?: () => void;
  /** 失敗時に追加で実行する処理 */
  onError?: () => void;
  /** 成否に関わらず最後に実行する処理 */
  onFinally?: () => void;
  /** トースト共通オプション */
  toastOptions?: ExternalToast;
};

export function useMutationToast({
  state,
  pending,
  onSuccess,
  onError,
  onFinally,
  toastOptions = { duration: 3000, position: 'top-center' },
}: UseMutationToastParams) {
  useEffect(() => {
    // 初期レンダリングやメッセージ未設定時、リクエスト中は何もしない
    if (!state?.message) return;
    if (pending) return;

    // 既存のトーストをクリア
    toast.dismiss();

    if (state.ok) {
      toast.success(state.message, toastOptions);
      onSuccess?.();
    } else {
      toast.error(state.message, toastOptions);
      onError?.();
    }

    onFinally?.();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.message, state.ok, pending]);
}
