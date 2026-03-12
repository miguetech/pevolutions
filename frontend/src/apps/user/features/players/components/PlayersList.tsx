import React, { useState } from 'react';
import { usePlayersList } from '../hooks/usePlayersList';
import { useDeletePlayer } from '../hooks/useDeletePlayer';
import { PlayerCard } from './PlayerCard';
import { PlayerProfile } from './PlayerProfile';

interface Props {
  onViewPlayer?: (name: string) => void;
}

export const PlayersList: React.FC<Props> = ({ onViewPlayer }) => {
  const { data: players, isLoading, isError } = usePlayersList();
  const { mutate: deletePlayer, isPending: isDeleting } = useDeletePlayer();
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [viewingPlayer, setViewingPlayer] = useState<string | null>(null);

  const handleDelete = (name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setDeletingName(name);
      deletePlayer(name, {
        onSettled: () => setDeletingName(null),
      });
    }
  };

  const handleView = (name: string) => {
    if (onViewPlayer) {
      onViewPlayer(name);
    } else {
      setViewingPlayer(name);
    }
  };

  if (viewingPlayer) {
    return <PlayerProfile playerName={viewingPlayer} onClose={() => setViewingPlayer(null)} />;
  }

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
            onView={handleView}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
