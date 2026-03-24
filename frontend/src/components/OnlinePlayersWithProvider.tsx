import { OnlinePlayers } from '@/apps/user/features/players/components/OnlinePlayers';
import { Providers } from './providers/Providers';

export function OnlinePlayersWithProvider() {
  return (
    <Providers>
      <OnlinePlayers />
    </Providers>
  );
}
