import React, { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '@/auth/stores/authAtoms';
import { useTranslations, useLocalizedPath } from '../i18n/utils';
import LanguagePicker from './LanguagePicker';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

const AuthenticatedNavbar: React.FC<Props> = ({ lang }) => {
  const token = useAtomValue(tokenAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const isLoggedIn = !!token;

  const t = useTranslations(lang);
  const l = useLocalizedPath(lang);

  useEffect(() => {
    setCurrentPath(window.location.pathname);

    const handleNavigation = () => {
      setCurrentPath(window.location.pathname);
    };

    document.addEventListener('astro:after-navigation', handleNavigation);
    return () => document.removeEventListener('astro:after-navigation', handleNavigation);
  }, []);

  const navLinks = [
    { href: l('/'), label: t('nav.home') },
    { href: l('/download'), label: t('nav.download') },
    { href: l('/rankings'), label: t('nav.rankings') },
    { href: l('/shop'), label: t('nav.shop') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href={l('/')} className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-accent to-brand-pokemon-gold flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.3)] group-hover:scale-110 transition-transform">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black text-white uppercase tracking-tighter italic">PEvolutions</span>
              <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Online</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                  currentPath === link.href
                    ? 'bg-brand-accent text-brand-bg shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <LanguagePicker currentLang={lang} />

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Account/Login Button */}
            {isLoggedIn ? (
              <a
                href={l('/account')}
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-brand-bg font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all"
              >
                <span>👤</span>
                <span>{t('nav.panel')}</span>
              </a>
            ) : (
              <a
                href={l('/login')}
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-brand-accent text-brand-bg font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all"
              >
                <span>🔐</span>
                <span>{t('nav.login')}</span>
              </a>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/5">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                    currentPath === link.href
                      ? 'bg-brand-accent text-brand-bg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              {isLoggedIn ? (
                <a
                  href={l('/account')}
                  className="px-4 py-3 bg-brand-accent text-brand-bg font-black uppercase tracking-widest text-sm rounded-xl text-center"
                >
                  👤 {t('nav.panel')}
                </a>
              ) : (
                <a
                  href={l('/login')}
                  className="px-4 py-3 bg-brand-accent text-brand-bg font-black uppercase tracking-widest text-sm rounded-xl text-center"
                >
                  🔐 {t('nav.login')}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-brand-bg/95 backdrop-blur-xl border-b border-white/5 p-6">
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                placeholder={t('nav.search_placeholder')}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-accent/50 transition-all"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AuthenticatedNavbar;
