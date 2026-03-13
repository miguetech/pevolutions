import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocalizedPath } from '@/i18n/utils';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

const Hero: React.FC<Props> = ({ lang }) => {
  const t = useTranslations(lang);
  const l = useLocalizedPath(lang);

  return (
    <div className="glass-card overflow-hidden relative">
      {/* Hero Background */}
      <div className="relative h-[500px] bg-gradient-to-br from-electric/20 via-water/10 to-fire/20 flex items-center justify-center overflow-hidden">
        
        {/* Floating Pokéballs */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="pokeball-float" style={{ top: '10%', left: '10%', animationDelay: '0s' }}>⚪</div>
          <div className="pokeball-float" style={{ top: '60%', left: '80%', animationDelay: '1s' }}>⚪</div>
          <div className="pokeball-float" style={{ top: '80%', left: '20%', animationDelay: '2s' }}>⚪</div>
          <div className="pokeball-float" style={{ top: '30%', right: '15%', animationDelay: '1.5s' }}>⚪</div>
        </div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center px-6 space-y-6"
        >
          <div className="inline-block">
            <motion.h1 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-7xl font-black uppercase tracking-tighter text-white drop-shadow-2xl"
            >
              P<span className="text-electric">E</span>volutions
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-2 mt-2"
            >
              <span className="px-3 py-1 bg-fire/80 text-white text-xs font-bold uppercase rounded-full backdrop-blur-sm">
                Beta
              </span>
              <span className="px-3 py-1 bg-grass/80 text-white text-xs font-bold uppercase rounded-full backdrop-blur-sm">
                Online
              </span>
            </motion.div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto font-medium"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-4 pt-4"
          >
            <a href={l('/register')} className="btn-primary">
              🎮 {t('hero.button')}
            </a>
            <a href={l('/downloads')} className="btn-secondary">
              📥 Download
            </a>
          </motion.div>
        </motion.div>

        {/* Bottom Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-transparent to-transparent pointer-events-none"></div>
      </div>

      {/* Features Section */}
      <div className="p-8 space-y-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white"
        >
          {t('hero.welcome')}
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard 
            icon="🗺️"
            title={t('hero.map')}
            description="Explore vast regions"
            delay={0}
          />
          <FeatureCard 
            icon="⚔️"
            title={t('hero.kanto')}
            description="Battle trainers worldwide"
            delay={0.1}
          />
          <FeatureCard 
            icon="👥"
            title="Community"
            description="Join thousands of players"
            delay={0.2}
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ 
  icon: string; 
  title: string; 
  description: string;
  delay?: number;
}> = ({ icon, title, description, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.05, y: -8 }}
    className="feature-card cursor-pointer"
  >
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="feature-card-icon"
    >
      {icon}
    </motion.div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </motion.div>
);

export default Hero;
