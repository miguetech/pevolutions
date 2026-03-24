import React from 'react';
import DownloadCard from './DownloadCard';
import { useTranslations } from '../i18n/utils';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

const Downloads: React.FC<Props> = ({ lang }) => {
  const t = useTranslations(lang);

  const downloadSources = [
    {
      name: 'MEGA',
      description: t('downloads.mega_desc'),
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-4.5l-2.5 3.5L4 11.5V16H2V8h2l2.5 3.5L9 8h2v8zm8 0h-2v-4.5l-2.5 3.5-2.5-3.5V16h-2V8h2l2.5 3.5L17 8h2v8z"/>
        </svg>
      ),
      url: '#',
      recommended: true
    },
    {
      name: 'MediaFire',
      description: t('downloads.mediafire_desc'),
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
        </svg>
      ),
      url: '#'
    },
    {
      name: 'Google Drive',
      description: t('downloads.gdrive_desc'),
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
        </svg>
      ),
      url: '#'
    }
  ];

  return (
    <div className="space-y-16">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-black uppercase tracking-tighter text-white">
          {t('downloads.title')} <span className="text-brand-accent">PEvolutions</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {t('downloads.subtitle')}
        </p>
      </header>

      <div className="flex flex-col gap-12 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-14">
        {downloadSources.map((source, index) => (
          <DownloadCard key={index} {...source} />
        ))}
      </div>

      <div className="glass-card p-8 border-brand-pokemon-gold/30 mt-12">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-brand-pokemon-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('downloads.guide')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="text-brand-pokemon-gold font-black text-2xl">01</div>
            <p className="text-sm text-gray-300">{t('downloads.step1')}</p>
          </div>
          <div className="space-y-2">
            <div className="text-brand-pokemon-gold font-black text-2xl">02</div>
            <p className="text-sm text-gray-300">{t('downloads.step2')}</p>
          </div>
          <div className="space-y-2">
            <div className="text-brand-pokemon-gold font-black text-2xl">03</div>
            <p className="text-sm text-gray-300">{t('downloads.step3')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
