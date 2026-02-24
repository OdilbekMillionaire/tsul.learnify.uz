import React, { useState } from 'react';
import { LessonResponse, Language, ChatMessage } from '../types';
import { TRANSLATIONS } from '../constants';
import { ChatWidget } from './ChatWidget';
import ReactMarkdown from 'react-markdown';

interface LessonRendererProps {
  data: LessonResponse;
  currentLang: Language;
  onBack: () => void;
  chatHistory: ChatMessage[];
  onChatHistoryChange: (messages: ChatMessage[]) => void;
}

const markdownComponents = {
  p: ({node, ...props}: any) => <p className="text-slate-700 mb-4 last:mb-0 leading-relaxed text-justify" {...props} />,
  strong: ({node, ...props}: any) => <strong className="font-bold text-gold-700 bg-gold-50 px-1 rounded" {...props} />,
  em: ({node, ...props}: any) => <em className="italic text-slate-600" {...props} />,
  ul: ({node, ...props}: any) => <ul className="list-none my-3 space-y-2" {...props} />,
  ol: ({node, ...props}: any) => <ol className="list-decimal list-outside my-3 ml-6 space-y-2" {...props} />,
  li: ({node, ...props}: any) => <li className="text-slate-700 mb-1 leading-relaxed" {...props} />,
  code: ({node, inline, ...props}: any) =>
    inline ?
      <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800 border border-slate-200" {...props} /> :
      <code className="block bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto my-4 border border-slate-700" {...props} />
};

// NEW FEATURE 1: Copy to clipboard helper
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

