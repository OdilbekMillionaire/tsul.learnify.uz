import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HomeProps {
  currentLang: Language;
  onStartClick: () => void;
}

export const Home: React.FC<HomeProps> = ({ currentLang, onStartClick }) => {
  const t = TRANSLATIONS[currentLang];
  const l = t.landing;

  const heroImages = [
    "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=2070&auto=format&fit=crop", // Library
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2072&auto=format&fit=crop", // Gavel/Justice
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop", // Students
    "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop", // Modern Building
    "https://images.unsplash.com/photo-1575505586569-646b2ca898fc?q=80&w=2070&auto=format&fit=crop", // Pillars/Architecture
    "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop", // Lecture Hall
    "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=2070&auto=format&fit=crop"  // Scales of Justice
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-navy-900 text-white overflow-hidden min-h-[600px] flex items-center">
        {/* Background Image Carousel & Overlay */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((src, index) => (
             <img 
               key={index}
               src={src} 
               alt="Background" 
               className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
             />
          ))}

          {/* Lightened Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/60 to-transparent"></div>
          
          {/* AI Tech Pattern Overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" 
               style={{ 
                 backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
               }}>
          </div>
        </div>

        {/* Abstract Shapes for Tech Feel */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-600 to-transparent opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-600 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10 w-full">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-gold-400 text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-sm shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
              Learnify Platform v1.2
            </div>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-8 tracking-tight drop-shadow-sm text-white">
              {l.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-slate-100 leading-relaxed mb-10 max-w-2xl font-light drop-shadow-md">
              {l.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onStartClick}
                className="bg-gold-600 hover:bg-gold-500 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-gold-500/20 transition-all transform hover:-translate-y-1 flex items-center gap-3"
              >
                {l.cta}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroImages.map((_, index) => (
                <button 
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'}`}
                />
            ))}
        </div>
      </div>

      {/* Trust Badge Bar - Slimmer with more items */}
      <div className="bg-white border-b border-slate-100 py-3 relative z-20 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-nowrap md:flex-wrap gap-8 md:gap-12 items-center min-w-max md:min-w-0 justify-start md:justify-center text-slate-400 font-bold text-[10px] md:text-xs tracking-widest uppercase">
           
           <span className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
             <div className="p-1 bg-slate-100 rounded-full"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z"/></svg></div>
             TSUL Standard
           </span>
           
           <span className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
             <div className="p-1 bg-slate-100 rounded-full"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
             Gemini 3 Pro
           </span>

           <span className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
             <div className="p-1 bg-slate-100 rounded-full"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></div>
             Global Access
           </span>

           <span className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
             <div className="p-1 bg-slate-100 rounded-full"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>
             LexUZ Integration
           </span>

           <span className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
             <div className="p-1 bg-slate-100 rounded-full"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div>
             Data Privacy
           </span>
           
           <span className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
             <div className="p-1 bg-slate-100 rounded-full"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg></div>
             Academic Integrity
           </span>

        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-10 bg-white rounded-2xl border border-slate-200 hover:border-gold-300 hover:shadow-xl hover:shadow-gold-500/5 transition-all group duration-300">
            <div className="w-14 h-14 bg-navy-50 rounded-xl flex items-center justify-center mb-8 group-hover:bg-navy-900 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-navy-900 group-hover:text-gold-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
               </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-4">{l.feature1Title}</h3>
            <p className="text-slate-600 leading-relaxed">{l.feature1Text}</p>
          </div>

          {/* Feature 2 */}
          <div className="p-10 bg-white rounded-2xl border border-slate-200 hover:border-gold-300 hover:shadow-xl hover:shadow-gold-500/5 transition-all group duration-300">
            <div className="w-14 h-14 bg-navy-50 rounded-xl flex items-center justify-center mb-8 group-hover:bg-navy-900 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-navy-900 group-hover:text-gold-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
               </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-4">{l.feature2Title}</h3>
            <p className="text-slate-600 leading-relaxed">{l.feature2Text}</p>
          </div>

          {/* Feature 3 */}
          <div className="p-10 bg-white rounded-2xl border border-slate-200 hover:border-gold-300 hover:shadow-xl hover:shadow-gold-500/5 transition-all group duration-300">
             <div className="w-14 h-14 bg-navy-50 rounded-xl flex items-center justify-center mb-8 group-hover:bg-navy-900 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-navy-900 group-hover:text-gold-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S13.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-15.686 0A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253m0 0A11.953 11.953 0 0112 10.5c2.998 0 5.74 1.1 7.843 2.918" />
               </svg>
            </div>
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-4">{l.feature3Title}</h3>
            <p className="text-slate-600 leading-relaxed">{l.feature3Text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};