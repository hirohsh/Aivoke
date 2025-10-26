import 'server-only';

const CSRF_COOKIE = 'csrf_secret';
const CSRF_MAX_AGE_SEC = 60 * 60 * 2;

async function makeHmac(secretB64: string, msg: string) {
  const secret = Uint8Array.from(atob(secretB64), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', secret, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}

function b64urlRandom(n = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
}

async function issueCsrfToken(secretB64: string) {
  const ts = Math.floor(Date.now() / 1000);
  const rand = b64urlRandom(16);
  const payload = `${ts}.${rand}`;
  const sig = await makeHmac(secretB64, payload);
  return `${payload}.${sig}`;
}

async function verifyCsrfToken(secretB64: string, token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [tsStr, rand, sig] = parts;
  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - ts) > CSRF_MAX_AGE_SEC) return false;
  const expected = await makeHmac(secretB64, `${tsStr}.${rand}`);
  return expected === sig;
}

async function readIncomingToken(req: Request) {
  const h = req.headers.get('x-csrf-token') ?? req.headers.get('x-xsrf-token');
  if (h) return h;
  const ct = req.headers.get('content-type') ?? '';
  if (ct.includes('multipart/form-data') || ct.includes('application/x-www-form-urlencoded')) {
    const form = await req
      .clone()
      .formData()
      .catch(() => null);
    return form?.get('1_csrfToken')?.toString() ?? null;
  }

  return null;
}

function getCookie(req: Request, name: string) {
  const raw = req.headers.get('cookie') ?? '';
  const m = raw.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function setCookie(res: Response, name: string, value: string, maxAgeSec?: number) {
  const attrs = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
    maxAgeSec ? `Max-Age=${maxAgeSec}` : '',
  ]
    .filter(Boolean)
    .join('; ');
  res.headers.append('Set-Cookie', attrs);
}

export async function handleCsrf(request: Request): Promise<Response | null> {
  const method = request.method.toUpperCase();
  const isSafe = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';

  // 秘密（base64）を HttpOnly cookie で保持（なければ発行）
  let secret = getCookie(request, CSRF_COOKIE);
  const resp = new Response(null, { status: 200 }); // ヘッダ付与用の器
  if (!secret) {
    secret = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
    setCookie(resp, CSRF_COOKIE, secret);
  }

  if (isSafe) {
    // 配布だけ
    const token = await issueCsrfToken(secret!);
    resp.headers.set('X-CSRF-Token', token);
    return resp; // 呼び出し側でヘッダ/Set-Cookieをマージする
  }

  // 変更系は検証
  const incoming = await readIncomingToken(request);
  if (!incoming) return new Response('Missing CSRF token', { status: 403 });
  const ok = await verifyCsrfToken(secret!, incoming);
  if (!ok) return new Response('Invalid CSRF token', { status: 403 });
  // 有効なら 204（ヘッダは不要）を空器として返す
  return new Response(null, { status: 204 });
}