// NEW FEATURE 3: Interactive table of contents
const TableOfContents = ({ data, currentLang }: { data: LessonResponse; currentLang: Language }) => {
  const t = TRANSLATIONS[currentLang];
  const sections = [
    { id: 'definition', label: data.definitionAndStructure.title },
    { id: 'historical', label: data.historicalDevelopment.title },
    { id: 'comparative', label: t.comparativeAnalysis, enabled: !!data.comparativeAnalysis },
    { id: 'caselaw', label: t.caseLaw, enabled: data.courtCases && data.courtCases.length > 0 },
    { id: 'practical', label: t.practicalExercises, enabled: data.practicalExercises && data.practicalExercises.length > 0 },
    { id: 'doctrines', label: t.doctrines, enabled: data.legalDoctrines && data.legalDoctrines.length > 0 },
    { id: 'glossary', label: t.glossary, enabled: data.glossary && data.glossary.length > 0 },
    { id: 'bibliography', label: t.bibliography, enabled: data.bibliography && data.bibliography.length > 0 },
    { id: 'conclusion', label: t.conclusion }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border border-slate-200 shadow-sm no-print mb-8">
      <h3 className="font-bold text-navy-900 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        Quick Navigation
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {sections.filter(s => s.enabled !== false).map(section => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:border-gold-400 hover:text-gold-600 transition-colors"
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// NEW FEATURE 2: Key Takeaways Summary
const KeyTakeaways = ({ objectives }: { objectives: string[] }) => {
  if (!objectives || objectives.length === 0) return null;
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-200 shadow-sm mb-8 no-print">
      <h3 className="font-bold text-navy-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
        <span>✨</span> Key Takeaways
      </h3>
      <ul className="space-y-2">
        {objectives.slice(0, 3).map((obj, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
            <span className="text-gold-600 font-bold mt-0.5">→</span>
            <span>{obj}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// NEW FEATURE 4: Section copy button
const SectionHeader = ({ icon, title, sectionId, content }: { icon: string; title: string; sectionId: string; content: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center">
          <span className="text-lg">{icon}</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-navy-900">{title}</h2>
      </div>
      <button
        onClick={handleCopy}
        className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors no-print"
        title="Copy section to clipboard"
      >
        {copied ? (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export const LessonRenderer: React.FC<LessonRendererProps> = ({ data, currentLang, onBack, chatHistory, onChatHistoryChange }) => {
  const t = TRANSLATIONS[currentLang];

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32 animate-fade-in-up print:pb-0">
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

      {/* NEW FEATURE 1: Key Takeaways */}
      <KeyTakeaways objectives={data.objectives} />

      {/* NEW FEATURE 3: Table of Contents */}
      <TableOfContents data={data} currentLang={currentLang} />

      <div id="lesson-content-area" className="print-content grid grid-cols-1 lg:grid-cols-12 gap-8">


        {/* SIDEBAR (Left on desktop) */}
        <div className="lg:col-span-4 print:col-span-4 space-y-6">
          {/* Metadata Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24 print:static print:border print:shadow-none">
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
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium border border-slate-200 print:border-slate-300">
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
        <div className="lg:col-span-8 print:col-span-8 space-y-8 print:space-y-6">
            
            {/* Definition */}
            <div id="section-definition" className="bg-gradient-to-br from-white to-slate-50 p-8 md:p-10 rounded-xl border border-gold-100 shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border print:p-6">
                <SectionHeader icon="📖" title={data.definitionAndStructure.title} sectionId="definition" content={data.definitionAndStructure.content} />
                <div className="pl-0 md:pl-2">
                  <ReactMarkdown components={markdownComponents}>
                    {data.definitionAndStructure.content}
                  </ReactMarkdown>
                </div>
            </div>

            {/* Historical Development */}
            <div id="section-historical" className="bg-gradient-to-br from-white to-slate-50 p-8 md:p-10 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border print:p-6">
                <SectionHeader icon="📜" title={data.historicalDevelopment.title} sectionId="historical" content={data.historicalDevelopment.content} />
                <div className="pl-0 md:pl-2">
                  <ReactMarkdown components={markdownComponents}>
                    {data.historicalDevelopment.content}
                  </ReactMarkdown>
                </div>
            </div>

            {/* Comparative Analysis (Optional) */}
            {data.comparativeAnalysis && (
                <div id="section-comparative" className="bg-gradient-to-br from-purple-50 to-white p-8 md:p-10 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow print:shadow-none print:border print:p-6">
                    <SectionHeader icon="⚖️" title={data.comparativeAnalysis.title || t.comparativeAnalysis} sectionId="comparative" content={data.comparativeAnalysis.content} />
                    <div className="pl-0 md:pl-2">
                      <ReactMarkdown components={markdownComponents}>
                        {data.comparativeAnalysis.content}
                      </ReactMarkdown>
                    </div>
                </div>
            )}

            {/* Case Law Grid */}
            {data.courtCases && data.courtCases.length > 0 && (
                <div id="section-caselaw" className="print:break-inside-avoid">
                    <div className="mb-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                <span className="text-lg">⚔️</span>
                            </div>
                            <h2 className="font-serif text-2xl font-bold text-navy-900">{t.caseLaw}</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
                        {data.courtCases.map((c, i) => (
                            <div key={i} className="bg-gradient-to-br from-white to-red-50 p-6 rounded-xl border border-red-100 hover:border-red-300 hover:shadow-md transition-all group print:border-red-200 print:bg-white">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-100 px-2 py-1 rounded">{c.year}</span>
                                    <span className="text-[10px] font-semibold text-navy-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">{c.court}</span>
                                </div>
                                <h3 className="font-serif font-bold text-lg text-navy-900 mb-3 group-hover:text-red-600 transition-colors">{c.name}</h3>
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
                 <div id="section-practical" className="bg-gradient-to-br from-cyan-50 to-white p-8 md:p-10 rounded-xl border border-cyan-100 shadow-sm print:bg-white print:border-slate-200 print:break-inside-avoid">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                            <span className="text-lg">💡</span>
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-navy-900">{t.practicalExercises}</h2>
                    </div>
                    <div className="space-y-6">
                        {data.practicalExercises.map((ex, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow print:border-slate-200 print:shadow-none">
                                <div className="flex items-start gap-3 mb-3">
                                    <span className="inline-block w-8 h-8 bg-cyan-100 text-cyan-700 rounded-lg font-bold text-sm flex items-center justify-center flex-shrink-0">{i+1}</span>
                                    <h4 className="font-bold text-navy-900">Scenario</h4>
                                </div>
                                <p className="text-slate-700 italic mb-4 text-sm ml-11">{ex.question}</p>
                                <div className="bg-slate-50 p-4 rounded text-sm text-slate-600 border-l-4 border-cyan-500 print:bg-slate-50 ml-2">
                                    <span className="font-bold text-navy-900 block mb-2">✓ Answer / Guidance:</span>
                                    <div className="ml-2">{ex.answer}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            )}

            {/* Doctrines */}
            {data.legalDoctrines && data.legalDoctrines.length > 0 && (
                <div id="section-doctrines" className="bg-gradient-to-br from-amber-50 to-white p-8 md:p-10 rounded-xl border border-amber-100 shadow-sm relative overflow-hidden print:bg-white print:border-slate-200 print:break-inside-avoid">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99z"/></svg>
                    </div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <span className="text-lg">📚</span>
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-navy-900">{t.doctrines}</h2>
                    </div>
                    <div className="space-y-6 relative z-10">
                        {data.legalDoctrines.map((d, i) => (
                            <div key={i} className="bg-white p-5 rounded-lg border-l-4 border-amber-400 shadow-sm hover:shadow-md transition-shadow print:border-l-4 print:border-amber-300 print:bg-white print:shadow-none">
                                <h4 className="font-serif font-bold text-lg text-navy-900 mb-2">{d.name}</h4>
                                <p className="text-slate-700 mb-3 italic text-sm">{d.definition}</p>
                                <div className="flex flex-wrap gap-3 text-xs">
                                    <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded font-semibold">Origin: {d.origin}</span>
                                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-semibold">Status: {d.currentStatus}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

             {/* Glossary (Optional) */}
             {data.glossary && data.glossary.length > 0 && (
                <div id="section-glossary" className="bg-gradient-to-br from-green-50 to-white p-8 md:p-10 rounded-xl border border-green-100 shadow-sm print:bg-white print:border-slate-200 print:shadow-none">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <span className="text-lg">📖</span>
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-navy-900">{t.glossary}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.glossary.map((item, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg border border-green-100 hover:border-green-300 hover:shadow-sm transition-all print:border-green-100 print:bg-white">
                                <span className="font-bold text-navy-900 text-sm block mb-1.5">{item.term}</span>
                                <span className="text-slate-600 text-xs leading-relaxed">{item.definition}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

             {/* Bibliography (Optional) */}
             {data.bibliography && data.bibliography.length > 0 && (
                <div id="section-bibliography" className="bg-gradient-to-br from-indigo-50 to-white p-8 md:p-10 rounded-xl border border-indigo-100 shadow-sm print:bg-white print:border-slate-200 print:shadow-none">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <span className="text-lg">📕</span>
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-navy-900">{t.bibliography}</h2>
                    </div>
                    <div className="space-y-2">
                        {data.bibliography.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-indigo-50 transition-colors print:hover:bg-white">
                                <span className="flex-shrink-0 inline-block w-6 h-6 bg-indigo-200 text-indigo-800 rounded-full text-xs font-bold flex items-center justify-center mt-0.5">{i+1}</span>
                                <span className="text-sm text-slate-700 leading-relaxed pt-0.5">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Conclusion */}
            <div id="section-conclusion" className="bg-gradient-to-br from-navy-900 to-navy-800 text-slate-300 p-8 md:p-10 rounded-xl border border-navy-700 shadow-lg print:bg-navy-900 print:text-slate-300 print:border-slate-300 print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gold-500/20 flex items-center justify-center">
                        <span className="text-lg">🎓</span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-white">{t.conclusion}</h2>
                </div>
                <p className="leading-relaxed text-justify font-light text-slate-300">
                    {data.conclusion}
                </p>
            </div>

            {/* Sources Section - ALWAYS VISIBLE with debug info */}
            <div className="bg-blue-50 p-8 rounded-xl border-2 border-blue-300">
                <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Research Sources Used
                </h2>

                {data.sourceLinks && data.sourceLinks.length > 0 ? (
                    <>
                        <p className="text-sm text-slate-600 mb-5 font-medium">
                            ✅ Found {data.sourceLinks.length} web sources to enrich this lesson
                        </p>

                        {/* Interactive version (screen) */}
                        <div className="sources-interactive space-y-3">
                            {data.sourceLinks.map((source, i) => (
                                <a
                                    key={i}
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-700 transition-colors">
                                            <span className="text-xs font-bold text-white">{i + 1}</span>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <h4 className="font-semibold text-sm text-navy-900 group-hover:text-blue-600 transition-colors break-words">
                                                {source.title}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                                                    {source.source}
                                                </span>
                                                <p className="text-xs text-blue-500 break-all truncate">
                                                    {source.url}
                                                </p>
                                            </div>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 group-hover:text-blue-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Print-friendly version (PDF) */}
                        <div className="sources-print-list">
                            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                                {data.sourceLinks.map((source, i) => (
                                    <li key={i} className="leading-relaxed">
                                        <span className="font-semibold">{source.title}</span>
                                        <span className="text-slate-500"> ({source.source})</span>
                                        <br />
                                        <span className="text-blue-600 text-xs ml-5">{source.url}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <p className="text-[11px] text-slate-600 mt-5 pt-4 border-t border-blue-200">
                            These sources were automatically searched during lesson generation to ensure current, accurate information.
                        </p>
                    </>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-yellow-800 font-medium flex items-center gap-2">
                            <span>⚠️</span>
                            <span>No web sources were retrieved during generation</span>
                        </p>
                        <p className="text-xs text-yellow-700 mt-2 ml-6">
                            This may happen if: the web search service is unavailable, network is slow, or no relevant sources were found. The lesson was still generated with the AI model's built-in knowledge.
                        </p>
                    </div>
                )}
            </div>

            {/* Chat Widget */}
            <div className="mt-12 print:break-inside-avoid">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:overflow-visible print:shadow-none print:border print:border-slate-300">
                    <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between print:bg-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-xl">🤖</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-navy-900 text-sm">{t.aiTeacher}</h3>
                                <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 print:border print:border-green-600"></span>
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