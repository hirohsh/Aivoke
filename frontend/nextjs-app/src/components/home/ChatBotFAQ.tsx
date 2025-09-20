'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Check, ChevronLeft, ChevronRight, Copy, RotateCcw, Sparkles, UserRound } from 'lucide-react';
import React, { useMemo, useState } from 'react';

// ----------------------
// Minimal, elegant, selection-only Chatbot FAQ
// - Next.js 15 compatible client component
// - Uses shadcn/ui + Tailwind + framer-motion
// - No text input; users select from choices
// - Mobile: footer shows category/question chips (input-like)
// - Desktop: selectionはサイドバーのみ（フッターは非表示）
// ----------------------

type Role = 'bot' | 'user';

type Message = {
  id: string;
  role: Role;
  content: React.ReactNode;
};

type QA = { question: string; answer: React.ReactNode };

const FAQ_DATA: Record<string, QA[]> = {
  アカウント: [
    {
      question: 'アカウントを作成するには？',
      answer: (
        <div className="space-y-2">
          <p>
            ホーム画面右上の <span className="font-medium">Sign up</span>{' '}
            から、メールアドレスとパスワードを登録してください。確認メール内のリンクをクリックすると有効化されます。
          </p>
          <ul className="list-disc pl-5 text-sm opacity-90">
            <li>Google / GitHub でもサインイン可能</li>
            <li>パスワードは 8 文字以上、記号の利用を推奨</li>
          </ul>
        </div>
      ),
    },
    {
      question: 'パスワードをリセットしたい',
      answer: (
        <div className="space-y-2">
          <p>
            ログイン画面の <span className="font-medium">Forgot password</span>{' '}
            からメールを送信し、届いたリンクから新しいパスワードを設定します。
          </p>
          <p className="text-sm opacity-90">
            メールが届かない場合：迷惑メール、会社のセキュリティ設定をご確認ください。
          </p>
        </div>
      ),
    },
    {
      question: 'メールアドレスを変更したい',
      answer: (
        <div className="space-y-2">
          <p>
            プロフィールの <span className="font-medium">アカウント設定</span>{' '}
            から変更できます。変更後は新しいメール宛に確認リンクが届きます。
          </p>
        </div>
      ),
    },
  ],
  '料金・請求': [
    {
      question: '料金プランについて知りたい',
      answer: (
        <div className="space-y-3">
          <p>無料プラン / Pro プラン / Business プランをご用意しています。</p>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-2xl border bg-muted/40 p-3">
              <div className="font-semibold">Free</div>
              <ul className="mt-1 list-disc pl-5 opacity-90">
                <li>基本機能</li>
                <li>制限付きの月間実行回数</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-muted/40 p-3">
              <div className="font-semibold">Pro</div>
              <ul className="mt-1 list-disc pl-5 opacity-90">
                <li>優先実行</li>
                <li>拡張コンテキスト</li>
              </ul>
            </div>
            <div className="rounded-2xl border bg-muted/40 p-3">
              <div className="font-semibold">Business</div>
              <ul className="mt-1 list-disc pl-5 opacity-90">
                <li>チーム管理</li>
                <li>SAML SSO / 監査ログ</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      question: '請求書のダウンロード方法',
      answer: (
        <div className="space-y-2">
          <p>
            ワークスペースの <span className="font-medium">設定 → 請求</span> から、対象月の請求書を PDF
            でダウンロードできます。
          </p>
        </div>
      ),
    },
  ],
  セキュリティ: [
    {
      question: 'データはどのように扱われますか？',
      answer: (
        <div className="space-y-2">
          <p>会話ログは暗号化して保存され、モデル学習には使用しません。IP 制限やアクセスログも提供しています。</p>
          <ul className="list-disc pl-5 text-sm opacity-90">
            <li>保存データはリージョン内で管理</li>
            <li>退会時にエクスポート / 消去が可能</li>
          </ul>
        </div>
      ),
    },
    {
      question: 'API キーは安全ですか？',
      answer: (
        <div className="space-y-2">
          <p>API キーは保管庫に安全に保存され、表示はマスクされます。必要に応じてローテーションできます。</p>
        </div>
      ),
    },
  ],
  トラブルシューティング: [
    {
      question: '応答が遅い / タイムアウトする',
      answer: (
        <div className="space-y-2">
          <p>混雑時間帯の可能性があります。以下をお試しください。</p>
          <ul className="list-disc pl-5 text-sm opacity-90">
            <li>少し時間をおいて再実行</li>
            <li>会話のコンテキストを短くする</li>
            <li>別プロバイダーへ切替</li>
          </ul>
        </div>
      ),
    },
    {
      question: 'ブラウザでエラーが出る',
      answer: (
        <div className="space-y-2">
          <p>
            キャッシュ削除やシークレットウィンドウでの再試行をお試しください。開発者ツールのコンソールログも参考になります。
          </p>
        </div>
      ),
    },
  ],
  開発者向け: [
    {
      question: 'プロバイダーを切り替えるには？',
      answer: (
        <div className="space-y-2">
          <p>
            チャットごとに <span className="font-medium">プロバイダー</span>{' '}
            を選択できます。同一スレッドでの切替にも対応しています。
          </p>
        </div>
      ),
    },
    {
      question: '個人の API キーを使えますか？',
      answer: (
        <div className="space-y-2">
          <p>
            はい。ユーザー設定からご自身の API
            キーを登録してください。キーはクライアント側では保存せず、サーバー側で安全に保管します。
          </p>
        </div>
      ),
    },
  ],
};

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function MessageBubble({ role, children }: { role: Role; children: React.ReactNode }) {
  const isBot = role === 'bot';
  return (
    <div className={cx('flex w-full items-start gap-3', isBot ? '' : 'justify-end')}>
      {isBot && (
        <div className="mt-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 p-2 text-white shadow-md">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={cx(
          'max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm',
          isBot ? 'border border-border bg-muted/70' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'
        )}
      >
        {children}
      </div>
      {!isBot && (
        <div className="mt-1 rounded-full bg-muted/80 p-2 text-foreground shadow-md">
          <UserRound className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

function TypingDot() {
  return (
    <motion.span
      className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/70"
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
  );
}

export default function ChatbotFAQ() {
  const categories = useMemo(() => Object.keys(FAQ_DATA), []);
  const [step, setStep] = useState<'category' | 'question' | 'answer'>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQA, setSelectedQA] = useState<QA | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'hello',
      role: 'bot',
      content: (
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>こんにちは！知りたい内容のカテゴリを選んでください。</span>
        </div>
      ),
    },
  ]);
  const [copyOK, setCopyOK] = useState(false);

  function resetAll() {
    setStep('category');
    setSelectedCategory(null);
    setSelectedQA(null);
    setMessages([
      {
        id: 'hello',
        role: 'bot',
        content: (
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>リセットしました。カテゴリを選んでください。</span>
          </div>
        ),
      },
    ]);
  }

  function pickCategory(cat: string) {
    setSelectedCategory(cat);
    setStep('question');
    setMessages((prev) => [
      ...prev,
      { id: `cat-user-${cat}`, role: 'user', content: <span>カテゴリ: {cat}</span> },
      {
        id: `cat-bot-${cat}`,
        role: 'bot',
        content: (
          <div>
            <div className="font-medium">{cat} に関する質問です。選んでください。</div>
            <div className="mt-1 text-xs opacity-70">（選択式・複数ページなし / すぐに回答が表示されます）</div>
          </div>
        ),
      },
    ]);
  }

  function pickQuestion(qa: QA) {
    setSelectedQA(qa);
    setStep('answer');
    setMessages((prev) => [
      ...prev,
      { id: `q-user-${qa.question}`, role: 'user', content: qa.question },
      { id: `q-bot-${qa.question}`, role: 'bot', content: qa.answer },
    ]);
  }

  async function copyAnswer() {
    if (!selectedQA) return;
    try {
      const temp = document.createElement('div');
      const container = document.createElement('div');
      container.innerText =
        `${selectedQA.question}

` + (typeof selectedQA.answer === 'string' ? selectedQA.answer : '回答をコピーしました。');
      temp.appendChild(container);
      const text = container.innerText;
      await navigator.clipboard.writeText(text);
      setCopyOK(true);
      setTimeout(() => setCopyOK(false), 1500);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="overflow-hidden border-0 shadow-xl ring-1 ring-black/5 dark:ring-white/5">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Sidebar (desktop only) */}
            <div className="hidden space-y-3 border-r p-4 md:col-span-4 md:block">
              <div className="text-xs tracking-wider text-muted-foreground uppercase">カテゴリ</div>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Button
                    key={c}
                    variant={selectedCategory === c ? 'default' : 'secondary'}
                    className={cx('rounded-full', selectedCategory === c ? '' : 'bg-muted')}
                    onClick={() => pickCategory(c)}
                  >
                    {c}
                  </Button>
                ))}
              </div>

              {step === 'question' && selectedCategory && (
                <div className="mt-4">
                  <div className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">
                    {selectedCategory}の質問
                  </div>
                  <div className="flex flex-col gap-2">
                    {FAQ_DATA[selectedCategory].map((qa) => (
                      <Button
                        key={qa.question}
                        variant="outline"
                        className="justify-between"
                        onClick={() => pickQuestion(qa)}
                      >
                        <span className="truncate text-left">{qa.question}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button variant="ghost" size="sm" onClick={resetAll} className="gap-2">
                  <RotateCcw className="h-4 w-4" /> 最初から
                </Button>
              </div>
            </div>

            {/* Chat area */}
            <div className="min-w-0 p-4 md:col-span-8">
              {/* prevent overflow from grid child */}
              <div className="flex h-[70vh] min-h-0 flex-col overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-sm md:h-[520px]">
                {/* flex container with min-h-0 to allow shrinking */}
                {/* messages */}
                <div className="min-h-0 min-w-0 flex-1">
                  <div className="scrollbar h-full overflow-y-auto p-4">
                    <div className="flex flex-col gap-4 pb-16">
                      {/* reserve space for footer height */}
                      {messages.map((m) => (
                        <AnimatePresence key={m.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                          >
                            <MessageBubble role={m.role}>{m.content}</MessageBubble>
                          </motion.div>
                        </AnimatePresence>
                      ))}
                      {step !== 'answer' && (
                        <div className="flex items-center gap-1 pl-9 text-muted-foreground/80">
                          <TypingDot />
                          <TypingDot />
                          <TypingDot />
                        </div>
                      )}
                    </div>

                    {/* sticky footer inside scroll area so it never escapes */}
                    <div className="sticky right-0 bottom-0 left-0 bg-gradient-to-t from-background/95 to-background/40 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
                      <div className="overflow-hidden rounded-2xl border bg-background/70 px-2 py-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="shrink-0 rounded-full bg-muted/80 p-2">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain">
                            <div className="inline-flex items-center gap-2 whitespace-nowrap">
                              {step === 'question' && selectedCategory ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 shrink-0"
                                    onClick={() => setStep('category')}
                                  >
                                    ← {selectedCategory}
                                  </Button>
                                  {FAQ_DATA[selectedCategory].map((qa) => (
                                    <Button
                                      key={qa.question}
                                      size="sm"
                                      variant="outline"
                                      className="h-8 shrink-0"
                                      onClick={() => pickQuestion(qa)}
                                    >
                                      {qa.question}
                                    </Button>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <span className="text-sm whitespace-nowrap text-muted-foreground">
                                    カテゴリを選択:
                                  </span>
                                  {categories.map((c) => (
                                    <Button
                                      key={c}
                                      size="sm"
                                      variant={selectedCategory === c ? 'default' : 'outline'}
                                      className="h-8 shrink-0"
                                      onClick={() => pickCategory(c)}
                                    >
                                      {c}
                                    </Button>
                                  ))}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* toolbar */}
                <div className="shrink-0 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {step !== 'category' && (
                        <Button variant="ghost" size="sm" onClick={() => setStep('category')} className="gap-1">
                          <ChevronLeft className="h-4 w-4" /> カテゴリへ
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="sm" onClick={resetAll}>
                        やり直す
                      </Button>
                      <Button size="sm" className="gap-2" onClick={copyAnswer} disabled={!selectedQA}>
                        {copyOK ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} 回答をコピー
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {step === 'answer' && selectedQA && (
                <div className="mt-4 text-xs text-muted-foreground">
                  役に立ちましたか？{' '}
                  <Button size="sm" variant="outline" className="mr-1 h-7 px-2">
                    👍 はい
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 px-2">
                    👎 いいえ
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
