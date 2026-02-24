import React, { useState } from 'react';
import { SourceContent } from '../types';
import { SourceBadge } from './SourceBadge';

interface SourcePreviewModalProps {
  source: SourceContent | null;
  onClose: () => void;
}

export const SourcePreviewModal: React.FC<SourcePreviewModalProps> = ({ source, onClose }) => {
  if (!source) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <SourceBadge badge={source.credibilityBadge} sourceType={source.sourceType} size="sm" />
            </div>
            <h2 className="text-2xl font-bold text-navy-900 pr-4">{source.title}</h2>
            <p className="text-sm text-slate-500 mt-2">
              Type: <span className="font-medium text-slate-700">{source.sourceType.toUpperCase()}</span> •
              Relevance: <span className="font-medium text-slate-700">{source.relevanceScore}%</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* URL */}
          <div>
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Source URL</h3>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all text-sm font-medium flex items-center gap-2"
            >
              {source.url}
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Source Type</h3>
              <p className="text-slate-700 font-medium capitalize">{source.sourceType.replace('_', ' ')}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Credibility</h3>
              <p className="text-slate-700 font-medium capitalize">{source.credibilityBadge}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Relevance Score</h3>
              <div className="flex items-center gap-2">
                <div className="h-2 bg-slate-200 rounded-full flex-1">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${source.relevanceScore}%` }}
                  ></div>
                </div>
                <span className="text-slate-700 font-medium">{source.relevanceScore}%</span>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Fetched</h3>
              <p className="text-slate-700 font-medium">{new Date(source.fetchedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Content Excerpt */}
          <div>
            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-3">Content Preview</h3>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-48 overflow-auto">
              <p className="text-sm text-slate-700 leading-relaxed">
                {source.excerpt || 'No content excerpt available.'}
              </p>
              {source.excerpt && source.excerpt.length >= 500 && (
                <p className="text-xs text-slate-500 mt-3 italic">... (truncated, view full source for complete content)</p>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              View Full Source ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
