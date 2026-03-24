import React, { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '@/auth/stores/authAtoms';
import { useTranslations, useLocalizedPath } from '@/i18n/utils';
import LanguagePicker from './LanguagePicker';
import { PlayerSearch } from '../search/PlayerSearch';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

const Navbar: React.FC<Props> = ({ lang }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const token = useAtomValue(tokenAtom);
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
    { name: t('nav.home'), href: l('/') },
    { name: t('nav.downloads'), href: l('/downloads') },
    { name: t('nav.support'), href: l('/support') },
    { name: t('nav.community'), href: l('/community') },
    { name: isLoggedIn ? t('nav.dashboard') : t('nav.login'), href: isLoggedIn ? l('/account') : l('/login') },
  ];


  const getLinkClasses = (href: string) => {
    const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href));
    return `nav-link font-medium ${isActive ? 'border-b-2 border-brand-accent pb-1' : ''}`;
  };

  const getMobileLinkClasses = (href: string) => {
    const isActive = currentPath === href || (href !== '/' && currentPath.startsWith(href));
    return `block nav-link text-lg font-medium ${isActive ? 'text-brand-accent' : ''}`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Logo: Mega Eye Image */}
          <a href="/" className="md:hidden flex items-center gap-2">
            <img 
              src="/images/mega-eye.png" 
              alt="PE Logo" 
              className="h-10 w-10 object-contain animate-pulse-slow"
            />
            <span className="text-xl font-bold tracking-tighter text-white">
              PE<span className="text-brand-accent">volutions</span>
            </span>
          </a>
          
          {/* Desktop Logo: Uploaded Image */}
          <a href="/" className="hidden md:flex items-center gap-2">
            <img 
              src="/images/logo.png" 
              alt="PEvolutions Logo" 
              className="h-10 w-auto"
            />
          </a>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className={getLinkClasses(link.href)}>
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <LanguagePicker currentLang={lang} />
          </div>
          
          {/* Desktop Search */}
          <div className="hidden md:block">
            <PlayerSearch placeholder={t('nav.search')} redirectToList={true} expandable={true} />
          </div>

          {/* Mobile Search Toggle */}
          <button 
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isMenuOpen) setIsMenuOpen(false);
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (isSearchOpen) setIsSearchOpen(false);
            }}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown */}
      {isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-bg/95 backdrop-blur-lg border-b border-white/5 py-4 px-6 animate-in fade-in slide-in-from-top-2 duration-200">
          <PlayerSearch placeholder={t('nav.search')} redirectToList={true} />
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-brand-bg/95 backdrop-blur-lg border-b border-white/5 py-4 px-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex justify-center pb-2">
            <LanguagePicker currentLang={lang} />
          </div>
          <div className="space-y-4 pt-2 border-t border-white/5">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className={getMobileLinkClasses(link.href)}>
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
