import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './utils/supabase/middleware';
export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== 'production';
  // nonce を生成
  const bytes = crypto.getRandomValues(new Uint8Array(16)); // Web Crypto
  const nonce = Buffer.from(bytes).toString('base64url');

  const csp = [
    "default-src 'self'",
    `script-src 'self' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : `'nonce-${nonce}' 'strict-dynamic'`}`,
    `style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    `style-src-attr 'self' 'unsafe-inline'`,
    `style-src-elem 'self' 'unsafe-inline'`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    `form-action 'self'`,
    `connect-src 'self' https://*.supabase.co ${isDev ? 'http://host.docker.internal:54321' : ''}`,
  ].join('; ');

  const contentSecurityPolicyHeaderValue = csp.replace(/\s{2,}/g, ' ').trim();

  const supaRes = await updateSession(request);

  if (supaRes?.headers.has('location')) {
    supaRes.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
    return supaRes;
  }

  const reqHeaders = new Headers(request.headers);
  reqHeaders.set('x-nonce', nonce);

  const res = NextResponse.next({ request: { headers: reqHeaders } });

  supaRes.cookies.getAll().forEach((c) => res.cookies.set(c.name, c.value, c));

  res.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  return res;
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    {
      source: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
