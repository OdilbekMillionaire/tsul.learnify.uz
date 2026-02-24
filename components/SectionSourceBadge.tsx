import React, { useState } from 'react';
import { SourceContent } from '../types';

interface SectionSourceBadgeProps {
  primarySource?: SourceContent;
  supportingSources?: SourceContent[];
  onSourceClick?: (source: SourceContent) => void;
}

export const SectionSourceBadge: React.FC<SectionSourceBadgeProps> = ({
  primarySource,
  supportingSources = [],
  onSourceClick
}) => {
  const [showSources, setShowSources] = useState(false);

  if (!primarySource && supportingSources.length === 0) {
    return (
      <span className="text-xs text-slate-400 italic">No official sources for this section</span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowSources(!showSources)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200 hover:bg-blue-100 transition-colors"
      >
        <span>📚</span>
        {primarySource && <span>{primarySource.sourceType === 'lex_uz' ? 'Lex.uz' : primarySource.sourceType.replace('_', ' ')}</span>}
        {supportingSources.length > 0 && <span className="text-blue-600">(+{supportingSources.length})</span>}
      </button>

      {/* Dropdown - Supporting sources */}
      {showSources && (supportingSources.length > 0) && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 z-10 min-w-max">
          <div className="p-3 border-b border-slate-200">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Additional Sources</p>
          </div>
          <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
            {supportingSources.map((source, i) => (
              <button
                key={i}
                onClick={() => {
                  if (onSourceClick) onSourceClick(source);
                  setShowSources(false);
                }}
                className="w-full text-left px-3 py-2 text-xs rounded hover:bg-slate-100 transition-colors"
              >
                <div className="font-medium text-slate-700">{source.title}</div>
                <div className="text-slate-500 text-[10px]">{source.sourceType}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
