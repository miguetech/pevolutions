import { useTranslations } from '../i18n/utils';

interface SupportMember {
  name: string;
  role: string;
  avatar: string;
  availability: string;
  languages: string[];
}

interface SupportProps {
  lang: 'en' | 'es' | 'pt';
}

const Support: React.FC<SupportProps> = ({ lang }) => {
  const t = useTranslations(lang);

  const members: SupportMember[] = [
    {
      name: 'Admin_Sylarnal',
      role: lang === 'en' ? 'Head Administrator' : lang === 'es' ? 'Administrador Principal' : 'Administrador Principal',
      avatar: 'https://img.pokemondb.net/sprites/black-white/anim/normal/charizard.gif',
      availability: '10:00 - 22:00 UTC',
      languages: ['ES', 'EN']
    },
    {
      name: 'MistyTrainer',
      role: lang === 'en' ? 'Support Moderator' : lang === 'es' ? 'Moderador de Soporte' : 'Moderador de Suporte',
      avatar: 'https://img.pokemondb.net/sprites/black-white/anim/normal/starmie.gif',
      availability: '14:00 - 02:00 UTC',
      languages: ['EN', 'PT']
    },
    {
      name: 'BrockSolid',
      role: lang === 'en' ? 'Technical Support' : lang === 'es' ? 'Soporte Técnico' : 'Suporte Técnico',
      avatar: 'https://img.pokemondb.net/sprites/black-white/anim/normal/golem.gif',
      availability: '08:00 - 18:00 UTC',
      languages: ['ES', 'PT']
    }
  ];

  const socialLinks = [
    { name: 'Discord', url: '#', icon: '💬', color: 'bg-indigo-600', desc: t('support.discord_desc') },
    { name: 'WhatsApp', url: '#', icon: '📱', color: 'bg-green-600', desc: t('support.whatsapp_desc') },
    { name: 'Email', url: 'mailto:support@pevolutions.com', icon: '✉️', color: 'bg-red-600', desc: 'support@pevolutions.com' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
          {t('support.title').split(' ')[0]} <span className="text-brand-accent">{t('support.title').split(' ').slice(1).join(' ')}</span>
        </h2>
        <div className="h-1.5 w-24 bg-brand-accent rounded-full"></div>
        <p className="text-gray-400 max-w-2xl text-lg">
          {t('support.subtitle')}
        </p>
      </div>

      {/* Social Support Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {socialLinks.map((link) => (
          <a 
            key={link.name} 
            href={link.url}
            className="glass-card p-6 flex flex-col gap-4 hover:border-brand-accent/30 transition-all group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${link.color} opacity-5 blur-3xl -mr-8 -mt-8`}></div>
            <div className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
              {link.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{link.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{link.desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Support Staff Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-white uppercase italic tracking-wider flex items-center gap-3">
          <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
          {t('support.staff_title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, i) => (
            <div key={i} className="glass-card p-6 space-y-4 group hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-bg border border-white/10 flex items-center justify-center overflow-hidden">
                  <img src={member.avatar} alt={member.name} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{member.name}</h4>
                  <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest">{member.role}</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-gray-500 text-[10px]">{lang === 'es' ? 'Disponibilidad' : lang === 'pt' ? 'Disponibilidade' : 'Availability'}</span>
                  <span className="text-gray-300">{member.availability}</span>
                </div>
                <div className="flex gap-2">
                  {member.languages.map(lang => (
                    <span key={lang} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black text-gray-400">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full py-2 bg-brand-accent/10 border border-brand-accent/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-accent hover:bg-brand-accent hover:text-brand-bg transition-all">
                {t('support.send_dm')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Quick Link */}
      <div className="p-8 glass-card border-dashed border-white/10 text-center items-center justify-center flex flex-col gap-4 bg-white/[0.01]">
        <h4 className="text-lg font-bold text-white">{t('support.faq_title')}</h4>
        <p className="text-sm text-gray-400 max-w-lg">
          {t('support.faq_desc')}
        </p>
        <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
          {t('support.faq_button')}
        </button>
      </div>
    </div>
  );
};

export default Support;
