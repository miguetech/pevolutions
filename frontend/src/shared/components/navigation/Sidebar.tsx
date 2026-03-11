import React, { useEffect, useState } from 'react';
import SidebarCard from './SidebarCard';
import { useTranslations, useLocalizedPath } from '../i18n/utils';

interface SidebarProps {
  lang: 'en' | 'es' | 'pt';
}

export const LoginBox: React.FC<SidebarProps> = ({ lang }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const t = useTranslations(lang);
  const l = useLocalizedPath(lang);

  useEffect(() => {
    const status = localStorage.getItem('isLoggedIn') === 'true';
    const userData = localStorage.getItem('user');
    setIsLoggedIn(status);
    if (userData) {
      setUsername(JSON.parse(userData).username);
    }
  }, []);

  if (isLoggedIn) {
    return (
      <SidebarCard title={t('sidebar.account')} defaultExpanded={true}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-lg bg-brand-accent/20 flex items-center justify-center text-brand-accent">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-500 uppercase tracking-widest">{t('sidebar.logged_as')}</span>
              <span className="text-sm font-bold text-white">{username}</span>
            </div>
          </div>
          <a href={l('/account')} className="w-full bg-brand-accent text-brand-bg font-black uppercase tracking-widest text-xs py-3 rounded-lg text-center hover:scale-[1.02] transition-transform">
            {t('sidebar.dashboard')}
          </a>
        </div>
      </SidebarCard>
    );
  }

  return (
    <SidebarCard title={t('sidebar.login_register')} defaultExpanded={true}>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <a href={l('/login')} className="w-full bg-brand-bg/50 border border-brand-accent/50 text-brand-accent font-medium py-2 px-4 rounded-lg flex items-center justify-between hover:bg-brand-accent/10 transition-colors">
            <span>{t('sidebar.login')}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        <div className="flex flex-col gap-1 text-sm text-gray-400">
          <a href={l('/register')} className="hover:text-brand-accent font-medium">{t('sidebar.new_account')}</a>
          <a href="#" className="hover:text-brand-accent font-medium">{t('sidebar.recovery')}</a>
        </div>
      </div>
    </SidebarCard>
  );
};

export const TopPlayers: React.FC<SidebarProps> = ({ lang }) => {
  const t = useTranslations(lang);
  const players = [
    { name: 'Sylarnal', score: 5 },
    { name: 'Zaps', score: 3 }
  ];

  return (
    <SidebarCard 
      title={t('sidebar.top_players')} 
      icon={
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      }
    >
      <div className="flex flex-col gap-3">
        {players.map((player, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-[10px] text-gray-400 font-bold">
                {i + 1}
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{player.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-brand-pokemon-gold rounded-full flex items-center justify-center text-[10px] text-brand-bg font-bold animate-pulse">$</div>
            </div>
          </div>
        ))}
      </div>
    </SidebarCard>
  );
};

export const ServerInfo: React.FC<SidebarProps> = ({ lang }) => {
  const t = useTranslations(lang);
  const l = useLocalizedPath(lang);

  return (
    <SidebarCard 
      title={t('sidebar.server_info')} 
      icon={
        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <span className="text-xs uppercase font-bold text-green-500">{t('sidebar.status')}</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-xs font-bold text-green-400">{t('sidebar.online')}</span>
          </div>
        </div>
        <a 
          href={l('/online-players')} 
          className="flex items-center justify-between px-2 py-1 relative group overflow-hidden rounded-lg hover:bg-white/5 transition-colors"
        >
          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{t('sidebar.players_online')}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-brand-accent tracking-widest group-hover:scale-110 transition-transform">07</span>
            <svg className="w-3 h-3 text-brand-accent/50 group-hover:text-brand-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>
    </SidebarCard>
  );
};

export const RequirementsCard: React.FC<SidebarProps> = ({ lang }) => {
  return (
    <SidebarCard 
      title="System Requirements" 
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
    >
      <ul className="space-y-3 text-sm text-gray-400">
        <li className="flex justify-between">
          <span>OS:</span>
          <span className="text-white">Windows 7/8/10/11</span>
        </li>
        <li className="flex justify-between">
          <span>RAM:</span>
          <span className="text-white">2GB (Recommended 4GB)</span>
        </li>
        <li className="flex justify-between">
          <span>Disk Space:</span>
          <span className="text-white">500MB</span>
        </li>
        <li className="flex justify-between">
          <span>Graphics:</span>
          <span className="text-white">DirectX 9.0c equivalent</span>
        </li>
      </ul>
    </SidebarCard>
  );
};
