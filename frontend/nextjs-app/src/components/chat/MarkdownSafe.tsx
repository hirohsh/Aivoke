'use client';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { CopyButton } from './CopyButton';

type SafeNextImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
  src?: string | Blob; // react-markdownからの型ゆれに合わせて受ける
  width?: number | string;
  height?: number | string;
};

const extractText = (node: ReactNode): string => {
  if (node == null || node === false) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return node.props && node.props.children ? extractText(node.props.children) : '';
  }
  return '';
};

// インライン/ブロックを Tailwind で見やすく
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Code = ({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
  const lang = /language-(\w+)/.exec(className || '')?.[1];

  // children からテキストを取り出して改行有無を判定
  const text = Array.isArray(children)
    ? children.map((c) => (typeof c === 'string' ? c : '')).join('')
    : typeof children === 'string'
      ? children
      : '';

  const hasNewline = /\r|\n/.test(text);
  const looksInline = inline || (!hasNewline && !lang); // フォールバック条件

  if (looksInline) {
    return (
      <code
        className={cn(
          'mx-1 rounded-sm bg-zinc-800/40 px-1.5 py-1 text-[0.85em] font-medium dark:bg-zinc-900',
          'text-foreground'
        )}
      >
        {children}
      </code>
    );
  }

  const copyText = extractText(children).replace(/\s+$/, '');

  return (
    <pre
      className={cn('my-2.5 overflow-x-auto rounded-xl border border-zinc-800/60', 'bg-zinc-900 p-3', className)}
      // Safari の長コードで縦潰れ防止
      style={{ lineHeight: 1.6 }}
    >
      <div className="relative contain-inline-size">
        <div className="flex h-7 items-center justify-between text-xs text-zinc-100 select-none">{lang}</div>
        <div className="sticky top-7">
          <div className="absolute end-0 bottom-0 flex h-7 items-center">
            <CopyButton text={copyText} />
          </div>
        </div>
        <div className="overflow-y-auto p-4" dir="ltr">
          <code className={cn('block', lang ? `language-${lang}` : 'text-zinc-100')}>{children}</code>
        </div>
      </div>
    </pre>
  );
};

/** 安全なリンク：スキーム検査 + rel/target 強制 */
const SafeLink = (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const { href = '', children, ...rest } = props;
  const isHttp = /^https?:\/\//i.test(href);
  const isMailto = /^mailto:/i.test(href);

  // 不正なスキームはテキストとして表示
  if (!isHttp && !isMailto) {
    return <span>{children}</span>;
  }
  // 外部リンクとして扱い、タブ乗っ取り対策を強制
  return (
    <Link {...rest} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </Link>
  );
};

/** 画像の安全化：http/https のみ許可し、遅延読込をデフォルト付与 */
const SafeImage = (props: SafeNextImageProps) => {
  const { src, alt = '', width, height } = props;

  // string に限定（Blobなどは弾く）
  const rawSrc = typeof src === 'string' ? src : '';
  const isHttp = /^https?:\/\//i.test(rawSrc);

  if (!isHttp || !rawSrc) {
    return <span>[image blocked]</span>;
  }

  // width/height が文字列で来た場合の数値化
  const w = typeof width === 'string' ? parseInt(width, 10) : width;
  const h = typeof height === 'string' ? parseInt(height, 10) : height;

  // フォールバック（Markdownに寸法が無いケース）
  const fallbackW = Number.isFinite(w) && (w as number) > 0 ? (w as number) : 800;
  const fallbackH = Number.isFinite(h) && (h as number) > 0 ? (h as number) : 0; // 0なら自動スケールに寄せる

  // next/image は width/height どちらも必須なので、
  // 高さ未指定時は 1px を入れて CSS でアスペクト比を自然に（実測的には表示崩れは起きにくい）
  const resolvedW = fallbackW;
  const resolvedH = fallbackH > 0 ? fallbackH : 1;

  return (
    <Image
      // 外部ドメインは next.config.js に許可が必要
      src={rawSrc}
      alt={alt}
      width={resolvedW}
      height={resolvedH}
      // レスポンシブ表示
      sizes="(max-width: 768px) 100vw, 768px"
      style={{ height: 'auto', width: '100%', maxWidth: '100%' }}
      // referrerPolicy は Next 13+ で img に引き継がれます（型定義が古い環境では as any）
      {...{ referrerPolicy: 'no-referrer' }}
    />
  );
};

export function MarkdownSafe({ children }: { children: string }) {
  // rehype-highlight が付与する className を許可する拡張スキーマ
  const schema: unknown = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      a: [
        ...(defaultSchema.attributes?.a || []),
        // rel/target/href を許可（SafeLink 側でさらに検査）
        ['href'],
        ['rel'],
        ['target'],
      ],
      code: [
        ...(defaultSchema.attributes?.code || []),
        ['className'], // e.g. "language-ts"
      ],
      span: [
        ...(defaultSchema.attributes?.span || []),
        ['className'], // ハイライト用の装飾 class
      ],
      pre: [...(defaultSchema.attributes?.pre || []), ['className']],
      img: [...(defaultSchema.attributes?.img || []), ['src'], ['alt'], ['title'], ['width'], ['height'], ['loading']],
    },
    // URL プロトコルを http/https に制限
    protocols: {
      ...defaultSchema.protocols,
      href: ['http', 'https', 'mailto'], // メールリンクを許可したくないなら 'mailto' を外す
      src: ['http', 'https'],
    },
    // 生HTMLの取り込みは禁止（remarkRehypeの allowDangerousHtml=false 相当）
    clobberPrefix: 'user-content',
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeSanitize, schema], rehypeHighlight]}
      // リンクは安全なコンポーネントに差し替え
      components={{
        a: SafeLink,
        img: SafeImage,
        code: Code,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
