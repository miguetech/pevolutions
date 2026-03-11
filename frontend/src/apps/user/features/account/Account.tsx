import React, { useEffect, useState, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '@/auth/stores/authAtoms';
import { useAuth } from '@/auth/hooks/useAuth';
import { useLocalizedPath, useTranslations } from '@/i18n/utils';
import { AccountStats } from './components/AccountStats';
import { SettingsForm } from './components/SettingsForm';
import { PlayersList } from '@/apps/user/features/players/components/PlayersList';
import { CreatePlayerForm } from '@/apps/user/features/players/components/CreatePlayerForm';
import { ChangePasswordForm } from '@/auth/components/ChangePasswordForm';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

type Tab = 'dashboard' | 'create-char' | 'change-pwd' | 'settings' | 'donations';

const Account: React.FC<Props> = ({ lang }) => {
  const token = useAtomValue(tokenAtom);
  const userData = useAtomValue(userAtom);
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const l = useLocalizedPath(lang);
  const t = useTranslations(lang);

  useEffect(() => {
    if (!token) {
      window.location.href = l('/login');
    }
  }, [token, l]);

  const handleLogout = () => {
    logout();
    window.location.href = l('/');
  };

  if (!token || !userData) return null;

  const user = {
    username: userData.name || 'User',
    email: userData.email || '',
    country: userData.flag || '',
  };

  const menuItems = [
    { id: 'dashboard', label: t('account.dashboard'), icon: '👤' },
    { id: 'create-char', label: t('account.create_char'), icon: '⚔️' },
    { id: 'change-pwd', label: t('account.change_pwd'), icon: '🔑' },
    { id: 'settings', label: t('account.settings'), icon: '⚙️' },
    { id: 'donations', label: t('account.donate'), icon: '💎' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
          {activeTab === 'dashboard' ? 'My ' : activeTab.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') + ' '}
          <span className="text-brand-accent">
            {activeTab === 'dashboard' ? 'Account' : ''}
          </span>
        </h2>
        <div className="h-1.5 w-24 bg-brand-accent rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sidebar & Profile */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Quick Info */}
          <div className="glass-card p-6 flex items-center gap-4 relative overflow-hidden bg-white/[0.02]">
            <div className="w-16 h-16 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center shrink-0">
              <span className="text-3xl">🧑‍🚀</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('account.welcome')}</p>
              <h3 className="text-xl font-black text-white">{user.username}</h3>
            </div>
          </div>

          {/* Sidebar Menu */}
          <div className="glass-card p-2 space-y-1 bg-white/[0.01]">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-brand-accent text-brand-bg shadow-[0_0_15px_rgba(0,243,255,0.2)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="uppercase tracking-wider">{item.label}</span>
                {activeTab === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-bg shadow-sm"></div>
                )}
              </button>
            ))}
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-all duration-300 mt-4 border-t border-white/5 pt-6"
            >
              <span className="text-lg">🚪</span>
              <span className="uppercase tracking-wider">{t('account.logout')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Content Area */}
        <div className="lg:col-span-8">
          {activeTab === 'dashboard' && <DashboardView user={user} t={t} />}
          {activeTab === 'create-char' && <CreateCharView t={t} />}
          {activeTab === 'donations' && <DonationsView t={t} />}
          {activeTab === 'change-pwd' && <SettingsView type="password" t={t} />}
          {activeTab === 'settings' && <SettingsView type="general" t={t} />}
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Views --- */

const DashboardView = ({ user, t }: { user: any, t: any }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <AccountStats />
    <PlayersList />
  </div>
);

const CreateCharView = ({ t }: { t: any }) => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
    <CreatePlayerForm />
  </div>
);

const DonationsView = ({ t }: { t: any }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    {/* Disclaimer */}
    <div className="glass-card p-8 border-none bg-brand-accent/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent opacity-10 blur-3xl -mr-16 -mt-16"></div>
      <div className="relative space-y-4">
        <h4 className="text-xl font-black text-brand-accent uppercase tracking-tighter italic flex items-center gap-3">
          ⚠️ {t('account.donate_disclaimer')}
        </h4>
        <p className="text-sm text-gray-300 leading-relaxed font-medium">
          {t('account.donate_text')}
        </p>
      </div>
    </div>

    {/* Pricing Table */}
    <div className="glass-card overflow-hidden border-white/5">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5">
          <tr className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Points</th>
            <th className="px-6 py-4">Bonus</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {[
            { price: '5(USD)', points: 10, bonus: '0%', color: 'text-white' },
            { price: '10(USD)', points: 20, bonus: '0%', color: 'text-white' },
            { price: '25(USD)', points: 60, bonus: '+20%', color: 'text-brand-accent' },
            { price: '50(USD)', points: 130, bonus: '+30%', color: 'text-brand-pokemon-gold' },
            { price: '100(USD)', points: 280, bonus: '+40%', color: 'text-brand-accent font-black brightness-125' },
          ].map((item, i) => (
            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-5 font-bold text-white uppercase text-sm">{item.price}</td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-pokemon-gold/10 flex items-center justify-center text-[10px]">✨</span>
                  <span className="text-lg font-black text-brand-pokemon-gold">{item.points}</span>
                </div>
              </td>
              <td className={`px-6 py-5 text-xs font-black uppercase tracking-widest ${item.color}`}>{item.bonus}</td>
              <td className="px-6 py-5 text-right">
                <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white hover:bg-brand-accent hover:border-brand-accent hover:text-brand-bg transition-all group-hover:scale-105">
                  Buy Now
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SettingsView = ({ type, t }: { type: 'password' | 'general', t: any }) => (
  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
    {type === 'password' ? (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🔑 Change Password</h3>
        <ChangePasswordForm onSuccess={() => alert('Password changed successfully!')} />
      </div>
    ) : (
      <SettingsForm />
    )}
  </div>
);

export default Account;
