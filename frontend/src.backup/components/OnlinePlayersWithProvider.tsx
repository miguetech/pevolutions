import { OnlinePlayers } from './OnlinePlayers';
import { Providers } from './providers/Providers';

export function OnlinePlayersWithProvider() {
  return (
    <Providers>
      <OnlinePlayers />
    </Providers>
  );
}
