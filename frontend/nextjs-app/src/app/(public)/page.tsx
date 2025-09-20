import Features from '@/components/home/Features';
import Footer from '@/components/home/Footer';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';
import ProvidersGrid from '@/components/home/ProvidersGrid';
import SectionHeading from '@/components/home/SectionHeading';
import { BrainCircuit, KeyRound, Sparkles } from 'lucide-react';

export default async function Home() {
  return (
    <div className="scrollbar fixed inset-0 w-full overflow-auto bg-gradient-to-br from-background via-background to-indigo-950/10 pl-3 dark:to-indigo-900/10">
      <main className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <Hero />

        <section className="mt-10 grid gap-6 md:mt-14" aria-labelledby="features-heading">
          <SectionHeading
            id="features-heading"
            title="Features"
            subtitle="BYO key · Multi-provider · Switch inside chat"
            icon={<Sparkles className="size-5" />}
          />
          <Features />
        </section>

        <section className="mt-10 grid gap-6 md:mt-14" aria-labelledby="how-heading">
          <SectionHeading
            id="how-heading"
            title="How It Works"
            subtitle="3 easy steps"
            icon={<KeyRound className="size-5" />}
          />
          <HowItWorks />
        </section>

        <section className="mt-10 grid gap-6 md:mt-14" aria-labelledby="providers-heading">
          <SectionHeading
            id="providers-heading"
            title="Supported Providers & Models"
            subtitle="Choose between OpenAI / Hugging Face"
            icon={<BrainCircuit className="size-5" />}
          />
          <ProvidersGrid />
        </section>
      </main>

      <Footer />
    </div>
  );
}
