import React, { useState, useRef, useEffect } from 'react';
import { Language, ViewState } from '../types';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  currentPage: ViewState;
  onNavigate: (page: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentLang, onLangChange, currentPage, onNavigate }) => {
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
            <div className="bg-navy-900 text-white p-2.5 rounded-lg shadow-md group-hover:bg-navy-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
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

      <footer className="bg-white border-t border-slate-200 py-10 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-navy-900 text-white rounded flex items-center justify-center text-xs font-bold">L</div>
            <span className="font-serif text-navy-900 font-bold text-sm">LEARNIFY</span>
          </div>
          <div className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Oxforder MCHJ. Academic License.
          </div>
        </div>
      </footer>
    </div>
  );
};