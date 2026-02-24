/**
 * Credit Cost Estimator
 * Calculates estimated credits and time before lesson generation
 */

import { LessonFormState, CostEstimate, AcademicLevel, LessonDepth } from '../types';

// Base costs for different dimensions
const CONTENT_COST = {
  overview: 100,
  standard: 200,
  advanced: 300,
};

const MODULE_COMPLEXITY = {
  simple: 1.0,
  moderate: 1.2,
  complex: 1.5,
};

const WEB_SEARCH_COST = 50; // per search result batch
const FORMATTING_COST = 25;
const CHAT_MESSAGE_COST = 5;

// Time estimates (in seconds)
const TIME_PER_CREDIT = 0.15; // 1 credit ≈ 0.15 seconds

export function estimateCost(formData: LessonFormState): CostEstimate {
  // Determine content generation base cost
  const depthCost = CONTENT_COST[formData.depth as keyof typeof CONTENT_COST] || 200;

  // Estimate module complexity
  let moduleComplexity = MODULE_COMPLEXITY.moderate;
  if (formData.module.toLowerCase().includes('advanced') || formData.level === AcademicLevel.PHD) {
    moduleComplexity = MODULE_COMPLEXITY.complex;
  } else if (
    formData.module.toLowerCase().includes('intro') ||
    formData.level === AcademicLevel.BACHELOR
  ) {
    moduleComplexity = MODULE_COMPLEXITY.simple;
  }

  // Count structure requirements (each adds complexity)
  const structureCount = Object.values(formData.structure).filter(Boolean).length;
  const structureCost = structureCount * 30; // 30 credits per enabled structure option

  // Calculate breakdown
  const contentGeneration = Math.round(depthCost * moduleComplexity) + structureCost;
  const webSearch = structureCount > 0 ? WEB_SEARCH_COST : 0;
  const formatting = FORMATTING_COST;

  const totalCredits = contentGeneration + webSearch + formatting;
  const totalSeconds = Math.round(totalCredits * TIME_PER_CREDIT) + 10; // base 10 seconds

  return {
    estimatedCredits: totalCredits,
    estimatedSeconds: Math.min(totalSeconds, 180), // Cap at 3 minutes estimate
    breakdown: {
      contentGeneration,
      webSearch,
      formatting,
    },
    confidence: getConfidence(formData),
  };
}

function getConfidence(formData: LessonFormState): 'high' | 'medium' | 'low' {
  // Confidence is high if parameters are standard
  const isStandard =
    formData.depth === LessonDepth.STANDARD &&
    formData.level === AcademicLevel.BACHELOR &&
    Object.values(formData.structure).filter(Boolean).length <= 5;

  if (isStandard) return 'high';
  if (Object.values(formData.structure).filter(Boolean).length <= 8) return 'medium';
  return 'low';
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
}

export function formatCredits(credits: number): string {
  if (credits < 1000) return `${credits}`;
  return `${(credits / 1000).toFixed(1)}k`;
}
