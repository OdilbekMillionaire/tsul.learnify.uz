import React from 'react';
import { CredibilityMetrics } from '../types';

interface CredibilityMeterProps {
  metrics: CredibilityMetrics;
}

export const CredibilityMeter: React.FC<CredibilityMeterProps> = ({ metrics }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return { color: 'text-green-600', bg: 'bg-green-100', label: 'Excellent' };
    if (score >= 70) return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Good' };
    if (score >= 50) return { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Fair' };
    return { color: 'text-slate-600', bg: 'bg-slate-100', label: 'General' };
  };

  const scoreStyle = getScoreColor(metrics.credibilityScore);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-navy-900 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
        <span>📊</span> Academic Credibility Score
      </h3>

      {/* Main Score Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(metrics.credibilityScore / 100) * 283} 283`}
              className={scoreStyle.color}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${scoreStyle.color}`}>{metrics.credibilityScore}%</span>
            <span className="text-xs text-slate-500">{scoreStyle.label}</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">🏛️ Official Sources</span>
          <span className="font-bold text-green-700">{metrics.officialSources}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">🎓 Academic Sources</span>
          <span className="font-bold text-blue-700">{metrics.academicSources}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">✓ Trusted Sources</span>
          <span className="font-bold text-amber-700">{metrics.trustedSources}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">📖 General Sources</span>
          <span className="font-bold text-slate-600">{metrics.generalSources}</span>
        </div>
      </div>

      {/* Quality Indicator */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-600">
          {metrics.credibilityScore >= 85
            ? '✅ This lesson uses primarily official and academic sources for maximum reliability.'
            : metrics.credibilityScore >= 70
            ? '⚠️ This lesson uses a mix of official, academic, and trusted sources.'
            : '📚 This lesson includes general educational references alongside official sources.'}
        </p>
      </div>
    </div>
  );
};
