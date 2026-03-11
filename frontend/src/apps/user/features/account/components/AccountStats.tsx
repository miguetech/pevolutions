import React from 'react';
import { useAccountStats } from '../hooks/useAccountStats';

export const AccountStats: React.FC = () => {
  const { data, isLoading, isError } = useAccountStats();

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Account Stats</h3>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Account Stats</h3>
        <p className="text-red-400">Failed to load stats</p>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours.toLocaleString()}h`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">📊 Account Stats</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">⏱️ Playing Time:</span>
          <span className="font-semibold">{formatTime(data.total_playing_time)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">🎮 Pokemon Caught:</span>
          <span className="font-semibold">{data.pokemon_caught.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">🏆 World Ranking:</span>
          <span className="font-semibold">#{data.world_ranking.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
