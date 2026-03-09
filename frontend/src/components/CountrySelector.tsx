import React, { useState, useRef, useEffect } from 'react';
import { countries } from '../data/countries';

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ 
  value, 
  onChange, 
  label, 
  placeholder = "Select...",
  searchPlaceholder = "Search country..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = countries.find(c => c.code === value);
  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const handleSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">{label}</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white/5 border ${isOpen ? 'border-brand-accent' : 'border-white/10'} rounded-xl px-4 py-3 text-left transition-all flex items-center justify-between group hover:border-brand-accent/50`}
      >
        <span className={`font-medium ${selectedCountry ? 'text-white' : 'text-gray-500'}`}>
          {selectedCountry ? (
            <span className="flex items-center gap-3">
              <img 
                src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png 2x`}
                width="20"
                height="15"
                alt={selectedCountry.name}
                className="w-5 h-auto rounded-sm shadow-sm opacity-90"
              />
              <span className="truncate">{selectedCountry.name}</span>
            </span>
          ) : (
            placeholder
          )}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-accent' : 'group-hover:text-brand-accent'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-brand-bg/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-white/5 sticky top-0 bg-brand-bg/95 backdrop-blur-xl z-10">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent/50 transition-all"
              />
              <svg 
                className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => handleSelect(c.code)}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left ${value === c.code ? 'bg-brand-accent/10 border-l-4 border-brand-accent' : ''}`}
                >
                  <img 
                    src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w80/${c.code.toLowerCase()}.png 2x`}
                    width="20"
                    height="15"
                    alt={c.name}
                    className="w-5 h-auto rounded-sm shadow-sm opacity-90 shrink-0"
                    loading="lazy"
                  />
                  <span className={`text-sm truncate ${value === c.code ? 'text-white font-bold' : 'text-gray-300'}`}>
                    {c.name}
                  </span>
                  {value === c.code && (
                    <svg className="ml-auto w-4 h-4 text-brand-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
