'use client';

import { Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      size="sm"
      className="cursor-pointer text-xs text-zinc-100 hover:text-zinc-200"
    >
      <Copy />
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  );
}
