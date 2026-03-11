import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom, userAtom } from '@/auth/stores/authAtoms';
import { useLocalizedPath, useTranslations } from '@/i18n/utils';
import { useAuth } from '@/auth/hooks/useAuth';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

type Tab = 'dashboard' | 'create-char' | 'change-pwd' | 'settings' | 'donations';

const AuthenticatedAccount: React.FC<Props> = ({ lang }) => {
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const l = useLocalizedPath(lang);
  const t = useTranslations(lang);

  useEffect(() => {
    if (!token) {
      window.location.href = l('/login');
    } else {
      setLoading(false);
    }
  }, [token, l]);

  const handleLogout = () => {
    logout();
    window.location.href = l('/');
  };

  if (loading) return <div className="text-white text-center py-12">Loading...</div>;
  if (!token) return null;

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
          <span className="text-brand-accent">{activeTab === 'dashboard' ? 'Account' : ''}</span>
        </h2>
        <p className="text-gray-400">
          Welcome back, <span className="text-white font-bold">{user?.name || 'User'}</span>
        </p>
      </div>

      {/* Menu */}
      <div className="flex flex-wrap gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as Tab)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              activeTab === item.id
                ? 'bg-brand-accent text-brand-bg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg font-bold text-sm bg-red-600 text-white hover:bg-red-700 transition-all ml-auto"
        >
          🚪 Logout
        </button>
      </div>

      {/* Content */}
      <div className="bg-gray-800 rounded-lg p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Account Name</p>
                <p className="text-white font-bold text-xl">{user?.name}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-bold text-xl">{user?.email}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-green-400 font-bold text-xl">Active</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'create-char' && (
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-4">Create Character</h3>
            <p className="text-gray-400">Character creation coming soon...</p>
          </div>
        )}

        {activeTab === 'change-pwd' && (
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-4">Change Password</h3>
            <p className="text-gray-400">Password change coming soon...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-4">Settings</h3>
            <p className="text-gray-400">Settings coming soon...</p>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-4">Donations</h3>
            <p className="text-gray-400">Donation system coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticatedAccount;
