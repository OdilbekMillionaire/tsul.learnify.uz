
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
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
