'use client';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function ProvidersGrid() {
  const providers = [
    {
      id: 'hf',
      name: 'Hugging Face',
      models: ['Meta-Llama-3.3-70B', 'GPT-OSS-20B'],
      note: 'Wide variety of open-source models. Great for customizing to specific needs.',
      support: 'supported',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      models: [],
      note: 'High-quality text generation and tool execution. Best for reasoning-heavy tasks.',
      support: 'comming soon',
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {providers.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <Card className="h-full border-border/60 bg-card/75">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-base font-medium">
                  <CardTitle className="text-lg">{p.name}</CardTitle>
                </div>
                <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">{p.support}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {p.models.map((m) => (
                  <Badge key={m} variant="secondary" className="rounded-xl">
                    {m}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{p.note}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
