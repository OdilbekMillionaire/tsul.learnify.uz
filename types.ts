
export enum Language {
  UZ_LATIN = 'uz_latin',
  UZ_CYRILLIC = 'uz_cyrillic',
  ENGLISH = 'en',
  RUSSIAN = 'ru',
}

export enum AcademicLevel {
  BACHELOR = 'bachelor',
  MASTER = 'master',
  PHD = 'phd',
}

export enum LessonDepth {
  OVERVIEW = 'overview',
  STANDARD = 'standard',
  ADVANCED = 'advanced',
}

export enum SimplicityLevel {
  CHILD = 'child',
  STUDENT = 'student',
  RESEARCHER = 'researcher',
}

export enum LessonFocus {
  THEORETICAL = 'theoretical',
  PRACTICAL = 'practical',
  CASE_BASED = 'case_based',
  LEGISLATIVE = 'legislative',
}

export type ViewState = 'landing' | 'create' | 'lesson' | 'about';

export interface LessonFormState {
  module: string;
  topic: string;
  level: AcademicLevel;
  depth: LessonDepth;
  simplicity: SimplicityLevel;
  focus: LessonFocus;
  structure: {
    bulletPoints: boolean;
    tables: boolean;
    summaries: boolean;
    stepByStep: boolean;
    caseLaw: boolean;
    doctrines: boolean;
    comparativeAnalysis: boolean;
    practicalExercises: boolean;
    glossary: boolean;
    bibliography: boolean;
  };
}

// AI Generated Content Structure
export interface CourtCase {
  name: string;
  year: string;
  court: string;
  facts: string;
  legalIssue: string;
  holding: string;
  significance: string;
}

export interface Doctrine {
  name: string;
  definition: string;
  origin: string;
  application: string;
  currentStatus: string;
}

export interface ContentSection {
  title: string;
  content: string; // Markdown supported
}

export interface SearchSource {
  title: string;
  url: string;
  source: string;
}

export interface LessonResponse {
  title: string;
  module: string;
  objectives: string[];
  concepts: string[];
  definitionAndStructure: ContentSection;
  historicalDevelopment: ContentSection;
  comparativeAnalysis?: ContentSection;
  practicalExercises?: Array<{ question: string; answer: string }>;
  glossary?: Array<{ term: string; definition: string }>;
  bibliography?: string[];
  courtCases?: CourtCase[];
  legalDoctrines?: Doctrine[];
  commonMistakes: string[];
  discussionQuestions: string[];
  conclusion: string;
  sourceLinks?: SearchSource[]; // Web search sources
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// ===== RAG (RETRIEVAL AUGMENTED GENERATION) TYPES =====

export type CredibilityBadge = 'official' | 'academic' | 'trusted' | 'general';
export type SourceType = 'lex_uz' | 'international' | 'government' | 'academic' | 'educational';

export interface SourceContent {
  sourceId: string;
  sourceType: SourceType;
  title: string;
  url: string;
  relevanceScore: number; // 0-100
  excerpt: string; // First 500 chars of actual content
  credibilityBadge: CredibilityBadge;
  fetchedAt: Date;
}

export interface LessonSourceAttributions {
  [sectionId: string]: {
    primarySource: SourceContent;
    supportingSources: SourceContent[];
    citationText: string; // "[Source: Lex.uz]" format
  };
}

export interface RAGContext {
  sources: SourceContent[];
  embeddings: string[]; // For future semantic search
  credibilityScore: number; // 0-100
  officialSourcePercentage: number; // % of lesson from official sources
}

export interface CredibilityMetrics {
  officialSources: number;
  academicSources: number;
  trustedSources: number;
  generalSources: number;
  credibilityScore: number; // weighted 0-100
  badges: string[]; // e.g., ['official_lex', 'academic_endorsed']
}

export interface ProgressEvent {
  stage: 'search' | 'generate' | 'refine';
  progressPercent: number; // 0, 30, 50, 70, 90, 100
  statusMessage: string;
  elapsedSeconds: number;
  estimatedRemainingSeconds?: number;
}

// Extended lesson response with RAG metadata
export interface EnhancedLessonResponse extends LessonResponse {
  ragContext?: RAGContext;
  sourceAttributions?: LessonSourceAttributions;
  credibilityMetrics?: CredibilityMetrics;
}

// ===== NEW TYPES FOR FEATURES =====

// Dark Mode / Theme
export type Theme = 'light' | 'dark';

// Cost Estimation
export interface CostEstimate {
  estimatedCredits: number;
  estimatedSeconds: number;
  breakdown: {
    contentGeneration: number;
    webSearch: number;
    formatting: number;
  };
  confidence: 'high' | 'medium' | 'low';
}

// Custom Templates
export interface LessonTemplate {
  id: string;
  name: string;
  description: string;
  formDefaults: LessonFormState;
  createdAt: Date;
  lastUsed?: Date;
  isFavorite: boolean;
}

// Stored Lessons (for history)
export interface StoredLesson {
  id: string;
  title: string;
  module: string;
  topic: string;
  content: LessonResponse;
  chatHistory: ChatMessage[];
  createdAt: Date;
  lastViewed: Date;
  rating?: number;
  userNotes?: string;
  tags: string[];
  sourceCredits: number;
}

// Streaming
export interface LessonStreamChunk {
  section: 'objectives' | 'concepts' | 'content' | 'exercises' | 'glossary' | 'bibliography';
  partial: Partial<LessonResponse>;
  progress: number;
  isComplete: boolean;
}

// Export Formats
export type ExportFormat = 'pdf' | 'markdown' | 'html';
export interface ExportOptions {
  format: ExportFormat;
  includeChat: boolean;
  includeSources: boolean;
  includeMetadata: boolean;
  fileName: string;
}
