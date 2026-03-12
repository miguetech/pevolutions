import Hero from './components/Hero';
import { OnlineStats } from './components/OnlineStats';

export function Home() {
  return (
    <div className="space-y-6">
      <OnlineStats />
      <Hero />
    </div>
  );
}
