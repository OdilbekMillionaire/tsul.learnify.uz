import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AboutProps {
  currentLang: Language;
}

export const About: React.FC<AboutProps> = ({ currentLang }) => {
  const t = TRANSLATIONS[currentLang];
  const c = t.aboutPage;

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 mb-6">{c.title}</h1>
        <div className="w-24 h-1 bg-gold-500 mx-auto mb-6 rounded-full"></div>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">{c.subtitle}</p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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

      {/* Developer Card */}
      <div className="bg-navy-900 rounded-3xl p-12 text-center relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="font-serif text-3xl font-bold text-white mb-6">{c.teamTitle}</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">{c.teamText}</p>
          
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm">
            <span className="text-gold-500 font-bold tracking-wide">
                {currentLang === Language.UZ_LATIN || currentLang === Language.UZ_CYRILLIC ? "Oxforder MCHJ" : "Oxforder LLC"}
            </span>
            <span className="text-slate-400 font-normal text-sm opacity-80">Official Release</span>
          </div>
        </div>
      </div>
    </div>
  );
};