import React from 'react';
import { CredibilityBadge, SourceType } from '../types';

interface SourceBadgeProps {
  badge: CredibilityBadge;
  sourceType?: SourceType;
  size?: 'sm' | 'md' | 'lg';
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ badge, sourceType, size = 'md' }) => {
  const badgeConfig = {
    official: {
      color: 'bg-green-100 text-green-800',
      icon: '🏛️',
      label: 'Official',
      tooltip: 'Official government or institutional source'
    },
    academic: {
      color: 'bg-blue-100 text-blue-800',
      icon: '🎓',
      label: 'Academic',
      tooltip: 'Peer-reviewed academic research'
    },
    trusted: {
      color: 'bg-amber-100 text-amber-800',
      icon: '✓',
      label: 'Trusted',
      tooltip: 'Trusted and established source'
    },
    general: {
      color: 'bg-slate-100 text-slate-700',
      icon: '📖',
      label: 'General',
      tooltip: 'General educational reference'
    }
  };

  const config = badgeConfig[badge];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-base' : 'px-2.5 py-1 text-sm';

  return (
    <div className={`inline-flex items-center gap-1.5 ${sizeClass} ${config.color} rounded-full font-semibold border border-current border-opacity-20 hover:shadow-sm transition-shadow`} title={config.tooltip}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
};
