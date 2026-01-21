import React from 'react';
import { LessonResponse, Language, ChatMessage } from '../types';
import { TRANSLATIONS } from '../constants';
import { ChatWidget } from './ChatWidget';

interface LessonRendererProps {
  data: LessonResponse;
  currentLang: Language;
  onBack: () => void;
  chatHistory: ChatMessage[];
  onChatHistoryChange: (messages: ChatMessage[]) => void;
}

export const LessonRenderer: React.FC<LessonRendererProps> = ({ data, currentLang, onBack, chatHistory, onChatHistoryChange }) => {
  const t = TRANSLATIONS[currentLang];
  
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32 animate-fade-in-up">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8 no-print">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-navy-900 transition-colors font-medium">
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center mr-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </div>
          {t.back}
        </button>
        
        <div className="flex gap-3">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
             </svg>
             {t.downloadPdf}
          </button>
        </div>
      </div>

      <div className="print-content grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR (Left on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadata Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
             <span className="text-xs font-bold tracking-widest text-gold-600 uppercase mb-2 block">{data.module}</span>
             <h1 className="font-serif text-2xl font-bold text-navy-900 mb-6 leading-tight">{data.title}</h1>
             
             <div className="space-y-6">
                <div>
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.objectives}</h3>
                   <ul className="space-y-2">
                    {data.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {obj}
                        </li>
                    ))}
                   </ul>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.concepts}</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.concepts.map((c, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium border border-slate-200">
                            {c}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">{t.mistakes}</h3>
                    <ul className="space-y-2">
                        {data.commonMistakes.map((m, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                <span className="text-red-500 font-bold">×</span>
                                {m}
                            </li>
                        ))}
                    </ul>
                </div>
             </div>
          </div>
        </div>

        {/* MAIN CONTENT (Right on desktop) */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* Definition */}
            <div className="bg-white p-8 md:p-10 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-gold-500 rounded-full"></span>
                    {data.definitionAndStructure.title}
                </h2>
                <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed text-justify">
                    {data.definitionAndStructure.content}
                </div>
            </div>

            {/* Historical Development */}
            <div className="bg-white p-8 md:p-10 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6 flex items-center gap-3">
                    <span className="w-1 h-8 bg-gold-500 rounded-full"></span>
                    {data.historicalDevelopment.title}
                </h2>
                <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed text-justify">
                    {data.historicalDevelopment.content}
                </div>
            </div>

            {/* Comparative Analysis (Optional) */}
            {data.comparativeAnalysis && (
                <div className="bg-white p-8 md:p-10 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6 flex items-center gap-3">
                        <span className="w-1 h-8 bg-purple-500 rounded-full"></span>
                        {data.comparativeAnalysis.title || t.comparativeAnalysis}
                    </h2>
                    <div className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed text-justify">
                        {data.comparativeAnalysis.content}
                    </div>
                </div>
            )}

            {/* Case Law Grid */}
            {data.courtCases && data.courtCases.length > 0 && (
                <div className="space-y-4">
                    <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4 flex items-center gap-3 px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-navy-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                        </svg>
                        {t.caseLaw}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.courtCases.map((c, i) => (
                            <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-gold-300 transition-colors group">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{c.year}</span>
                                    <span className="text-[10px] font-semibold text-navy-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">{c.court}</span>
                                </div>
                                <h3 className="font-serif font-bold text-lg text-navy-900 mb-3 group-hover:text-gold-600 transition-colors">{c.name}</h3>
                                <div className="space-y-2 text-sm text-slate-600">
                                    <p><span className="font-semibold text-navy-900">Issue:</span> {c.legalIssue}</p>
                                    <p><span className="font-semibold text-navy-900">Holding:</span> {c.holding}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Practical Exercises (Optional) */}
            {data.practicalExercises && data.practicalExercises.length > 0 && (
                 <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
                    <h2 className="font-serif text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {t.practicalExercises}
                    </h2>
                    <div className="space-y-6">
                        {data.practicalExercises.map((ex, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                                <h4 className="font-bold text-navy-900 mb-2">Scenario {i+1}:</h4>
                                <p className="text-slate-700 italic mb-4 text-sm">{ex.question}</p>
                                <div className="bg-slate-50 p-4 rounded text-sm text-slate-600 border-l-2 border-gold-500">
                                    <span className="font-bold text-gold-700 block mb-1">Answer / Guidance:</span>
                                    {ex.answer}
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            )}

            {/* Doctrines */}
            {data.legalDoctrines && data.legalDoctrines.length > 0 && (
                <div className="bg-[#fffbf0] p-8 rounded-xl border border-gold-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z"/></svg>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-gold-800 mb-6 relative z-10">{t.doctrines}</h2>
                    <div className="space-y-6 relative z-10">
                        {data.legalDoctrines.map((d, i) => (
                            <div key={i} className="border-l-4 border-gold-400 pl-4 py-1">
                                <h4 className="font-serif font-bold text-lg text-navy-900">{d.name}</h4>
                                <p className="text-slate-700 mt-1 italic">{d.definition}</p>
                                <div className="mt-2 flex gap-4 text-xs">
                                    <span className="text-gold-700 font-semibold">Origin: {d.origin}</span>
                                    <span className="text-slate-500">Status: {d.currentStatus}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

             {/* Glossary (Optional) */}
             {data.glossary && data.glossary.length > 0 && (
                <div className="bg-white p-8 rounded-xl border border-slate-200">
                    <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">{t.glossary}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {data.glossary.map((item, i) => (
                            <div key={i} className="flex flex-col border-b border-slate-100 pb-2 last:border-0">
                                <span className="font-bold text-navy-800 text-sm">{item.term}</span>
                                <span className="text-slate-600 text-xs">{item.definition}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

             {/* Bibliography (Optional) */}
             {data.bibliography && data.bibliography.length > 0 && (
                <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                    <h2 className="font-serif text-xl font-bold text-navy-900 mb-4">{t.bibliography}</h2>
                    <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                        {data.bibliography.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Conclusion */}
            <div className="bg-navy-900 text-slate-300 p-8 rounded-xl border border-navy-800 shadow-lg">
                <h2 className="font-serif text-xl font-bold text-white mb-4">{t.conclusion}</h2>
                <p className="leading-relaxed text-justify font-light">
                    {data.conclusion}
                </p>
            </div>

            {/* Chat Widget */}
            <div className="mt-12 no-print">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-xl">🤖</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-navy-900 text-sm">{t.aiTeacher}</h3>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                    </div>
                    <ChatWidget 
                        currentLang={currentLang} 
                        lessonContext={data} 
                        messages={chatHistory} 
                        onMessagesChange={onChatHistoryChange} 
                    />
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};