// app/providers/AuthProvider.tsx
'use client';

import { logout } from '@/actions/authActions';
import { AuthState } from '@/types/authTypes';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useActionState, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  logoutState: AuthState;
  logoutAction: () => void;
  isLogoutPending: boolean;
  isEmailProvider: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  logoutState: { ok: false },
  logoutAction: () => {},
  isLogoutPending: false,
  isEmailProvider: false,
});

export function AuthProvider({ children, userData }: { children: ReactNode; userData: User | null }) {
  const [logoutState, logoutAction, isLogoutPending] = useActionState<AuthState>(logout, { ok: false });

  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  useEffect(() => {
    if (!logoutState.message) return; // 初期レンダリング時は無視
    if (isLogoutPending) return; // リクエスト中は無視
    toast.dismiss(); // 既存のトーストをクリア

    if (logoutState.ok) {
      toast.success(logoutState.message, {
        duration: 6000,
        position: 'top-center',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      });
      router.push('/auth/login'); // ログアウト後にログインページへリダイレクト
    } else {
      toast.error(logoutState.message, {
        duration: 6000,
        position: 'top-center',
        action: {
          label: 'Close',
          onClick: () => {},
        },
      });
    }
  }, [logoutState.ok, logoutState.message, isLogoutPending, router]);

  const isEmailProvider = user?.app_metadata?.providers?.includes('email') ?? false;

  const value: AuthContextType = {
    user,
    logoutState,
    logoutAction,
    isLogoutPending,
    isEmailProvider,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  return ctx;
};
