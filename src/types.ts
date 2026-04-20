export type Difficulty = 'easy' | 'medium' | 'hard';
export type Probability = 'high' | 'medium' | 'low';

export type QuestionType = 'multiple' | 'ox' | 'short' | 'blank' | 'essay';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // Array of strings for choices.
  answer: string | string[]; // Single string or array for blank types.
  explanation: string;
  difficulty: Difficulty;
  probability: Probability;
  isStarred?: boolean;
  subject: string;
  sourceFile: string;
}

export interface ExamResult {
  id: string;
  date: string; // ISO format
  score: number;
  totalQuestions: number;
  incorrectQuestionIds: string[];
}

export interface AppState {
  questions: Question[];
  examResults: ExamResult[];
  incorrectNotes: string[]; // Array of question IDs
  excludedQuestionIds: string[]; // Array of question IDs to exclude
  isShuffleEnabled?: boolean;
}
