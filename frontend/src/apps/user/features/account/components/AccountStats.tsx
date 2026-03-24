import React from 'react';
import { useAccountStats } from '../hooks/useAccountStats';
import type { useTranslations } from '@/i18n/utils';

interface Props {
  t: ReturnType<typeof useTranslations>;
}

export const AccountStats: React.FC<Props> = ({ t }) => {
  const { data, isLoading, isError } = useAccountStats();

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">{t('account.stats_title')}</h3>
        <p className="text-gray-400">{t('common.loading')}</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">{t('account.stats_title')}</h3>
        <p className="text-red-400">{t('common.failed_load')}</p>
      </div>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    return `${hours.toLocaleString()}h`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">📊 {t('account.stats_title')}</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">⏱️ {t('account.stats_playing_time')}</span>
          <span className="font-semibold">{formatTime(data.total_playing_time)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">🎮 {t('account.stats_pokemon_caught')}</span>
          <span className="font-semibold">{data.pokemon_caught.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">🏆 {t('account.stats_world_ranking')}</span>
          <span className="font-semibold">#{data.world_ranking.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
