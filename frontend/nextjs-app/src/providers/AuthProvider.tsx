// app/providers/AuthProvider.tsx
'use client';

import { logout } from '@/actions/authActions';
import { useMutationToast } from '@/hooks/useMutationToast';
import { AuthState } from '@/types/authTypes';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useActionState, useContext, useEffect, useState } from 'react';

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

  const onSuccess = () => {
    router.push('/auth/login');
  };

  useMutationToast({
    state: logoutState,
    pending: isLogoutPending,
    onSuccess,
    toastOptions: {
      duration: 6000,
      position: 'top-center',
      action: {
        label: 'Close',
        onClick: () => {},
      },
    },
  });

  useEffect(() => {
    setUser(userData);
  }, [userData]);

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
