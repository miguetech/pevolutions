import React, { useState } from 'react';
import { useLocalizedPath, useTranslations } from '../i18n/utils';
import { CountrySelector } from './CountrySelector';

interface AuthFormProps {
  type: 'login' | 'register';
  lang: 'en' | 'es' | 'pt';
}

export const AuthForm: React.FC<AuthFormProps> = ({ type, lang }) => {
  const isLogin = type === 'login';
  const l = useLocalizedPath(lang);
  const t = useTranslations(lang);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Mock Login
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.username === username && user.password === password) {
          localStorage.setItem('isLoggedIn', 'true');
          window.location.href = l('/account');
          return;
        }
      }
      setError('Invalid username or password.');
    } else {
      // Mock Register
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!country) {
        setError('Please select a country.');
        return;
      }
      const user = { username, email, password, country: country };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = l('/account');
    }
  };

  return (
    <div className="glass-card p-8 w-full max-w-md mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-black text-white mb-8 text-center uppercase tracking-tighter italic">
        {isLogin ? 'Welcome ' : 'Create '}
        <span className="text-brand-accent">{isLogin ? 'Back' : 'Account'}</span>
      </h2>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Username</label>
          <input 
            type="text" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-accent/50 transition-all font-medium"
          />
        </div>

        {!isLogin && (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-accent/50 transition-all font-medium"
              />
            </div>

            <CountrySelector 
              label={t('form.country')}
              placeholder={t('form.select_country')}
              value={country}
              onChange={setCountry}
            />
          </>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-accent/50 transition-all font-medium"
          />
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-accent/50 transition-all font-medium"
            />
          </div>
        )}

        {isLogin && (
          <div className="flex justify-end">
            <a href="#" className="text-xs font-bold text-brand-accent/70 hover:text-brand-accent transition-colors">Forgot password?</a>
          </div>
        )}

        <button type="submit" className="w-full relative group overflow-hidden bg-brand-accent text-brand-bg font-black uppercase tracking-widest py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
          <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-white/5 text-center">
        <p className="text-sm font-medium text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <a href={isLogin ? l("/register") : l("/login")} className="text-brand-accent hover:text-brand-accent/80 transition-colors font-black uppercase tracking-wider text-xs ml-1">
            {isLogin ? 'Sign up now' : 'Log in here'}
          </a>
        </p>
      </div>
    </div>
  );
};
