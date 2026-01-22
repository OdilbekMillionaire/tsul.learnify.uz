import React, { useState, useEffect } from 'react';
import { Language, LessonFormState, AcademicLevel, LessonDepth, SimplicityLevel, LessonFocus } from '../types';
import { TRANSLATIONS, MODULES_BY_LANGUAGE, MODULE_DESCRIPTIONS } from '../constants';

interface LessonFormProps {
  currentLang: Language;
  onSubmit: (data: LessonFormState) => void;
  isLoading: boolean;
  error: string | null;
}

export const LessonForm: React.FC<LessonFormProps> = ({ currentLang, onSubmit, isLoading, error }) => {
  const t = TRANSLATIONS[currentLang];
  const modules = MODULES_BY_LANGUAGE[currentLang];

  const [form, setForm] = useState<LessonFormState>({
    module: '',
    topic: '',
    level: AcademicLevel.BACHELOR,
    depth: LessonDepth.STANDARD,
    simplicity: SimplicityLevel.STUDENT,
    focus: LessonFocus.THEORETICAL,
    structure: {
      bulletPoints: false,
      tables: false,
      summaries: false,
      stepByStep: false,
      caseLaw: false,
      doctrines: false,
      comparativeAnalysis: false,
      practicalExercises: false,
      glossary: false,
      bibliography: false,
    }
  });

  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  
  const loadingMessages = [
    "Analyzing academic databases...",
    "Structuring legal arguments...",
    "Retrieving case law precedents...",
    "Synthesizing theoretical concepts...",
    "Verifying academic compliance...",
    "Finalizing lesson format..."
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    } else {
      setLoadingMsgIndex(0);
    }
  }, [isLoading]);

  const handleSubmit = () => {
    if (!form.module || !form.topic) return;
    onSubmit(form);
  };

  const getModuleDescription = (modName: string) => {
    if (!modName) return null;
    const descriptions = MODULE_DESCRIPTIONS[currentLang] as Record<string, string>;
    return descriptions[modName] || descriptions['default'];
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 animate-fade-in-up text-center">
        <div className="mb-12">
           <div className="w-20 h-20 bg-white border-2 border-gold-100 rounded-full mx-auto flex items-center justify-center relative mb-6 shadow-xl shadow-gold-500/10">
              <div className="absolute inset-0 rounded-full border-4 border-gold-500 border-t-transparent animate-spin"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
           </div>
           <h2 className="font-serif text-3xl font-bold text-navy-900 mb-2">{t.generating}</h2>
           <p className="text-slate-500 max-w-md mx-auto animate-pulse font-medium min-h-[1.5rem] transition-opacity duration-300">
             {loadingMessages[loadingMsgIndex]}
           </p>
        </div>
        
        <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-sm border border-slate-100 space-y-3 opacity-60">
             <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-navy-900 w-1/3 animate-progress"></div>
             </div>
             <div className="flex justify-between text-xs text-slate-400 font-medium tracking-wide uppercase">
                <span>Initialization</span>
                <span>Drafting</span>
                <span>Review</span>
             </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-fade-in-up">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-navy-900 mb-3">{t.configure}</h1>
        <p className="text-slate-500 text-lg">{t.configureSubtitle}</p>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-100 p-6 rounded-xl flex items-start gap-4 animate-fade-in-up">
           <div className="bg-red-100 p-2 rounded-full text-red-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
           </div>
           <div>
             <h3 className="font-bold text-red-900 mb-1">Generation Failed</h3>
             <p className="text-red-700 text-sm">{error}</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Main Inputs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Module & Topic */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-serif text-lg font-bold text-navy-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
              <span className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-900">1</span>
              {t.moduleSection}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide text-[11px]">Modul</label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:border-navy-900 outline-none transition-all font-medium text-slate-700"
                    value={form.module}
                    onChange={(e) => setForm({...form, module: e.target.value})}
                  >
                    <option value="">{t.selectModule}</option>
                    {modules.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {/* Module Description Display */}
                  {form.module && (
                    <div className="mt-3 flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 animate-fade-in-up">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-slate-500 italic leading-relaxed">
                            {getModuleDescription(form.module)}
                        </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide text-[11px]">Mavzu</label>
                <input 
                  type="text"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:border-navy-900 outline-none transition-all font-medium placeholder:text-slate-400"
                  placeholder={t.enterTopic}
                  value={form.topic}
                  onChange={(e) => setForm({...form, topic: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Level & Simplicity */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
             <h2 className="font-serif text-lg font-bold text-navy-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
               <span className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-900">2</span>
               {t.simplicity}
             </h2>

             <div className="space-y-4">
                {Object.values(SimplicityLevel).map((level) => {
                  const isSelected = form.simplicity === level;
                  let icon = "🎓";
                  if (level === SimplicityLevel.CHILD) icon = "🐣";
                  if (level === SimplicityLevel.RESEARCHER) icon = "🔬";

                  return (
                    <div 
                      key={level}
                      onClick={() => setForm({...form, simplicity: level})}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        isSelected 
                          ? 'border-gold-500 bg-gold-50/50 shadow-sm' 
                          : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isSelected ? 'bg-gold-100' : 'bg-slate-100'}`}>
                        {icon}
                      </div>
                      <div>
                        <h3 className={`font-bold ${isSelected ? 'text-navy-900' : 'text-slate-700'}`}>
                          {level === SimplicityLevel.CHILD ? t.simplicityChild : level === SimplicityLevel.STUDENT ? t.simplicityStudent : t.simplicityResearcher}
                        </h3>
                      </div>
                      <div className="ml-auto">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-gold-600' : 'border-slate-300'}`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-gold-600"></div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Lesson Focus (New Section) */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
             <h2 className="font-serif text-lg font-bold text-navy-900 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
               <span className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-900">3</span>
               {t.lessonFocus}
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(LessonFocus).map((focus) => {
                  const isSelected = form.focus === focus;
                  return (
                    <button
                      key={focus}
                      onClick={() => setForm({...form, focus})}
                      className={`text-left p-4 rounded-xl border-2 transition-all flex flex-col gap-2 ${
                        isSelected 
                          ? 'border-gold-500 bg-gold-50/50 shadow-sm' 
                          : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                       <div className="flex items-center justify-between w-full">
                          <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-gold-700' : 'text-slate-400'}`}>
                            {focus === LessonFocus.THEORETICAL ? 'Theory' : focus === LessonFocus.PRACTICAL ? 'Practice' : focus === LessonFocus.CASE_BASED ? 'Cases' : 'Law'}
                          </span>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-gold-600"></div>}
                       </div>
                       <h3 className={`font-bold text-sm ${isSelected ? 'text-navy-900' : 'text-slate-700'}`}>
                         {t.focuses[focus]}
                       </h3>
                    </button>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-8">
           {/* Academic Settings */}
           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-navy-900 mb-6 pb-4 border-b border-slate-100">{t.academicLevel}</h2>
              
              <div className="grid grid-cols-1 gap-3 mb-6">
                {Object.values(AcademicLevel).map((level) => (
                  <button
                    key={level}
                    onClick={() => setForm({...form, level})}
                    className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all text-left flex justify-between items-center ${
                      form.level === level 
                        ? 'bg-navy-900 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t.levels[level]}
                    {form.level === level && <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                  </button>
                ))}
              </div>

              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide text-[11px]">{t.depth}</label>
              <div className="flex flex-col gap-2">
                 {Object.values(LessonDepth).map((depth) => (
                  <button
                    key={depth}
                    onClick={() => setForm({...form, depth})}
                    className={`text-left px-4 py-3 rounded-lg text-sm transition-all flex items-center justify-between ${
                      form.depth === depth 
                        ? 'bg-gold-50 text-gold-700 font-bold border border-gold-200' 
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    {t.depths[depth]}
                    {form.depth === depth && <svg className="w-4 h-4 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                  </button>
                ))}
              </div>
           </div>

           {/* Structure Checkboxes */}
           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-navy-900 mb-6 pb-4 border-b border-slate-100">{t.structurePref}</h2>
              <div className="space-y-3">
                 {Object.keys(form.structure).map((key) => (
                    <label key={key} className="flex items-center p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group">
                       <div className="relative flex items-center">
                          <input 
                            type="checkbox"
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white checked:border-navy-900 checked:bg-navy-900 transition-all"
                            checked={form.structure[key as keyof typeof form.structure]}
                            onChange={() => setForm(prev => ({...prev, structure: {...prev.structure, [key]: !prev.structure[key as keyof typeof prev.structure]}}))}
                          />
                          <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                       </div>
                       <span className="ml-3 text-sm font-medium text-slate-600 group-hover:text-navy-900 transition-colors">
                          {t[key as keyof typeof t]}
                       </span>
                    </label>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="mt-12 sticky bottom-6 z-40">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-200/60 flex items-center justify-between max-w-5xl mx-auto">
           <button 
             className="px-6 py-3 rounded-xl text-slate-500 font-medium hover:bg-slate-100 transition-colors text-sm"
             onClick={() => setForm({
                module: '', topic: '', level: AcademicLevel.BACHELOR, depth: LessonDepth.STANDARD, simplicity: SimplicityLevel.STUDENT,
                focus: LessonFocus.THEORETICAL,
                structure: { 
                  bulletPoints: false, 
                  tables: false, 
                  summaries: false, 
                  stepByStep: false, 
                  caseLaw: false, 
                  doctrines: false,
                  comparativeAnalysis: false,
                  practicalExercises: false,
                  glossary: false,
                  bibliography: false
                }
             })}
           >
              {t.clean}
           </button>

           <button 
              onClick={handleSubmit}
              disabled={isLoading || !form.module || !form.topic}
              className={`px-8 py-3.5 rounded-xl font-bold text-white flex items-center gap-3 shadow-lg shadow-navy-900/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                 isLoading || !form.module || !form.topic
                  ? 'bg-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-navy-900 hover:bg-navy-800'
              }`}
           >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
               </svg>
               {t.generate}
           </button>
        </div>
      </div>

    </div>
  );
};