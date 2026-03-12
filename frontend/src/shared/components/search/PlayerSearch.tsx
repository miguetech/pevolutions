import React, { useState, useRef, useEffect } from 'react';
import { useOnlinePlayers } from '@/apps/user/features/players/hooks/usePlayers';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface Props {
  onSelectPlayer?: (name: string) => void;
  placeholder?: string;
  redirectToList?: boolean;
  expandable?: boolean;
}

export const PlayerSearch: React.FC<Props> = ({ 
  onSelectPlayer, 
  placeholder = 'Search players...', 
  redirectToList = false,
  expandable = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { data: players, isLoading } = useOnlinePlayers({ 
    limit: 10,
    search: debouncedSearch || undefined
  });
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (expandable) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandable]);

  const handleSelect = (name: string) => {
    if (onSelectPlayer) {
      onSelectPlayer(name);
    } else if (redirectToList) {
      window.location.href = `/online-players?search=${encodeURIComponent(name)}`;
    } else {
      window.location.href = `/player?name=${encodeURIComponent(name)}`;
    }
    setSearchTerm('');
    setIsOpen(false);
    if (expandable) setIsExpanded(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim() && redirectToList) {
      e.preventDefault();
      window.location.href = `/online-players?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  const showResults = isOpen && searchTerm.length > 0;

  if (expandable) {
    return (
      <div 
        ref={wrapperRef} 
        className="relative group"
        onMouseEnter={() => !isExpanded && setIsExpanded(true)}
        onMouseLeave={() => !isExpanded && setIsExpanded(false)}
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setIsExpanded(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`bg-white/5 border border-white/10 rounded-xl py-2 pl-10 text-sm focus:outline-none focus:border-brand-accent transition-all duration-500 ease-in-out text-white ${
            isExpanded ? 'w-64 pr-4 placeholder:opacity-100' : 'w-10 pr-0 placeholder:opacity-0'
          }`}
        />
        <div className="absolute left-3 top-2 pointer-events-none flex items-center">
          <svg 
            className="w-4 h-4 text-gray-500 group-hover:text-brand-accent group-focus-within:text-brand-accent transition-colors duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/10 rounded-xl shadow-xl max-h-80 overflow-y-auto z-50">
            {isLoading ? (
              <div className="p-4 text-gray-400 text-sm">Searching...</div>
            ) : players && players.length > 0 ? (
              <div className="py-2">
                {players.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => handleSelect(player.name)}
                    className="w-full px-4 py-3 hover:bg-gray-700 transition-colors text-left flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-white">{player.name}</p>
                      <p className="text-sm text-gray-400">Level {player.level}</p>
                    </div>
                    <span className="text-xs text-gray-500">→</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-gray-400 text-sm">No players found</div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-brand-accent transition-colors text-white"
      />

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/10 rounded-xl shadow-xl max-h-80 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-gray-400 text-sm">Searching...</div>
          ) : players && players.length > 0 ? (
            <div className="py-2">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleSelect(player.name)}
                  className="w-full px-4 py-3 hover:bg-gray-700 transition-colors text-left flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white">{player.name}</p>
                    <p className="text-sm text-gray-400">Level {player.level}</p>
                  </div>
                  <span className="text-xs text-gray-500">→</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-gray-400 text-sm">No players found</div>
          )}
        </div>
      )}
    </div>
  );
};
