'use client';
import { useAuth } from '@/providers/AuthProvider';
import { EllipsisMenuButton } from './EllipsisMenuButton';
import { LoginButton } from './LoginButton';

export function AuthToggleButton() {
  const { user } = useAuth();

  // ユーザーがログインしている場合はメニューを表示、そうでない場合はログインボタンを表示
  if (user) return <EllipsisMenuButton />;
  return <LoginButton />;
}
