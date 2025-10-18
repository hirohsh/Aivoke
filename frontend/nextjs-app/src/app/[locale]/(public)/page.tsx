import Features from '@/components/home/Features';
import Footer from '@/components/home/Footer';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import ProvidersGrid from '@/components/home/ProvidersGrid';
import SectionHeading from '@/components/home/SectionHeading';
import { routing } from '@/i18n/routing';
import { LocaleParam } from '@/types/LocaleTypes';
import { BrainCircuit, KeyRound, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<LocaleParam> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <div className="scrollbar fixed inset-0 w-full overflow-auto bg-gradient-to-br from-background via-background to-indigo-950/10 pl-3 dark:to-indigo-900/10">
      <main className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <Hero
          title={t('Home.Hero.H1')}
          description={t('Home.Hero.Description')}
          tag={t('Home.Hero.Tag')}
          buttonText={t('Home.Hero.GetStarted')}
        />

        <section className="mt-10 grid gap-6 md:mt-14" aria-labelledby="features-heading">
          <SectionHeading
            id="features-heading"
            title={t('Home.SectionHeading.Features.Title')}
            subtitle={t('Home.SectionHeading.Features.Subtitle')}
            icon={<Sparkles className="size-5" />}
          />
          <Features />
        </section>

        <section className="mt-10 grid gap-6 md:mt-14" aria-labelledby="how-heading">
          <SectionHeading
            id="how-heading"
            title={t('Home.SectionHeading.HowItWorks.Title')}
            subtitle={t('Home.SectionHeading.HowItWorks.Subtitle')}
            icon={<KeyRound className="size-5" />}
          />
          <HowItWorks />
        </section>

        <section className="mt-10 grid gap-6 md:mt-14" aria-labelledby="providers-heading">
          <SectionHeading
            id="providers-heading"
            title={t('Home.SectionHeading.ProvidersGrid.Title')}
            subtitle={t('Home.SectionHeading.ProvidersGrid.Subtitle')}
            icon={<BrainCircuit className="size-5" />}
          />
          <ProvidersGrid />
        </section>
      </main>

      <Footer />
    </div>
  );
}
