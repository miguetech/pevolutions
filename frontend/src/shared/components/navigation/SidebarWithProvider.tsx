import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ServerInfo, TopPlayers } from './Sidebar';

const queryClient = new QueryClient();

interface Props {
  lang: 'en' | 'es' | 'pt';
}

export function ServerInfoWithProvider({ lang }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ServerInfo lang={lang} />
    </QueryClientProvider>
  );
}

export function TopPlayersWithProvider({ lang }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <TopPlayers lang={lang} />
    </QueryClientProvider>
  );
}
