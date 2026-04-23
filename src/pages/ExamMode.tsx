import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useQuizContext } from '../context/QuizContext';
import { checkAnswer } from '../utils/quizUtils';
import QuestionCard from '../components/QuestionCard';
import { PenTool, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import styles from './Mode.module.css';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

import { shuffleArray } from '../utils/jsonParser';

const ExamMode: React.FC = () => {
  const { state, saveExamResult } = useQuizContext();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const fileFilter = searchParams.get('file');
  const subjectFilter = searchParams.get('subject');
  const isRandom = searchParams.get('random') === 'true';
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [examScore, setExamScore] = useState(0);
  
  // Filter and optionally shuffle questions
  const questions = useMemo(() => {
    let list = state.questions.filter(q => !state.excludedQuestionIds.includes(q.id));
    if (fileFilter) list = list.filter(q => q.sourceFile === fileFilter);
    else if (subjectFilter) list = list.filter(q => q.subject === subjectFilter);
    
    if (isRandom) list = shuffleArray(list);
    if (limit) list = list.slice(0, limit);
    
    return list;
  }, [state.questions, state.excludedQuestionIds, fileFilter, subjectFilter, isRandom, limit]);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 min per question default

  useEffect(() => {
    if (questions.length === 0 || isFinished) return;
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [questions.length, isFinished]);

  if (questions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <AlertCircle size={48} className="mb-4 text-secondary" />
        <h2>시험을 치를 수 있는 문제가 없습니다</h2>
        <p>저장된 문제가 없거나 모두 범위에서 제외되었습니다.</p>
        <button className="btn-primary mt-6" onClick={() => navigate('/input')}>
          문제 추가하러 가기
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (answer: string | string[]) => {
    if (isFinished) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
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

  const handleSubmitExam = () => {
    let correctCount = 0;
    const incorrectIds: string[] = [];

    questions.forEach(q => {
      const userAnswer = selectedAnswers[q.id];
      const isCorrect = checkAnswer(userAnswer, q.answer, q.type || 'multiple');

      if (isCorrect || q.type === 'essay') {
        correctCount++;
      } else {
        incorrectIds.push(q.id);
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setExamScore(score);

    saveExamResult({
      id: uuidv4(),
      date: new Date().toISOString(),
      score,
      totalQuestions: questions.length,
      incorrectQuestionIds: incorrectIds
    });

    setIsFinished(true);
  };

  const currentSubject = subjectFilter || (fileFilter ? state.questions.find(q => q.sourceFile === fileFilter)?.subject : null);
  const isKirbyTheme = currentSubject === 'koreanGrammer';
  const isPinguTheme = currentSubject === 'koreanHistory';
  const isSlowpokeTheme = currentSubject === 'multiProcess';

  if (isFinished) {
    return (
      <div className={`${styles.container} fade-in`} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="card text-center" style={{ maxWidth: '600px', width: '100%', padding: '48px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
            <CheckCircle size={64} style={{ color: 'var(--success-color)', margin: '0 auto' }} />
            {isKirbyTheme && <img src="/assets/kirby_hero.png" alt="kirby" style={{ position: 'absolute', top: '-20px', right: '-40px', width: '60px' }} />}
            {isPinguTheme && <img src="/assets/pingu_happy.png" alt="pingu" style={{ position: 'absolute', top: '-20px', right: '-40px', width: '60px' }} />}
            {isSlowpokeTheme && <img src="/assets/slowpoke_3.webp" alt="slowpoke" style={{ position: 'absolute', top: '-20px', right: '-40px', width: '60px' }} />}
          </div>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>
            {isSlowpokeTheme ? "오... 다 풀었나요...?" : "시험 완료!"}
          </h2>
          <div style={{ fontSize: '64px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '32px' }}>
            {examScore}점
          </div>
          <p className="text-secondary" style={{ marginBottom: '40px', fontSize: '18px' }}>
            {isSlowpokeTheme 
              ? `천천히... ${questions.length}문제 중 ${Math.round((examScore/100)*questions.length)}문제를 맞혔어요...`
              : `총 ${questions.length}문제 중 ${Math.round((examScore/100)*questions.length)}문제 정답`}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={() => navigate('/review')}>
              오답 노트 가기
            </button>
            <button className="btn-primary" onClick={() => navigate('/')}>
              대시보드로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.modeBadge} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)' }}>
          <PenTool size={16} /> 실전 시험
        </div>
        <div className={`${styles.timer} ${timeLeft < 60 ? styles.warning : ''}`}>
          <Clock size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
          {formatTime(timeLeft)}
        </div>
        <button className={styles.exitBtn} onClick={() => navigate('/')}>
          포기하기
        </button>
      </header>
      
      <div className={styles.progressBarContainer}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${((currentIndex) / questions.length) * 100}%`, backgroundColor: 'var(--error-color)' }}
        />
      </div>

      <div className={styles.cardContainer}>
        <QuestionCard 
          question={currentQuestion}
          mode="exam"
          selectedAnswer={selectedAnswers[currentQuestion.id]}
          onSelectOption={handleSelectOption}
          showFeedback={false}
          index={currentIndex}
        />
      </div>

      <div className={styles.actions}>
        <button 
          className="btn-secondary" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
        >
          이전
        </button>

        <div style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
          {currentIndex + 1} / {questions.length}
        </div>

        {currentIndex === questions.length - 1 ? (
          <button 
            className="btn-primary" 
            onClick={handleSubmitExam}
            style={{ backgroundColor: 'var(--error-color)' }}
          >
            최종 제출
          </button>
        ) : (
          <button 
            className="btn-primary" 
            onClick={handleNext}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamMode;
