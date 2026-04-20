import React, { useState, useEffect } from 'react';
import type { Question } from '../types';
import { Star, CheckCircle, XCircle, Info } from 'lucide-react';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  question: Question;
  mode: 'exam' | 'study' | 'review';
  selectedAnswer?: string | string[];
  onSelectOption?: (answer: string | string[]) => void;
  showFeedback?: boolean;
  onToggleStar?: () => void;
  index?: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  mode,
  selectedAnswer,
  onSelectOption,
  showFeedback,
  onToggleStar,
  index
}) => {
  const [textAnswer, setTextAnswer] = useState(() => {
    if (typeof selectedAnswer === 'string') return selectedAnswer;
    if (Array.isArray(selectedAnswer)) return selectedAnswer.join(', ');
    return '';
  });

  useEffect(() => {
    if (typeof selectedAnswer === 'string') setTextAnswer(selectedAnswer);
    else if (Array.isArray(selectedAnswer)) setTextAnswer(selectedAnswer.join(', '));
    else setTextAnswer('');
  }, [selectedAnswer]);

  const checkIsCorrect = () => {
    if (!selectedAnswer) return false;
    if (question.type === 'blank' && Array.isArray(question.answer)) {
      const userAnswers = typeof selectedAnswer === 'string' 
        ? selectedAnswer.split(',').map(s => s.trim()) 
        : selectedAnswer;
      return question.answer.every((ans, i) => 
        userAnswers[i]?.toLowerCase() === ans.toLowerCase()
      );
    }
    if (question.type === 'essay') return true; // Essay is self-graded/manual
    return String(selectedAnswer).trim().toLowerCase() === String(question.answer).trim().toLowerCase();
  };

  const isCorrect = checkIsCorrect();

  const handleTextSubmit = () => {
    if (onSelectOption) {
      if (question.type === 'blank') {
        onSelectOption(textAnswer.split(',').map(s => s.trim()));
      } else {
        onSelectOption(textAnswer);
      }
    }
  };

  const renderInputArea = () => {
    switch (question.type) {
      case 'ox':
        return (
          <div className={styles.oxArea}>
            {['O', 'X'].map((opt) => {
              const isSelected = selectedAnswer === opt;
              const isOptionCorrect = opt === question.answer;
              let btnClass = styles.oxBtn;
              if (showFeedback) {
                if (isOptionCorrect) btnClass += ` ${styles.correctOption}`;
                else if (isSelected) btnClass += ` ${styles.wrongOption}`;
              } else if (isSelected) {
                btnClass += ` ${styles.selectedOption}`;
              }
              return (
                <button
                  key={opt}
                  className={btnClass}
                  onClick={() => onSelectOption?.(opt)}
                  disabled={showFeedback && mode !== 'review'}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        );

      case 'multiple':
        return (
          <div className={styles.optionsList}>
            {question.options?.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isOptionCorrect = opt === question.answer;
              let optionStateClass = '';
              if (showFeedback) {
                if (isOptionCorrect) optionStateClass = styles.correctOption;
                else if (isSelected) optionStateClass = styles.wrongOption;
              } else if (isSelected) {
                optionStateClass = styles.selectedOption;
              }
              return (
                <button
                  key={i}
                  className={`${styles.optionBtn} ${optionStateClass}`}
                  onClick={() => onSelectOption?.(opt)}
                  disabled={showFeedback && mode !== 'review'}
                >
                  <span className={styles.optionMarker}>{String.fromCharCode(65 + i)}</span>
                  <span className={styles.optionText}>{opt}</span>
                  {showFeedback && isOptionCorrect && <CheckCircle className={styles.feedbackIcon} size={20} />}
                  {showFeedback && isSelected && !isOptionCorrect && <XCircle className={styles.feedbackIcon} size={20} />}
                </button>
              );
            })}
          </div>
        );

      case 'essay':
        return (
          <div className={styles.essayArea}>
            <textarea
              className={`${styles.essayInput} ${showFeedback ? styles.essayFeedbackMode : ''}`}
              placeholder="답안을 서술해주세요..."
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={showFeedback && mode !== 'review'}
            />
            {(!showFeedback || mode === 'review') && (
              <button className="btn-primary mt-2" onClick={() => onSelectOption?.(textAnswer)}>
                답안 저장
              </button>
            )}
          </div>
        );

      case 'blank':
      case 'short':
      default:
        return (
          <div className={styles.shortAnswerArea}>
            <input 
              type="text" 
              className={`${styles.textInput} ${showFeedback ? (isCorrect ? styles.correctInput : styles.wrongInput) : ''}`}
              placeholder={question.type === 'blank' ? "답안을 콤마(,)로 구분하여 입력 (예: 답1, 답2)" : "정답을 입력하세요"}
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={showFeedback && mode !== 'review'}
              onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
            />
            {(!showFeedback || mode === 'review') && (
              <button className={`btn-primary ${styles.submitAnswerBtn}`} onClick={handleTextSubmit}>
                확인
              </button>
            )}
            {showFeedback && (
              <div className={styles.shortAnswerFeedback}>
                {isCorrect ? (
                  <span className={styles.correctText}><CheckCircle size={18}/> 정답입니다!</span>
                ) : (
                  <span className={styles.wrongText}>
                    <XCircle size={18}/> 오답 (정답: {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer})
                  </span>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`${styles.card} card fade-in`}>
      <div className={styles.header}>
        <div className={styles.badges}>
           {index !== undefined && <span className={styles.indexBadge}>Q{index + 1}</span>}
           <span className={styles.typeBadge}>{(question.type || 'multiple').toUpperCase()}</span>
           <span className={`${styles.difficulty} ${styles[question.difficulty || 'medium']}`}>
             {(question.difficulty || 'medium').toUpperCase()}
           </span>
        </div>
        {mode === 'review' && onToggleStar && (
          <button 
            className={`${styles.starBtn} ${question.isStarred ? styles.starred : ''}`} 
            onClick={onToggleStar}
          >
            <Star fill={question.isStarred ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <h2 className={styles.questionText}>{question.question}</h2>

      <div className={styles.inputArea}>
        {renderInputArea()}
      </div>

      {showFeedback && (
        <div className={`${styles.explanationArea} fade-in`}>
          <div className={styles.explanationHeader}>
            <Info size={16} /> 해설 및 정답
          </div>
          <p className={styles.explanationText}>{question.explanation}</p>
          {question.type === 'essay' && (
            <div className={styles.modelAnswer}>
              <strong>모범 답안:</strong>
              <div className={styles.answerBox}>{String(question.answer)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
