import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlayerProfile } from '../apps/user/features/players/components/PlayerProfile';

const queryClient = new QueryClient();

interface Props {
  playerName: string;
  lang: 'en' | 'es' | 'pt';
}

export function PlayerProfileWithProvider({ playerName, lang }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProfile playerName={playerName} />
    </QueryClientProvider>
  );
}
