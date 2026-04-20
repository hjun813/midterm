import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useQuizContext } from '../context/QuizContext';
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
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [examScore, setExamScore] = useState(0);
  
  // Filter and optionally shuffle questions
  const questions = useMemo(() => {
    let list = state.questions;
    if (fileFilter) list = list.filter(q => q.sourceFile === fileFilter);
    else if (subjectFilter) list = list.filter(q => q.subject === subjectFilter);
    
    return isRandom ? shuffleArray(list) : list;
  }, [state.questions, fileFilter, subjectFilter, isRandom]);
  
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
        <h2>저장된 문제가 없습니다</h2>
        <p>문제 관리 페이지에서 JSON으로 문제를 추가해주세요.</p>
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
      let isCorrect = false;

      if (q.type === 'blank' && Array.isArray(q.answer)) {
        const uArr = Array.isArray(userAnswer) ? userAnswer : String(userAnswer || '').split(',').map(s => s.trim());
        isCorrect = q.answer.every((ans, i) => uArr[i]?.toLowerCase() === ans.toLowerCase());
      } else {
        isCorrect = String(userAnswer || '').trim().toLowerCase() === String(q.answer).trim().toLowerCase();
      }

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

  if (isFinished) {
    return (
      <div className={`${styles.container} fade-in`} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="card text-center" style={{ maxWidth: '600px', width: '100%', padding: '48px' }}>
          <CheckCircle size={64} className="mb-4" style={{ color: 'var(--success-color)', margin: '0 auto' }} />
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>시험 완료!</h2>
          <div style={{ fontSize: '64px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '32px' }}>
            {examScore}점
          </div>
          <p className="text-secondary" style={{ marginBottom: '40px', fontSize: '18px' }}>
            총 {questions.length}문제 중 {Math.round((examScore/100)*questions.length)}문제 정답
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
