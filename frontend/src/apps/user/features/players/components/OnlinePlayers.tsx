import { useOnlinePlayers } from '../hooks/usePlayers';

export function OnlinePlayers() {
  const { data: players, isLoading, error } = useOnlinePlayers({ limit: 10 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading players</div>;
  if (!players || players.length === 0) return <div>No players online</div>;

  return (
    <ul>
      {players.map((player) => (
        <li key={player.id}>
          {player.name} - Level {player.level}
        </li>
      ))}
    </ul>
  );
}
