import Hero from './components/Hero';
import { OnlineStats } from './components/OnlineStats';

export function Home({ lang }: { lang: 'en' | 'es' | 'pt' }) {
  return (
    <div className="space-y-6">
      <OnlineStats />
      <Hero lang={lang} />
    </div>
  );
}
