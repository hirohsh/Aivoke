import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { parseLocale } from '@/lib/server/Locale';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, { ...options, secure: true, httpOnly: true });
        });
      },
    },
  });
  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nextUrl = request.nextUrl;
  const { locale, pathNoLocale } = parseLocale(nextUrl.pathname);

  const isPublic =
    pathNoLocale === '/' ||
    pathNoLocale.startsWith('/auth') || // /auth, /auth/login など
    pathNoLocale.startsWith('/api/auth'); // 認証系APIなど

  if (!user && !isPublic) {
    // no user, potentially respond by redirecting the user to the login page
    const url = nextUrl.clone();
    url.searchParams.delete('model');
    url.pathname = `/${locale}/auth/login`;

    const response = NextResponse.redirect(url);

    // 明示的にクッキー削除
    const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0].replace(/https?:\/\//, '');
    response.cookies.set(`sb-${projectRef}-auth-token`, '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0,
      sameSite: 'lax',
    });

    return response;
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
