/**
 * Template Service
 * Manages custom lesson customization templates
 */

import { LessonTemplate, LessonFormState } from '../types';

const STORAGE_KEY = 'learnify_templates';
const MAX_TEMPLATES = 10;

/**
 * Create a new template from form data
 */
export function createTemplate(
  name: string,
  description: string,
  formDefaults: LessonFormState
): LessonTemplate {
  return {
    id: generateId(),
    name,
    description,
    formDefaults,
    createdAt: new Date(),
    isFavorite: false,
  };
}

/**
 * Save template to localStorage
 */
export function saveTemplate(template: LessonTemplate): void {
  const templates = getTemplates();

  // Check if template with same name exists
  const existing = templates.findIndex((t) => t.id === template.id);
  if (existing >= 0) {
    templates[existing] = { ...template, lastUsed: new Date() };
  } else {
    if (templates.length >= MAX_TEMPLATES) {
      // Remove oldest unused template
      const oldest = templates.reduce((prev, curr) =>
        new Date(curr.lastUsed || curr.createdAt).getTime() <
        new Date(prev.lastUsed || prev.createdAt).getTime()
          ? curr
          : prev
      );
      templates.splice(templates.indexOf(oldest), 1);
    }
    templates.push(template);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

/**
 * Get all saved templates
 */
export function getTemplates(): LessonTemplate[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const templates = JSON.parse(stored) as LessonTemplate[];
    // Restore Date objects
    return templates.map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      lastUsed: t.lastUsed ? new Date(t.lastUsed) : undefined,
    }));
  } catch {
    return [];
  }
}

/**
 * Get template by ID
 */
export function getTemplate(id: string): LessonTemplate | null {
  const templates = getTemplates();
  return templates.find((t) => t.id === id) || null;
}

/**
 * Delete template
 */
export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

/**
 * Toggle favorite status
 */
export function toggleFavorite(id: string): void {
  const templates = getTemplates();
  const template = templates.find((t) => t.id === id);
  if (template) {
    template.isFavorite = !template.isFavorite;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }
}

/**
 * Get favorite templates
 */
export function getFavoriteTemplates(): LessonTemplate[] {
  return getTemplates().filter((t) => t.isFavorite).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get recently used templates
 */
export function getRecentTemplates(limit: number = 5): LessonTemplate[] {
  return getTemplates()
    .filter((t) => t.lastUsed)
    .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
    .slice(0, limit);
}

/**
 * Update template last used time
 */
export function markTemplateUsed(id: string): void {
  const templates = getTemplates();
  const template = templates.find((t) => t.id === id);
  if (template) {
    template.lastUsed = new Date();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }
}

function generateId(): string {
  return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Pre-defined templates for quick start
 */
export const PRESET_TEMPLATES: LessonTemplate[] = [
  {
    id: 'preset_legal_brief',
    name: 'Legal Brief',
    description: 'Comprehensive legal analysis with case law and doctrines',
    createdAt: new Date(),
    isFavorite: false,
    formDefaults: {
      module: '',
      topic: '',
      level: 'master' as any,
      depth: 'standard' as any,
      simplicity: 'student' as any,
      focus: 'case_based' as any,
      structure: {
        bulletPoints: true,
        tables: true,
        summaries: true,
        stepByStep: false,
        caseLaw: true,
        doctrines: true,
        comparativeAnalysis: true,
        practicalExercises: false,
        glossary: true,
        bibliography: true,
      },
    },
  },
  {
    id: 'preset_science_overview',
    name: 'Science Overview',
    description: 'Scientific concept with practical exercises and examples',
    createdAt: new Date(),
    isFavorite: false,
    formDefaults: {
      module: '',
      topic: '',
      level: 'bachelor' as any,
      depth: 'overview' as any,
      simplicity: 'student' as any,
      focus: 'theoretical' as any,
      structure: {
        bulletPoints: true,
        tables: true,
        summaries: true,
        stepByStep: true,
        caseLaw: false,
        doctrines: false,
        comparativeAnalysis: false,
        practicalExercises: true,
        glossary: true,
        bibliography: false,
      },
    },
  },
  {
    id: 'preset_business_case',
    name: 'Business Case Study',
    description: 'Real-world business scenario with practical applications',
    createdAt: new Date(),
    isFavorite: false,
    formDefaults: {
      module: '',
      topic: '',
      level: 'bachelor' as any,
      depth: 'standard' as any,
      simplicity: 'student' as any,
      focus: 'practical' as any,
      structure: {
        bulletPoints: true,
        tables: true,
        summaries: true,
        stepByStep: true,
        caseLaw: false,
        doctrines: false,
        comparativeAnalysis: true,
        practicalExercises: true,
        glossary: false,
        bibliography: true,
      },
    },
  },
];
