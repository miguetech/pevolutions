import React from 'react';
import { useTranslations } from '../i18n/utils';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

const Hero: React.FC<Props> = ({ lang }) => {
  const t = useTranslations(lang);

  return (
    <div className="glass-card overflow-hidden">
      {/* Background/Art Section */}
      <div className="relative h-96 bg-gradient-to-br from-brand-accent/30 to-brand-primary/10 flex items-center justify-center overflow-hidden">
        {/* Abstract "Vaporeon" shape/placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-50">
          <svg className="w-96 h-96 text-brand-accent/20 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
          </svg>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
            PEvolutions <span className="text-brand-accent">BETA</span>
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        <h2 className="text-3xl font-bold text-white mb-4">{t('hero.welcome')}</h2>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {t('hero.description')}
        </p>

        <ul className="space-y-4 mb-8">
          <li className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
            </div>
            <p className="text-gray-300">
              {t('hero.map')}
            </p>
          </li>
          <li className="flex items-start gap-4">
            <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-2 h-2 rounded-full bg-brand-accent"></div>
            </div>
            <p className="text-gray-300">
              {t('hero.kanto')}
            </p>
          </li>
        </ul>

        <button className="btn-primary flex items-center gap-2">
          <span>{t('hero.button')}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Hero;
