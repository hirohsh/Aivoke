'use client';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect } from 'react';
import { EllipsisMenuButton } from '../ui/EllipsisMenuButton';
import { LoginButton } from '../ui/LoginButton';

export function AuthToggleButton() {
  const { user, loading, refresh } = useAuth();

  useEffect(() => {
    refresh(); // 認証状態を更新
  }, [refresh]);

  if (loading) return null; // ローディング中は何も表示しない

  // ユーザーがログインしている場合はメニューを表示、そうでない場合はログインボタンを表示
  if (user) return <EllipsisMenuButton />;
  return <LoginButton />;
}
