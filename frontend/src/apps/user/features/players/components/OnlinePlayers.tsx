import React, { useState, useEffect } from 'react';
import { useOnlinePlayers } from '../hooks/usePlayers';
import { PlayerProfile } from './PlayerProfile';
import { useDebounce } from '@/shared/hooks/useDebounce';

export function OnlinePlayers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'level' | 'captures' | 'fishing_level'>('level');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data: players, isLoading } = useOnlinePlayers({ 
    limit: 50, 
    sort_by: sortBy,
    search: debouncedSearch || undefined
  });
  const [viewingPlayer, setViewingPlayer] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearch = urlParams.get('search');
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, []);

  useEffect(() => {
    if (debouncedSearch) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('search', debouncedSearch);
      window.history.replaceState({}, '', newUrl);
    } else {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('search');
      window.history.replaceState({}, '', newUrl);
    }
  }, [debouncedSearch]);

  if (viewingPlayer) {
    return <PlayerProfile playerName={viewingPlayer} onClose={() => setViewingPlayer(null)} />;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">🌐 Online Players</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="level">Level</option>
          <option value="captures">Captures</option>
          <option value="fishing_level">Fishing</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-gray-400">Loading...</p>
      ) : !players || players.length === 0 ? (
        <p className="text-gray-400">No players found</p>
      ) : (
        <>
          <div className="space-y-2">
            {players.map((player) => (
              <div
                key={player.id}
                onClick={() => setViewingPlayer(player.name)}
                className="flex items-center justify-between p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer transition"
              >
                <div>
                  <p className="font-bold">{player.name}</p>
                  <p className="text-sm text-gray-400">Level {player.level}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-400">Vocation: {player.vocation}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-sm mt-4">
            Showing {players.length} players
          </p>
        </>
      )}
    </div>
  );
}
