import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { handleCsrf } from './utils/csrf';
import { updateSession } from './utils/supabase/middleware';

const intl = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV !== 'production';
  const { pathname } = request.nextUrl;
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

  // CSRF
  const csrfRes = await handleCsrf(request);
  if (csrfRes?.status === 403) {
    // 403 は即返す
    const denied = new NextResponse('Forbidden', { status: 403 });

    // csrfRes のヘッダをマージ（Set-Cookie は複数あるので append）
    for (const [key, value] of csrfRes.headers.entries()) {
      if (key.toLowerCase() === 'set-cookie') {
        denied.headers.append('set-cookie', value);
      } else {
        denied.headers.set(key, value);
      }
    }

    denied.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

    return denied;
  }

  const reqHeaders = new Headers(request.headers);

  if (!pathname.startsWith('/api/')) {
    const intlRes = intl(request) as NextResponse;

    if (intlRes.headers.has('location')) {
      intlRes.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
      return intlRes;
    }

    for (const [key, value] of intlRes.headers.entries()) {
      if (key.toLowerCase().startsWith('x-')) {
        reqHeaders.set(key, value);
      }
    }
  }

  const supaRes = await updateSession(request);

  if (supaRes?.headers.has('location')) {
    supaRes.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);
    return supaRes;
  }

  reqHeaders.set('x-nonce', nonce);

  const res = NextResponse.next({ request: { headers: reqHeaders } });

  if (csrfRes) {
    for (const [k, v] of csrfRes.headers.entries()) if (k.toLowerCase() !== 'set-cookie') res.headers.set(k, v);
    const setCookies = csrfRes.headers.get('set-cookie');
    if (setCookies) res.headers.append('set-cookie', setCookies);
  }

  supaRes.cookies
    .getAll()
    .forEach((c) =>
      res.cookies.set(c.name, c.value, { ...c, secure: process.env.NODE_ENV === 'production', httpOnly: true })
    );

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
