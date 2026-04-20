import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Question, ExamResult, AppState } from '../types';
import { parseQuestionsJSON } from '../utils/jsonParser';

interface QuizContextType {
  state: AppState;
  addQuestions: (newQuestions: Question[]) => void;
  clearQuestions: () => void;
  saveExamResult: (result: ExamResult) => void;
  toggleStar: (id: string) => void;
  addToIncorrectNotes: (id: string) => void;
  removeFromIncorrectNotes: (id: string) => void;
  deleteQuestion: (id: string) => void;
}

const defaultState: AppState = {
  questions: [],
  examResults: [],
  incorrectNotes: []
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    let staticQuestions: Question[] = [];
    
    try {
      const staticModules = import.meta.glob('../problem/*.json', { eager: true });
      Object.entries(staticModules).forEach(([path, module]) => {
        const match = path.match(/\/([^\/]+)\.json$/);
        const sourceName = match ? match[1] : 'static';
        const moduleData = (module as any).default || module;
        
        try {
          const parsed = parseQuestionsJSON(JSON.stringify(moduleData), sourceName);
          staticQuestions = [...staticQuestions, ...parsed];
        } catch(e) {
          console.error(`Error parsing static problem ${path}`, e);
        }
      });
    } catch(e) {
      console.error('Failed to load static problems', e);
    }

    let savedState = defaultState;
    const saved = localStorage.getItem('quizAppState');
    if (saved) {
      try {
        savedState = { ...defaultState, ...JSON.parse(saved) };
      } catch (e) {
        // Fallback
      }
    }
    
    const savedStatesMap = new Map(savedState.questions.map(q => [q.id, q]));
    
    const mergedStaticQuestions = staticQuestions.map(q => {
      const savedQ = savedStatesMap.get(q.id);
      if (savedQ) {
        return { ...q, isStarred: savedQ.isStarred };
      }
      return q;
    });

    const staticIds = new Set(staticQuestions.map(q => q.id));
    const userQuestions = savedState.questions.filter(q => !staticIds.has(q.id));
    
    return {
      ...savedState,
      questions: [...mergedStaticQuestions, ...userQuestions]
    };
  });

  useEffect(() => {
    localStorage.setItem('quizAppState', JSON.stringify(state));
  }, [state]);

  const addQuestions = (newQuestions: Question[]) => {
    setState(prev => ({
      ...prev,
      questions: [...prev.questions, ...newQuestions]
    }));
  };

  const clearQuestions = () => {
    setState(prev => ({ ...prev, questions: [] }));
  };

  const saveExamResult = (result: ExamResult) => {
    setState(prev => {
      const newIncorrectNotes = [...new Set([...prev.incorrectNotes, ...result.incorrectQuestionIds])];
      return {
        ...prev,
        examResults: [...prev.examResults, result],
        incorrectNotes: newIncorrectNotes
      };
    });
  };

  const toggleStar = (id: string) => {
    setState(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, isStarred: !q.isStarred } : q)
    }));
  };

  const addToIncorrectNotes = (id: string) => {
    setState(prev => {
      if (prev.incorrectNotes.includes(id)) return prev;
      return { ...prev, incorrectNotes: [...prev.incorrectNotes, id] };
    });
  };

  const removeFromIncorrectNotes = (id: string) => {
    setState(prev => ({
      ...prev,
      incorrectNotes: prev.incorrectNotes.filter(noteId => noteId !== id)
    }));
  };

  const deleteQuestion = (id: string) => {
    setState(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
      incorrectNotes: prev.incorrectNotes.filter(noteId => noteId !== id)
    }));
  };

  return (
    <QuizContext.Provider value={{ 
        state, addQuestions, clearQuestions, saveExamResult, 
        toggleStar, addToIncorrectNotes, removeFromIncorrectNotes, deleteQuestion 
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error("useQuizContext must be used within QuizProvider");
  return context;
};
