import React, { useState, useEffect } from 'react';
import { useUpdateSettings } from '../hooks/useUpdateSettings';
import { useAccountData } from '../hooks/useAccountData';
import { CountrySelector } from '@/shared/components/navigation/CountrySelector';
import type { useTranslations } from '@/i18n/utils';

interface Props {
  t: ReturnType<typeof useTranslations>;
}

export const SettingsForm: React.FC<Props> = ({ t }) => {
  const { data: accountData, isLoading } = useAccountData();
  const [email, setEmail] = useState('');
  const [flag, setFlag] = useState('');
  const { mutate, isPending, isError, error, isSuccess } = useUpdateSettings();

  useEffect(() => {
    if (accountData) {
      setEmail(accountData.email || '');
      setFlag(accountData.flag || '');
    }
  }, [accountData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, flag });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">⚙️ {t('account.settings_title')}</h3>
        <p className="text-gray-400">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">⚙️ {t('account.settings_title')}</h3>

      {isSuccess && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded">
          <p className="text-green-400 text-sm">✅ {t('account.settings_success')}</p>
        </div>
      )}

      {isError && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded">
          <p className="text-red-400 text-sm">
            {error instanceof Error ? error.message : t('account.settings_error')}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('account.settings_email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            placeholder={email || t('account.settings_email_placeholder')}
          />
          {!accountData?.email && (
            <p className="text-xs text-gray-500 mt-1">⚠️ {t('account.settings_email_placeholder')}</p>
          )}
        </div>

        <div>
          <CountrySelector
            label={t('account.settings_country')}
            placeholder={flag ? t('form.select_country') : t('account.settings_country_placeholder')}
            value={flag}
            onChange={setFlag}
          />
          {!accountData?.flag && (
            <p className="text-xs text-gray-500 mt-1">⚠️ {t('account.settings_country_placeholder')}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium"
        >
          {isPending ? t('account.settings_saving') : t('account.settings_save')}
        </button>
      </form>
    </div>
  );
};
