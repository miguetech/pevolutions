import React from 'react';
import { usePlayersList } from '../hooks/usePlayersList';
import { PlayerCard } from './PlayerCard';

interface Props {
  onViewPlayer?: (name: string) => void;
  onDeletePlayer?: (name: string) => void;
}

export const PlayersList: React.FC<Props> = ({ onViewPlayer, onDeletePlayer }) => {
  const { data: players, isLoading, isError } = usePlayersList();

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">⚔️ My Characters</h3>
        <p className="text-gray-400">Loading characters...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">⚔️ My Characters</h3>
        <p className="text-red-400">Failed to load characters</p>
      </div>
    );
  }

  if (!players || players.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">⚔️ My Characters</h3>
        <p className="text-gray-400">No characters yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">⚔️ My Characters</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onView={onViewPlayer}
            onDelete={onDeletePlayer}
          />
        ))}
      </div>
    </div>
  );
};
