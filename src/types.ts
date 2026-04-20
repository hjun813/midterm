export type Difficulty = 'easy' | 'medium' | 'hard';
export type Probability = 'high' | 'medium' | 'low';

export interface Question {
  id: string;
  question: string;
  options?: string[]; // Array of strings for choices. Empty or null means short-answer.
  answer: string;
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
}
