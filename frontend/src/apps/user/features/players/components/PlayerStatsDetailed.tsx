import React from 'react';
import { usePlayerStats } from '../hooks/usePlayerStats';

interface Props {
  playerName: string;
}

export const PlayerStatsDetailed: React.FC<Props> = ({ playerName }) => {
  const { data, isLoading, isError } = usePlayerStats(playerName);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">📊 Player Stats</h3>
        <p className="text-gray-400">Loading stats...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">📊 Player Stats</h3>
        <p className="text-red-400">Failed to load stats</p>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours.toLocaleString()}h`;
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center">
          <span className="text-3xl">{data.sex === 0 ? '👨' : '👩'}</span>
        </div>
        <div>
          <h2 className="text-3xl font-black text-white">{data.name}</h2>
          <p className="text-gray-400">Level {data.level}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Experience</p>
          <p className="text-white font-bold text-xl">{data.experience.toLocaleString()}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Health</p>
          <p className="text-white font-bold text-xl">{data.health}/{data.healthmax}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Fishing Level</p>
          <p className="text-white font-bold text-xl">{data.skill_fishing}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Pokemon Caught</p>
          <p className="text-white font-bold text-xl">{data.pokemon_count}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Time Played</p>
          <p className="text-white font-bold text-xl">{formatTime(data.onlinetime)}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Vocation</p>
          <p className="text-white font-bold text-xl">{data.vocation}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Last Login:</span>
          <span className="text-white">{formatDate(data.lastlogin)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Last Logout:</span>
          <span className="text-white">{formatDate(data.lastlogout)}</span>
        </div>
      </div>
    </div>
  );
};
