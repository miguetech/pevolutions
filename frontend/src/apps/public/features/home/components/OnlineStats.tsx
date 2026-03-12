import { useOnlinePlayers } from '@/apps/user/features/players/hooks/usePlayers';

export function OnlineStats() {
  const { data: players, isLoading } = useOnlinePlayers({ limit: 100 });

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Jugadores Online</p>
          <p className="text-3xl font-bold text-white">
            {isLoading ? '...' : players?.length || 0}
          </p>
        </div>
      </div>
      
      {!isLoading && players && players.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 mb-2">Conectados ahora:</p>
          <div className="flex flex-wrap gap-2">
            {players.slice(0, 5).map((player) => (
              <span
                key={player.id}
                className="text-xs px-2 py-1 bg-brand-accent/10 text-brand-accent rounded"
              >
                {player.name}
              </span>
            ))}
            {players.length > 5 && (
              <span className="text-xs px-2 py-1 text-gray-400">
                +{players.length - 5} más
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
