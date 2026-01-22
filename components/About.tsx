import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AboutProps {
  currentLang: Language;
}

export const About: React.FC<AboutProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const c = t.aboutPage;
  const d = c.developerSection;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 mb-6">{c.title}</h1>
        <div className="w-24 h-1 bg-gold-500 mx-auto mb-6 rounded-full"></div>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">{c.subtitle}</p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Mission */}
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6 text-orange-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
             </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4">{c.missionTitle}</h2>
          <p className="text-slate-600 leading-relaxed">{c.missionText}</p>
        </div>

        {/* AI Tech */}
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-navy-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
             </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4">{c.aiTitle}</h2>
          <p className="text-slate-600 leading-relaxed">{c.aiText}</p>
        </div>
      </div>

      {/* Redeveloped Developer Section */}
      <div className="bg-[#0f172a] rounded-3xl p-12 py-20 text-center relative overflow-hidden shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-block px-5 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 mb-8 backdrop-blur-sm">
             <span className="text-gold-500 text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
               {d.badge}
             </span>
          </div>

          {/* Title */}
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
             {d.titlePrefix} <span className="text-gold-500 drop-shadow-lg">{d.companyName}</span>
          </h2>
          
          {/* Description */}
          <p className="text-slate-400 text-lg max-w-3xl mx-auto mb-16 leading-relaxed font-light">
             {d.description}
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {d.cards.map((card, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col items-center hover:bg-white/10 transition-colors duration-300">
                   <div className="w-12 h-12 mb-6 flex items-center justify-center">
                      {card.icon === 'trophy' && (
                          <svg className="w-10 h-10 text-gold-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg> // Using a generic trophy-like icon path or similar
                      )}
                      {card.icon === 'academic' && (
                          <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.221 69.17 69.17 0 00-2.923.818M3 14.25l6-6.75l6 6.75" /></svg>
                      )}
                      {card.icon === 'rocket' && (
                          <svg className="w-10 h-10 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13.13 22.19l-1.63-3.83c-.15-.35-.05-.76.25-1.01l7.07-5.83c.27-.22.66-.17.87.1l1.58 2.05c.24.31.2.75-.08 1.03L14.15 22c-.25.26-.66.36-1.02.19zM6.9 14.21c-.28-.35-.23-.87.12-1.16l2.05-1.69c.35-.29.87-.23 1.16.12l1.69 2.05c.29.35.23.87-.12 1.16l-2.05 1.69c-.35.29-.87.23-1.16-.12L6.9 14.21z" /><path d="M12.9 2.1l6.4 5.2c.4.3.5.9.2 1.3l-5.2 6.4c-.3.4-.9.5-1.3.2L6.6 9.8c-.4-.3-.5-.9-.2-1.3l5.2-6.4c.3-.2.9-.3 1.3 0z" opacity=".3" /></svg>
                      )}
                   </div>
                   <h3 className="text-white font-bold text-lg mb-3">{card.title}</h3>
                   <p className="text-slate-400 text-sm font-medium opacity-80 leading-snug">{card.subtitle}</p>
                </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};