'use client';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

type CsrfCtx = {
  token: string | null;
  getToken: () => Promise<string>;
  refreshToken: () => Promise<string>;
};

const Ctx = createContext<CsrfCtx | null>(null);

export function CsrfProvider({ initialToken, children }: { initialToken?: string | null; children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(initialToken ?? null);
  const inflight = useRef<Promise<string> | null>(null);

  const fetchToken = useCallback(async () => {
    const res = await fetch('/api/csrf', { credentials: 'include' });
    const t = res.headers.get('X-CSRF-Token') ?? '';
    setToken(t);
    return t;
  }, []);

  const getToken = useCallback(async () => {
    if (token) return token;
    if (!inflight.current) inflight.current = fetchToken().finally(() => (inflight.current = null));
    return inflight.current;
  }, [token, fetchToken]);

  const refreshToken = useCallback(async () => {
    setToken(null);
    return getToken();
  }, [getToken]);

  return <Ctx.Provider value={{ token, getToken, refreshToken }}>{children}</Ctx.Provider>;
}

export function useCsrf() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCsrf must be used within CsrfProvider');
  return ctx;
}
