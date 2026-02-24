import React from 'react';
import { CostEstimate } from '../types';
import { formatTime, formatCredits } from '../services/creditEstimator';

interface CostEstimateDisplayProps {
  estimate: CostEstimate | null;
  userCredits: number;
  isLoading: boolean;
}

export const CostEstimateDisplay: React.FC<CostEstimateDisplayProps> = ({
  estimate,
  userCredits,
  isLoading,
}) => {
  if (!estimate) return null;

  const hasEnoughCredits = userCredits >= estimate.estimatedCredits;
  const confidenceColor = {
    high: 'text-green-600',
    medium: 'text-yellow-600',
    low: 'text-orange-600',
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="font-semibold text-slate-900">Generation Estimate</h4>
            <span className={`text-xs font-medium px-2 py-1 rounded ${confidenceColor[estimate.confidence]} bg-white`}>
              {estimate.confidence === 'high' && '🎯 High Confidence'}
              {estimate.confidence === 'medium' && '⚠️ Medium Confidence'}
              {estimate.confidence === 'low' && '❓ Low Confidence'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="bg-white rounded p-2">
              <div className="text-xs text-slate-600 mb-1">Credits</div>
              <div className="text-lg font-bold text-blue-600">{formatCredits(estimate.estimatedCredits)}</div>
            </div>
            <div className="bg-white rounded p-2">
              <div className="text-xs text-slate-600 mb-1">Time</div>
              <div className="text-lg font-bold text-purple-600">{formatTime(estimate.estimatedSeconds)}</div>
            </div>
            <div className="bg-white rounded p-2">
              <div className="text-xs text-slate-600 mb-1">Remaining</div>
              <div className={`text-lg font-bold ${hasEnoughCredits ? 'text-green-600' : 'text-red-600'}`}>
                {formatCredits(Math.max(0, userCredits - estimate.estimatedCredits))}
              </div>
            </div>
          </div>

          <details className="cursor-pointer">
            <summary className="text-sm text-slate-600 hover:text-slate-900 font-medium">
              Breakdown
            </summary>
            <div className="mt-2 text-sm text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Content Generation:</span>
                <span className="font-medium">{estimate.breakdown.contentGeneration}</span>
              </div>
              {estimate.breakdown.webSearch > 0 && (
                <div className="flex justify-between">
                  <span>Web Search:</span>
                  <span className="font-medium">{estimate.breakdown.webSearch}</span>
                </div>
              )}
              {estimate.breakdown.formatting > 0 && (
                <div className="flex justify-between">
                  <span>Formatting:</span>
                  <span className="font-medium">{estimate.breakdown.formatting}</span>
                </div>
              )}
            </div>
          </details>
        </div>

        {!hasEnoughCredits && (
          <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
            <div className="font-semibold text-red-900 mb-1">Insufficient Credits</div>
            <div className="text-red-800">
              Need {formatCredits(estimate.estimatedCredits - userCredits)} more credits
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="animate-spin">⏳</div>
            Generating lesson...
          </div>
        </div>
      )}
    </div>
  );
};
