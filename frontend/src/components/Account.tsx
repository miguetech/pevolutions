import React, { useEffect, useState, useRef } from 'react';
import { useLocalizedPath, useTranslations } from '../i18n/utils';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

type Tab = 'dashboard' | 'create-char' | 'change-pwd' | 'settings' | 'donations';

const Account: React.FC<Props> = ({ lang }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const l = useLocalizedPath(lang);
  const t = useTranslations(lang);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('user');

    if (isLoggedIn === 'true' && userData) {
      setUser(JSON.parse(userData));
    } else {
      window.location.href = l('/login');
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = l('/');
  };

  if (loading) return null;
  if (!user) return null;

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
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[
        { label: 'Total Playing', value: '12h 45m', color: 'text-blue-400', icon: '⏱️' },
        { label: 'Pokémon Caught', value: '1,240', color: 'text-brand-pokemon-gold', icon: '🎒' },
        { label: 'World Ranking', value: '#4,520', color: 'text-brand-accent', icon: '🏆' }
      ].map((stat, i) => (
        <div key={i} className="glass-card p-6 border-none bg-white/[0.02] flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="text-2xl">{stat.icon}</span>
            <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
          </div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
        </div>
      ))}
    </div>

    {/* Character List (New) */}
    <div className="space-y-4">
      <h4 className="text-lg font-black text-white uppercase italic tracking-wider flex items-center gap-3">
        <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
        My Characters
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { name: 'Sylarnal', level: 85, gender: 'boy', icon: '🔥' },
          { name: 'PokeMaster', level: 12, gender: 'girl', icon: '⚡' }
        ].map((char, i) => (
          <div key={i} className="glass-card p-4 flex items-center gap-4 group cursor-pointer hover:border-brand-accent/30 transition-all bg-white/[0.01]">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">{char.icon}</div>
            <div className="flex-1">
              <h5 className="font-black text-white text-base leading-none">{char.name}</h5>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black text-gray-500 uppercase">Lv. {char.level}</span>
                <span className={`text-[10px] font-bold ${char.gender === 'boy' ? 'text-blue-400' : 'text-pink-400'}`}>
                  {char.gender === 'boy' ? 'Boy' : 'Girl'}
                </span>
              </div>
            </div>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-brand-accent/20 text-gray-500 hover:text-brand-accent transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        ))}
        <button className="glass-card p-4 border-dashed border-white/10 flex items-center justify-center gap-3 text-gray-500 hover:text-white hover:border-brand-accent/30 transition-all bg-transparent group">
          <span className="text-xl group-hover:rotate-90 transition-transform">+</span>
          <span className="text-sm font-black uppercase tracking-widest">Create Character</span>
        </button>
      </div>
    </div>
  </div>
);

const CreateCharView = ({ t }: { t: any }) => (
  <div className="glass-card p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="space-y-2">
      <h3 className="text-2xl font-black text-white uppercase italic">{t('account.create_char')}</h3>
      <p className="text-sm text-gray-400">Choose your name and gender to begin your adventure.</p>
    </div>

    <form className="max-w-md space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-3">
        <label className="flex items-center gap-3 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
          <div className="w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-[10px] text-brand-accent">🧬</div>
          {t('account.char_name')}
        </label>
        <input 
          type="text" 
          placeholder="Character name..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-accent/50 transition-all font-medium"
        />
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3 text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
          <div className="w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-[10px] text-brand-accent">⚧</div>
          {t('account.char_gender')}
        </label>
        <select className="w-full bg-brand-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50 transition-all font-medium appearance-none cursor-pointer">
          <option value="boy">{t('account.char_male')}</option>
          <option value="girl">{t('account.char_female')}</option>
        </select>
      </div>

      <button className="w-full py-4 bg-brand-accent text-brand-bg font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all">
        {t('account.char_submit')}
      </button>
    </form>
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

import { CountrySelector } from './CountrySelector';

const SettingsView = ({ type, t }: { type: 'password' | 'general', t: any }) => {
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (type === 'general') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCountry(user.country || '');
        setEmail(user.email || '');
      }
    }
  }, [type]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'general') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const updatedUser = { ...user, country, email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Settings saved!');
        window.location.reload(); 
      }
    }
  };

  return (
    <div className="glass-card p-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-white uppercase italic">
          {type === 'password' ? t('account.change_pwd') : t('account.settings')}
        </h3>
        <p className="text-sm text-gray-400">
          {type === 'password' ? 'Update your account security regularly.' : 'Manage your account preferences and info.'}
        </p>
      </div>

      <form className="max-w-md space-y-6" onSubmit={handleSave}>
        {type === 'password' ? (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50 transition-all" />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50 transition-all" 
              />
            </div>
            
            <CountrySelector 
              label={t('form.country')}
              placeholder={t('form.select_country')}
              value={country}
              onChange={setCountry}
            />

            <div className="flex items-center gap-4 p-4 glass-card bg-white/[0.02]">
              <input type="checkbox" id="newsletter" className="w-5 h-5 rounded border-white/10 bg-white/5 text-brand-accent focus:ring-brand-accent" />
              <label htmlFor="newsletter" className="text-sm text-gray-300 font-medium">Receive game updates and newsletters</label>
            </div>
          </>
        )}
        <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Account;
