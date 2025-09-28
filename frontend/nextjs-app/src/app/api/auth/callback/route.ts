import { createAnonClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type'); // "recovery" など
  const next = url.searchParams.get('next') ?? '/';

  console.log('type', type);

  const supabase = await createAnonClient();

  if (code) {
    // 新しめのコードパラメータ方式
    await supabase.auth.exchangeCodeForSession(code);
  } else if (type === 'recovery' && token_hash) {
    // token_hash 方式
    await supabase.auth.verifyOtp({ type: 'recovery', token_hash });
  }

  revalidatePath(next, 'layout');

  return NextResponse.redirect(new URL(next, url.origin));
}
