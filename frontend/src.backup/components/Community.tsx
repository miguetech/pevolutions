import React from 'react';
import { useTranslations } from '../i18n/utils';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  members: string;
}

interface Event {
  title: string;
  date: string;
  description: string;
  tag: 'Contest' | 'Tournament' | 'Update';
}

interface Props {
  lang: 'en' | 'es' | 'pt';
}

const Community: React.FC<Props> = ({ lang }) => {
  const t = useTranslations(lang);

  const socials: SocialLink[] = [
    {
      name: 'Discord',
      url: '#',
      members: '5,000+ Online',
      color: 'bg-[#5865F2]',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01 10.198 10.198 0 0 0 .372.292.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      url: '#',
      members: '12k Followers',
      color: 'bg-black',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: '#',
      members: '45k Subscribers',
      color: 'bg-[#FF0000]',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ];

  const upcomingEvents: Event[] = [
    {
      title: lang === 'es' ? 'Torneo Liga Cristal' : lang === 'pt' ? 'Torneio Liga Cristal' : 'Crystal League Tournament',
      date: 'Jan 20, 2026',
      description: lang === 'es' ? 'El torneo PvP definitivo para entrenadores nivel 50+. Lucha por la Copa de Cristal y 10,000 de Oro.' : lang === 'pt' ? 'O torneio PvP definitivo para treinadores de nível 50+. Battle for the Crystal Cup and 10,000 Gold.' : 'The ultimate PvP tournament for trainers level 50+. Battle for the Crystal Cup and 10,000 Gold.',
      tag: 'Tournament'
    },
    {
      title: lang === 'es' ? 'Avistamiento de Ave Legendaria' : lang === 'pt' ? 'Avistamento de Pássaro Lendário' : 'Legendary Bird Sighting',
      date: 'Jan 15, 2026',
      description: lang === 'es' ? 'Articuno ha sido visto cerca de los Picos Helados. Forma equipo con tu gremio para presenciar este evento.' : lang === 'pt' ? 'Articuno foi avistado perto dos Picos Congelados. Junte-se à sua guilda para testemunhar este evento.' : 'Articuno has been spotted near the Frozen Peaks. Team up with your guild to witness this event.',
      tag: 'Contest'
    },
    {
      title: lang === 'es' ? 'Parche de Rebalanceo' : lang === 'pt' ? 'Patch de Rebalanceamento' : 'Economy Rebalance Patch',
      date: 'Jan 10, 2026',
      description: lang === 'es' ? 'Actualización técnica centrada en la estabilidad del mercado y mejoras en el comercio.' : lang === 'pt' ? 'Atualização técnica focada na estabilidade do mercado e melhorias nas trocas.' : 'Technical update focusing on market stability and trading improvements.',
      tag: 'Update'
    }
  ];

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Community Hero */}
      <div className="relative overflow-hidden rounded-3xl glass-card border-none">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 to-purple-600/20 mix-blend-overlay"></div>
        <div className="relative p-8 md:p-12 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-brand-accent font-black uppercase tracking-[0.3em] text-sm">{t('community.hero_welcome')}</span>
            <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter italic leading-none">
              {t('community.hero_title_prefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-purple-400">{t('community.hero_title_suffix')}</span>
            </h2>
          </div>
          <p className="text-gray-300 max-w-xl text-lg leading-relaxed">
            {t('community.hero_desc')}
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <button className="px-8 py-3 bg-brand-accent text-brand-bg font-black uppercase tracking-widest text-sm rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.3)]">
              {t('community.join_discord')}
            </button>
            <button className="px-8 py-3 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-white/10 transition-all">
              {t('community.latest_news')}
            </button>
          </div>
        </div>
      </div>

      {/* Social Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {socials.map((social) => (
          <a 
            key={social.name} 
            href={social.url}
            className="group glass-card p-6 flex flex-col gap-4 hover:border-brand-accent/50 transition-all duration-300 overflow-hidden relative"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${social.name === 'Discord' ? 'bg-[#5865F2]' : social.name === 'YouTube' ? 'bg-[#FF0000]' : 'bg-white'} opacity-5 blur-3xl -mr-8 -mt-8 group-hover:opacity-10 transition-opacity`}></div>
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${social.color} shadow-lg`}>
                {social.icon}
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{social.members}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors">{social.name}</h3>
              <p className="text-sm text-gray-500">Official {social.name} channel</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-accent uppercase tracking-widest mt-2 group-hover:gap-4 transition-all">
              {t('community.visit')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </a>
        ))}
      </div>

      {/* Events & Features Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-12 bg-brand-accent"></div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-wider">{t('community.events_title')}</h3>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="glass-card p-5 group hover:bg-white/[0.03] transition-colors border-l-4 border-l-brand-accent">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                    event.tag === 'Tournament' ? 'bg-brand-pokemon-gold/20 text-brand-pokemon-gold' : 
                    event.tag === 'Contest' ? 'bg-blue-400/20 text-blue-400' : 'bg-green-400/20 text-green-400'
                  }`}>
                    {event.tag}
                  </span>
                  <span className="text-xs font-bold text-gray-500">{event.date}</span>
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors mb-2">{event.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Content / Guilds */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-12 bg-purple-500"></div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-wider">{t('community.guilds_title')}</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { name: 'Elite Four', members: 42, points: '1.2M', tag: 'Competitive' },
              { name: 'Shiny Hunters', members: 156, points: '890k', tag: 'Social' },
              { name: 'Dragon Slayers', members: 89, points: '750k', tag: 'Raid' }
            ].map((guild, i) => (
              <div key={i} className="glass-card p-5 flex items-center justify-between group cursor-pointer hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-black text-xl italic">
                    {guild.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{guild.name}</h4>
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{guild.tag}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-white">{guild.points}</div>
                  <div className="text-[10px] text-gray-500 uppercase font-bold">{guild.members} Members</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 glass-card border-dashed text-gray-400 font-bold uppercase tracking-widest text-sm hover:border-brand-accent/50 hover:text-white transition-all">
            {t('community.view_guilds')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Community;
