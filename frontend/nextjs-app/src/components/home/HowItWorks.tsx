'use client';
import { motion } from 'framer-motion';
import { KeyRound, MessagesSquare, PanelsTopLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function HowItWorks() {
  const t = useTranslations();
  const steps = [
    {
      no: 1,
      icon: <KeyRound className="size-5" />,
      title: t('Home.HowItWorks.Step1.Title'),
      tips: [t('Home.HowItWorks.Step1.Tip1'), t('Home.HowItWorks.Step1.Tip2')],
      desc: t('Home.HowItWorks.Step1.Description'),
    },
    {
      no: 2,
      icon: <PanelsTopLeft className="size-5" />,
      title: t('Home.HowItWorks.Step2.Title'),
      tips: [t('Home.HowItWorks.Step2.Tip1'), t('Home.HowItWorks.Step2.Tip2'), t('Home.HowItWorks.Step2.Tip3')],
      desc: t('Home.HowItWorks.Step2.Description'),
    },
    {
      no: 3,
      icon: <MessagesSquare className="size-5" />,
      title: t('Home.HowItWorks.Step3.Title'),
      tips: [t('Home.HowItWorks.Step3.Tip1'), t('Home.HowItWorks.Step3.Tip2')],
      desc: t('Home.HowItWorks.Step3.Description'),
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((s, i) => (
        <motion.div
          key={s.no}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <Card className="h-full overflow-hidden border-border/60 bg-card/75">
            <CardHeader>
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-base font-medium">
                  {s.icon}
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                </div>
                <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
                  {t('Home.HowItWorks.Step')} {s.no}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tips.map((t) => (
                  <Badge key={t} variant="secondary" className="rounded-xl">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
