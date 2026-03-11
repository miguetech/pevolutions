import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '@/auth/stores/authAtoms';
import SidebarCard from '@/shared/components/ui/SidebarCard';
import { useTranslations, useLocalizedPath } from '../i18n/utils';

interface SidebarProps {
  lang: 'en' | 'es' | 'pt';
}

export const AuthenticatedLoginBox: React.FC<SidebarProps> = ({ lang }) => {
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const t = useTranslations(lang);
  const l = useLocalizedPath(lang);
  const isLoggedIn = !!token;

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
              <span className="text-sm font-bold text-white">{user?.name || 'User'}</span>
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
        <a href={l('/login')} className="w-full bg-brand-accent text-brand-bg font-black uppercase tracking-widest text-xs py-3 rounded-lg text-center hover:scale-[1.02] transition-transform">
          {t('sidebar.login')}
        </a>
        <a href={l('/register')} className="w-full bg-white/10 text-white font-black uppercase tracking-widest text-xs py-3 rounded-lg text-center hover:bg-white/20 transition-colors">
          {t('sidebar.register')}
        </a>
      </div>
    </SidebarCard>
  );
};
