import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import QuestionCard from '../components/QuestionCard';
import { ArrowLeft, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import { shuffleArray } from '../utils/jsonParser';
import styles from './Mode.module.css'; // Will share styles for Modes

const StudyMode: React.FC = () => {
  const { state, addToIncorrectNotes } = useQuizContext();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const fileFilter = searchParams.get('file');
  const subjectFilter = searchParams.get('subject');
  const isRandom = searchParams.get('random') === 'true';
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  // Filter and optionally shuffle questions
  const questions = useMemo(() => {
    let list = state.questions;
    if (fileFilter) list = list.filter(q => q.sourceFile === fileFilter);
    else if (subjectFilter) list = list.filter(q => q.subject === subjectFilter);
    
    return isRandom ? shuffleArray(list) : list;
  }, [state.questions, fileFilter, subjectFilter, isRandom]);

  if (questions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <AlertCircle size={48} className="mb-4 text-secondary" />
        <h2>저장된 문제가 없습니다</h2>
        <p>문제 관리 페이지에서 JSON으로 문제를 추가해주세요.</p>
        <button className="btn-primary mt-6" onClick={() => navigate('/input')}>
          문제 추가하러 가기
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = !!selectedAnswers[currentQuestion.id];
  const isFeedbackShown = showFeedback[currentQuestion.id];

  const handleSelectOption = (answer: string | string[]) => {
    if (isFeedbackShown) return; // Cannot change answer after showing feedback
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleCheckAnswer = () => {
    if (!isAnswered) return;
    
    const userAnswer = selectedAnswers[currentQuestion.id];
    let isCorrect = false;

    if (currentQuestion.type === 'blank' && Array.isArray(currentQuestion.answer)) {
      const uArr = Array.isArray(userAnswer) ? userAnswer : String(userAnswer).split(',').map(s => s.trim());
      isCorrect = currentQuestion.answer.every((ans, i) => uArr[i]?.toLowerCase() === ans.toLowerCase());
    } else {
      isCorrect = String(userAnswer).trim().toLowerCase() === String(currentQuestion.answer).trim().toLowerCase();
    }
    
    if (!isCorrect && currentQuestion.type !== 'essay') {
      addToIncorrectNotes(currentQuestion.id);
    }

    setShowFeedback(prev => ({
      ...prev,
      [currentQuestion.id]: true
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.modeBadge}>
          <BookOpen size={16} /> 학습 모드
        </div>
        <div className={styles.progress}>
          문제 {currentIndex + 1} / {questions.length}
        </div>
        <button className={styles.exitBtn} onClick={() => navigate('/')}>
          종료
        </button>
      </header>
      
      <div className={styles.progressBarContainer}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        />
      </div>

      <div className={styles.cardContainer}>
        <QuestionCard 
          question={currentQuestion}
          mode="study"
          selectedAnswer={selectedAnswers[currentQuestion.id]}
          onSelectOption={handleSelectOption}
          showFeedback={isFeedbackShown}
          index={currentIndex}
        />
      </div>

      <div className={styles.actions}>
        <button 
          className="btn-secondary" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={18} /> 이전
        </button>

        {!isFeedbackShown ? (
          <button 
            className="btn-primary" 
            onClick={handleCheckAnswer}
            disabled={!isAnswered}
          >
            정답 확인
          </button>
        ) : (
          <button 
            className="btn-primary" 
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            다음 문제 <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyMode;
