'use client';
import { motion } from 'framer-motion';
import { KeyRound, MessagesSquare, PanelsTopLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function Features() {
  const t = useTranslations();
  const items = [
    {
      icon: <KeyRound className="size-5" />,
      title: t('Home.Features.Feature1.Title'),
      desc: t('Home.Features.Feature1.Description'),
    },
    {
      icon: <PanelsTopLeft className="size-5" />,
      title: t('Home.Features.Feature2.Title'),
      desc: t('Home.Features.Feature2.Description'),
    },
    {
      icon: <MessagesSquare className="size-5" />,
      title: t('Home.Features.Feature3.Title'),
      desc: t('Home.Features.Feature3.Description'),
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <Card className="h-full border-border/60 bg-card/70">
            <CardHeader>
              <div className="flex items-center gap-2 text-base font-medium">
                {f.icon}
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{f.desc}</CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
