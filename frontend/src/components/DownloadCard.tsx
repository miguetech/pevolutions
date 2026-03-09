import React from 'react';

interface DownloadCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  recommended?: boolean;
}

const DownloadCard: React.FC<DownloadCardProps> = ({ name, description, icon, url, recommended }) => {
  return (
    <div className={`glass-card p-1 relative flex flex-col group transition-all duration-300 hover:scale-[1.02] ${recommended ? 'ring-2 ring-brand-accent/50' : ''}`}>
      {recommended && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-accent text-brand-bg text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider z-10 shadow-lg shadow-brand-accent/30">
          Recommended
        </span>
      )}
      
      <div className="p-8 flex flex-col items-center text-center gap-6 h-full">
        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-accent/10 transition-colors">
          {icon}
        </div>
        
        <div className="space-y-2 flex-grow">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>

        <a 
          href={url} 
          className="btn-primary w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 bg-brand-accent text-brand-bg hover:brightness-110 shadow-lg shadow-brand-accent/20"
        >
          <span>Download</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default DownloadCard;
