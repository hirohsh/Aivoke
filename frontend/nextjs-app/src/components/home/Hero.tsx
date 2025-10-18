'use client';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface HeroProps {
  title: string;
  description: string;
  tag: string;
  buttonText: string;
}

export default function Hero({ title, description, tag, buttonText }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-b bg-[linear-gradient(to_right,rgba(120,119,198,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,119,198,.08)_1px,transparent_1px)] from-background/70 via-background to-muted/40 bg-[size:22px_22px] p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="size-3.5" /> {tag}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
        <p className="mt-4 text-muted-foreground md:text-lg">{description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button size="lg" className="cursor-pointer rounded-2xl" asChild>
            <Link href={`/chat`}>{buttonText}</Link>
          </Button>
        </div>
      </motion.div>

      {/* background decorations */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-foreground/10 blur-3xl" />
    </div>
  );
}
