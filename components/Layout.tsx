import React, { useState, useRef, useEffect } from 'react';
import { Language, ViewState } from '../types';
import { TRANSLATIONS } from '../constants';
import { ThemeToggle } from './ThemeToggle';
import { formatCredits } from '../services/creditEstimator';

interface LayoutProps {
  children: React.ReactNode;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  currentPage: ViewState;
  onNavigate: (page: ViewState) => void;
  userCredits?: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentLang, onLangChange, currentPage, onNavigate, userCredits }) => {
  const t = TRANSLATIONS[currentLang];
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    onNavigate('landing');
  };

  const toggleLangMenu = () => {
    setIsLangMenuOpen(!isLangMenuOpen);
  };

  const selectLanguage = (lang: Language) => {
    onLangChange(lang);
    setIsLangMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Glassmorphism Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogoClick}>
            <div className="bg-navy-900 text-white p-2 rounded-xl shadow-lg group-hover:bg-navy-800 transition-colors border border-navy-700">
               {/* New Original Logo: Combines Pillar (Law) + Book (Education) + Circuit (AI) */}
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-8 h-8">
                  {/* Abstract Open Book / Shield Base */}
                  <path d="M20 34C14 34 8 30 6 24V10C8 12 14 13 20 13C26 13 32 12 34 10V24C32 30 26 34 20 34Z" fill="currentColor" fillOpacity="0.2"/>
                  
                  {/* The Pillar of Justice (Central Column) */}
                  <rect x="18" y="16" width="4" height="14" rx="1" fill="#fbbf24" />
                  <path d="M16 32H24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 16H24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>

                  {/* The AI Spark / Digital Brain (Top) */}
                  <path d="M20 6L22 10H18L20 6Z" fill="#fbbf24" />
                  <circle cx="20" cy="13" r="2" fill="white" />
                  
                  {/* Circuit Nodes representing Tech */}
                  <circle cx="12" cy="18" r="1.5" fill="currentColor" />
                  <circle cx="28" cy="18" r="1.5" fill="currentColor" />
                  <path d="M13.5 18H16.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
                  <path d="M23.5 18H26.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"/>
               </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-navy-900 leading-none">
                {t.brand}
              </span>
              <span className="text-[10px] text-gold-600 font-bold tracking-widest uppercase mt-0.5">Academic AI</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex gap-2">
            {[
              { id: 'landing', label: t.home },
              { id: 'create', label: t.newLesson },
              { id: 'about', label: t.about }
            ].map((link) => (
              <button 
                key={link.id}
                onClick={() => onNavigate(link.id as ViewState)} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  currentPage === link.id || (link.id === 'create' && currentPage === 'lesson')
                    ? 'bg-navy-50 text-navy-900 ring-1 ring-navy-200' 
                    : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Credits Display */}
          {typeof userCredits !== 'undefined' && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg border border-blue-200">
              <span className="text-xs font-medium text-blue-900">Credits:</span>
              <span className="text-sm font-bold text-blue-600">{formatCredits(userCredits)}</span>
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Selector */}
          <div className="relative" ref={langMenuRef}>
            <button 
              onClick={toggleLangMenu}
              className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors ${isLangMenuOpen ? 'bg-slate-50 text-navy-900' : 'text-slate-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S13.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m-15.686 0A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253m0 0A11.953 11.953 0 0112 10.5c2.998 0 5.74 1.1 7.843 2.918" />
              </svg>
              <span>{currentLang === Language.UZ_LATIN ? "O'zbekcha" : currentLang === Language.UZ_CYRILLIC ? "Ўзбекча" : currentLang === Language.ENGLISH ? "English" : "Русский"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            {isLangMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in-down origin-top-right ring-1 ring-black/5">
                {Object.values(Language).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => selectLanguage(lang)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${currentLang === lang ? 'text-gold-600 font-semibold bg-slate-50' : 'text-slate-600'}`}
                  >
                    {lang === Language.UZ_LATIN ? "O'zbekcha" : lang === Language.UZ_CYRILLIC ? "Ўзбекча" : lang === Language.ENGLISH ? "English" : "Русский"}
                    {currentLang === lang && <span className="w-1.5 h-1.5 rounded-full bg-gold-600"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Dark Footer */}
      <footer className="bg-navy-900 text-slate-300 py-16 border-t border-navy-800 font-sans no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            
            {/* Brand Section */}
            <div className="md:col-span-4 flex flex-col items-start">
                <div className="flex items-center gap-3 mb-6">
                <div className="bg-navy-800 text-white p-2 rounded-xl shadow-lg border border-navy-700">
                    {/* Small Logo */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className="w-6 h-6">
                        <path d="M20 34C14 34 8 30 6 24V10C8 12 14 13 20 13C26 13 32 12 34 10V24C32 30 26 34 20 34Z" fill="currentColor" fillOpacity="0.2"/>
                        <rect x="18" y="16" width="4" height="14" rx="1" fill="#fbbf24" />
                        <path d="M16 32H24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M16 16H24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M20 6L22 10H18L20 6Z" fill="#fbbf24" />
                    </svg>
                    </div>
                    <span className="font-serif text-2xl font-bold text-white tracking-tight">Learnify</span>
                </div>
                <p className="text-slate-400 text-base font-medium">{t.footerTagline}</p>
            </div>

            {/* Platform Links */}
            <div className="md:col-span-3 md:col-start-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 opacity-80">{t.platform}</h4>
                <ul className="space-y-4">
                    <li>
                    <button onClick={() => onNavigate('landing')} className="text-slate-400 hover:text-white transition-colors text-sm">{t.home}</button>
                    </li>
                    <li>
                    <button onClick={() => onNavigate('create')} className="text-slate-400 hover:text-white transition-colors text-sm">{t.newLesson}</button>
                    </li>
                    <li>
                    <button onClick={() => onNavigate('about')} className="text-slate-400 hover:text-white transition-colors text-sm">{t.about}</button>
                    </li>
                </ul>
            </div>

            {/* Legal Disclaimer */}
            <div className="md:col-span-4 md:col-start-9">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 opacity-80">{t.legalDisclaimer}</h4>
                <div className="border-l-2 border-gold-500 pl-6">
                    <p className="text-slate-400 text-sm leading-relaxed opacity-90">
                        {t.disclaimerText}
                    </p>
                </div>
            </div>

            </div>

            {/* Bottom Bar */}
            <div className="border-t border-navy-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                <div>{t.copyright}</div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-slate-300 transition-colors">{t.privacyPolicy}</a>
                    <a href="#" className="hover:text-slate-300 transition-colors">{t.termsOfService}</a>
                    <a href="#" className="hover:text-slate-300 transition-colors">{t.support}</a>
                </div>
            </div>

        </div>
      </footer>
    </div>
  );
};