import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/authAPI';
import { useAuth } from '@/auth/hooks/useAuth';
import { CountrySelector } from '@/shared/components/navigation/CountrySelector';
import { useTranslations } from '@/i18n/utils';

interface RegisterFormProps {
  onSuccess?: () => void;
  lang?: 'en' | 'es' | 'pt';
}

export function RegisterForm({ onSuccess, lang = 'es' }: RegisterFormProps) {
  const t = useTranslations(lang);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [flag, setFlag] = useState('');
  const [acceptRules, setAcceptRules] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = useMutation({
    mutationFn: () => authAPI.register({ name, email, password, flag }),
    onSuccess: () => {
      onSuccess?.();
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = t('register.name_required');
    }
    
    if (!email.trim()) {
      newErrors.email = t('register.email_required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('register.email_invalid');
    }
    
    if (!password) {
      newErrors.password = t('register.password_required');
    } else if (password.length < 6) {
      newErrors.password = t('register.password_min');
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = t('register.password_mismatch');
    }

    if (!flag) {
      newErrors.flag = t('register.country_required');
    }

    if (!acceptRules) {
      newErrors.acceptRules = t('register.rules_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    registerMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          {t('register.account_name')}
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          {t('register.email')}
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
        {errors.email && (
          <p className="text-red-400 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <CountrySelector
          label={t('form.country')}
          placeholder={t('form.select_country')}
          value={flag}
          onChange={setFlag}
        />
        {errors.flag && (
          <p className="text-red-400 text-sm mt-1">{errors.flag}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          {t('register.password')}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          {t('register.confirm_password')}
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <input
          id="acceptRules"
          type="checkbox"
          checked={acceptRules}
          onChange={(e) => setAcceptRules(e.target.checked)}
          className="mt-1"
        />
        <label htmlFor="acceptRules" className="text-sm text-gray-300">
          {t('register.accept_rules')}
        </label>
      </div>
      {errors.acceptRules && (
        <p className="text-red-400 text-sm">{errors.acceptRules}</p>
      )}

      {registerMutation.error && (
        <p className="text-red-400 text-sm">{t('register.error')}</p>
      )}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-white font-medium"
      >
        {registerMutation.isPending ? t('register.loading') : t('nav.register')}
      </button>
    </form>
  );
}
