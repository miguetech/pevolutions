import React from 'react';
import { PlayerStatsDetailed } from './PlayerStatsDetailed';
import { PokemonTeam } from './PokemonTeam';

interface Props {
  playerName: string;
  onClose?: () => void;
}

export const PlayerProfile: React.FC<Props> = ({ playerName, onClose }) => {
  return (
    <div className="space-y-6">
      {onClose && (
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-bold"
        >
          ← Back
        </button>
      )}
      
      <PlayerStatsDetailed playerName={playerName} />
      <PokemonTeam playerName={playerName} />
    </div>
  );
};
