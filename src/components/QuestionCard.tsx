import React, { useState } from 'react';
import type { Question } from '../types';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
  question: Question;
  mode: 'exam' | 'study' | 'review';
  selectedAnswer?: string;
  onSelectOption?: (answer: string) => void;
  showFeedback?: boolean; // Show whether answer is correct/incorrect
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
  const [textAnswer, setTextAnswer] = useState(selectedAnswer || '');

  const isMultipleChoice = Array.isArray(question.options) && question.options.length > 0;
  
  const isCorrect = selectedAnswer === question.answer;

  const handleTextSubmit = () => {
    if (onSelectOption) {
      onSelectOption(textAnswer);
    }
  };

  return (
    <div className={`${styles.card} card fade-in`}>
      <div className={styles.header}>
        <div className={styles.badges}>
           {index !== undefined && <span className={styles.indexBadge}>Q{index + 1}</span>}
           <span className={`${styles.difficulty} ${styles[question.difficulty]}`}>
             {question.difficulty.toUpperCase()}
           </span>
        </div>
        
        {mode === 'review' && onToggleStar && (
          <button 
            className={`${styles.starBtn} ${question.isStarred ? styles.starred : ''}`} 
            onClick={onToggleStar}
            aria-label="별표 토글"
          >
            <Star fill={question.isStarred ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      <h2 className={styles.questionText}>{question.question}</h2>

      <div className={styles.inputArea}>
        {isMultipleChoice ? (
          <div className={styles.optionsList}>
            {question.options?.map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isOptionCorrect = opt === question.answer;
              
              let optionStateClass = '';
              if (showFeedback) {
                if (isOptionCorrect) optionStateClass = styles.correctOption;
                else if (isSelected && !isOptionCorrect) optionStateClass = styles.wrongOption;
              } else if (isSelected) {
                optionStateClass = styles.selectedOption;
              }

              return (
                <button
                  key={i}
                  className={`${styles.optionBtn} ${optionStateClass}`}
                  onClick={() => onSelectOption && onSelectOption(opt)}
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
        ) : (
          <div className={styles.shortAnswerArea}>
            <input 
              type="text" 
              className={`${styles.textInput} ${showFeedback ? (isCorrect ? styles.correctInput : styles.wrongInput) : ''}`}
              placeholder="정답을 입력하세요"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={showFeedback && mode !== 'review'}
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
                  <span className={styles.wrongText}><XCircle size={18}/> 오답 (정답: {question.answer})</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showFeedback && (
        <div className={`${styles.explanationArea} fade-in`}>
          <div className={styles.explanationHeader}>해설</div>
          <p className={styles.explanationText}>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
