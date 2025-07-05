// app/providers/AuthProvider.tsx
'use client';

import { supabaseBrowser } from '@/utils/supabase/browser';
import type { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: false,
  refresh: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
    setUser(data.session?.user ?? null);
    setLoading(false);
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    router.push('/login'); // ログアウト後にログインページへリダイレクト
  }, [supabase, router]);

  useEffect(() => {
    // 初期化
    refresh();
    // ログイン／ログアウト監視
    const { data: listener } = supabase.auth.onAuthStateChange((_evt, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, [refresh, supabase]);

  const value: AuthContextType = {
    session,
    user,
    loading,
    refresh,
    signOut,
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
