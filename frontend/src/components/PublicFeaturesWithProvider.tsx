import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Community from '../apps/public/features/community/Community';
import Support from '../apps/public/features/support/Support';
import Downloads from '../apps/public/features/downloads/Downloads';

const queryClient = new QueryClient();

interface Props {
  lang: 'en' | 'es' | 'pt';
}

export function CommunityWithProvider({ lang }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Community lang={lang} />
    </QueryClientProvider>
  );
}

export function SupportWithProvider({ lang }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Support lang={lang} />
    </QueryClientProvider>
  );
}

export function DownloadsWithProvider({ lang }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Downloads lang={lang} />
    </QueryClientProvider>
  );
}
