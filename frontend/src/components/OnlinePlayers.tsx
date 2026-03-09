import React, { useState, useMemo } from 'react';

interface Player {
  id: number;
  name: string;
  level: number;
  captures: number;
  fishingLevel: number;
  avatar: string;
  gender: 'boy' | 'girl';
}

type SortOption = 'level' | 'captures' | 'fishingLevel';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

const OnlinePlayers: React.FC<Props> = ({ lang }) => {
  const [sortBy, setSortBy] = useState<SortOption>('level');
  const [search, setSearch] = useState('');

  // Mock data for demonstration
  const [players] = useState<Player[]>([
    { id: 1, name: 'Sylarnal', level: 85, captures: 120, fishingLevel: 45, avatar: 'https://img.pokemondb.net/sprites/black-white/anim/normal/charizard.gif', gender: 'boy' },
    { id: 2, name: 'Zaps', level: 72, captures: 340, fishingLevel: 89, avatar: 'https://img.pokemondb.net/sprites/black-white/anim/normal/pikachu.gif', gender: 'boy' },
    { id: 3, name: 'MistyTrainer', level: 45, captures: 85, fishingLevel: 99, avatar: 'https://img.pokemondb.net/sprites/black-white/anim/normal/starmie.gif', gender: 'girl' },
    { id: 4, name: 'AshKetchum', level: 99, captures: 1500, fishingLevel: 12, avatar: 'https://img.pokemondb.net/sprites/black-white/anim/normal/butterfree.gif', gender: 'boy' },
    { id: 5, name: 'PokeQueen', level: 64, captures: 230, fishingLevel: 67, avatar: 'https://img.pokemondb.net/sprites/black-white/anim/normal/gardevoir.gif', gender: 'girl' },
    { id: 6, name: 'Bruno', level: 33, captures: 12, fishingLevel: 5, avatar: 'https://img.pokemondb.net/sprites/black-white/anim/normal/machamp.gif', gender: 'boy' },
    { id: 7, name: 'Dawn', level: 58, captures: 110, fishingLevel: 78, avatar: 'https://img.pokemondb.net/sprites/black-white/anim/normal/piplup.gif', gender: 'girl' },
  ]);

  const filteredAndSortedPlayers = useMemo(() => {
    return players
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [players, sortBy, search]);

  const sortLabels: Record<SortOption, { label: string, icon: React.ReactNode }> = {
    level: { 
      label: 'Level', 
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> 
    },
    captures: { 
      label: 'Captures', 
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> 
    },
    fishingLevel: { 
      label: 'Fishing', 
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg> 
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Online <span className="text-brand-accent">Players</span>
          </h2>
          <div className="h-1 w-20 bg-brand-accent rounded-full"></div>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search player..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent/50 transition-all"
          />
          <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filters/Sorting Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2 border-r border-white/10 pr-4">Sort By</span>
        {(Object.keys(sortLabels) as SortOption[]).map((option) => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              sortBy === option 
                ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' 
                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {sortLabels[option].icon}
            {sortLabels[option].label}
          </button>
        ))}
      </div>

      {/* Players List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredAndSortedPlayers.map((player) => (
          <div key={player.id} className="glass-card p-3 flex items-center gap-3 group hover:border-brand-accent/50 transition-all duration-300 relative overflow-hidden">
            <div className="flex flex-1 items-center gap-3 relative z-10 min-w-0">
              {/* Avatar Section */}
              <div className="w-12 h-12 shrink-0 rounded-xl bg-brand-bg/50 border border-white/5 flex items-center justify-center overflow-hidden relative group-hover:bg-brand-accent/10 transition-colors">
                <img 
                  src={player.avatar} 
                  alt={player.name}
                  className="w-10 h-10 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-brand-bg ${player.gender === 'boy' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
              </div>
              
              {/* Info Section */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-base font-bold text-white group-hover:text-brand-accent transition-colors truncate">{player.name}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 shrink-0">
                    <span className="text-[9px] font-black text-gray-500 uppercase">Lv.</span>
                    <span className="text-xs font-bold text-white">{player.level}</span>
                  </div>
                  <div className="w-1 h-1 bg-white/10 rounded-full hidden xs:block"></div>
                  <span className={`text-[10px] font-bold hidden sm:block truncate ${player.gender === 'boy' ? 'text-blue-400/80' : 'text-pink-400/80'}`}>
                    {player.gender === 'boy' ? 'Boy' : 'Girl'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex items-center shrink-0 relative z-10 ml-auto border-l border-white/5 pl-3">
              <div className={`flex flex-col items-center min-w-[50px] transition-opacity duration-300 ${sortBy === 'captures' ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                <span className="text-[8px] font-black text-brand-pokemon-gold uppercase tracking-tighter">Captures</span>
                <span className="text-sm font-black text-white">{player.captures}</span>
              </div>
              <div className="w-[1px] h-6 bg-white/5 mx-2 sm:mx-3"></div>
              <div className={`flex flex-col items-center min-w-[50px] transition-opacity duration-300 ${sortBy === 'fishingLevel' ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">Fishing</span>
                <span className="text-sm font-black text-white">{player.fishingLevel}</span>
              </div>
            </div>

            {/* Background Accent for Active Stat */}
            {sortBy === 'captures' && <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-brand-pokemon-gold/5 blur-2xl pointer-events-none"></div>}
            {sortBy === 'fishingLevel' && <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-blue-400/5 blur-2xl pointer-events-none"></div>}
            {sortBy === 'level' && <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-brand-accent/5 blur-2xl pointer-events-none"></div>}
          </div>
        ))}
      </div>

      {filteredAndSortedPlayers.length === 0 && (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center gap-4 border-dashed border-white/10">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium whitespace-pre-line">
            No players found matching your search.{"\n"}
            Try another name or clear the filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default OnlinePlayers;
