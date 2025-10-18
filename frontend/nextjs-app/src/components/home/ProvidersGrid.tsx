'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function ProvidersGrid() {
  const t = useTranslations();
  const providers = [
    {
      id: 'hf',
      name: t('Home.ProvidersGrid.Provider1.Title'),
      models: [t('Home.ProvidersGrid.Provider1.Model1'), t('Home.ProvidersGrid.Provider1.Model2')],
      note: t('Home.ProvidersGrid.Provider1.Description'),
      support: t('Home.ProvidersGrid.Supported'),
    },
    {
      id: 'openai',
      name: t('Home.ProvidersGrid.Provider2.Title'),
      models: [],
      note: t('Home.ProvidersGrid.Provider2.Description'),
      support: t('Home.ProvidersGrid.ComingSoon'),
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
