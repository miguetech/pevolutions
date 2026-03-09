import React, { useState, useRef, useEffect } from 'react';
import { languages } from '../i18n/ui';

interface LanguagePickerProps {
  currentLang: 'en' | 'es' | 'pt';
}

const FlagIcons = {
  es: (
    <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 750 500">
      <rect width="750" height="500" fill="#c60b1e"/>
      <rect width="750" height="250" y="125" fill="#ffc400"/>
    </svg>
  ),
  en: (
    <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 741 390">
      <rect width="741" height="390" fill="#fff"/>
      <path d="M0 30h741M0 90h741M0 150h741M0 210h741M0 270h741M0 330h741" stroke="#b22234" strokeWidth="30"/>
      <rect width="296" height="210" fill="#3c3b6e"/>
    </svg>
  ),
  pt: (
    <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 720 504">
      <rect width="720" height="504" fill="#009739"/>
      <path d="M360 54L666 252 360 450 54 252z" fill="#fedd00"/>
      <circle cx="360" cy="252" r="105" fill="#012169"/>
    </svg>
  ),
};

const LanguagePicker: React.FC<LanguagePickerProps> = ({ currentLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLocalizedPath = (targetLang: string) => {
    if (!currentPath) return '#';
    
    const segments = currentPath.split('/').filter(Boolean);
    const langKeys = Object.keys(languages).filter(l => l !== 'es'); // ['en', 'pt']
    
    // Si el primer segmento es un idioma, lo quitamos
    if (langKeys.includes(segments[0])) {
      segments.shift();
    }
    
    const cleanPath = segments.join('/');
    
    if (targetLang === 'es') {
      return `/${cleanPath}`;
    }
    return `/${targetLang}/${cleanPath}`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all duration-300 group"
      >
        <div className="group-hover:scale-110 transition-transform duration-300">
          {FlagIcons[currentLang]}
        </div>
        <span className="text-xs font-black uppercase text-white tracking-widest">{currentLang}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-brand-bg/95 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-50">
          {Object.entries(languages).map(([lang, label]) => (
            <a
              key={lang}
              href={getLocalizedPath(lang)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 ${
                currentLang === lang 
                  ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="shrink-0">{FlagIcons[lang as keyof typeof FlagIcons]}</div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider leading-none mb-0.5">{lang}</span>
                <span className="text-[10px] text-gray-500 font-medium">{label}</span>
              </div>
              {currentLang === lang && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(0,243,255,0.8)]"></div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguagePicker;
