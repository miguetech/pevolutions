import React from 'react';
import type { Player } from '../api/playersAPI';

interface Props {
  player: Player;
  onView?: (name: string) => void;
  onDelete?: (name: string) => void;
}

const VOCATION_ICONS: Record<number, string> = {
  0: '⚔️',
  1: '⚡',
  2: '🔥',
  3: '💧',
  4: '🌿',
};

export const PlayerCard: React.FC<Props> = ({ player, onView, onDelete }) => {
  const icon = VOCATION_ICONS[player.vocation] || '⚔️';

  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-bold flex items-center gap-2">
          {icon} {player.name}
        </h4>
        <span className="text-sm text-gray-400">Lv. {player.level}</span>
      </div>
      
      <div className="space-y-1 text-sm mb-3">
        <div className="flex justify-between">
          <span className="text-gray-400">HP:</span>
          <span>{player.health}/{player.healthmax}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">EXP:</span>
          <span>{(player.experience / 1000).toFixed(1)}k</span>
        </div>
      </div>

      <div className="flex gap-2">
        {onView && (
          <button
            onClick={() => onView(player.name)}
            className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            View
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(player.name)}
            className="flex-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
