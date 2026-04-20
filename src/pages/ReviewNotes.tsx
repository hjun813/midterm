import React, { useState } from 'react';
import { useQuizContext } from '../context/QuizContext';
import QuestionCard from '../components/QuestionCard';
import { Star } from 'lucide-react';
import type { Question } from '../types';

const ReviewNotes: React.FC = () => {
  const { state, toggleStar, removeFromIncorrectNotes } = useQuizContext();
  const [filterStarred, setFilterStarred] = useState(false);

  // Derive the incorrect questions
  const incorrectQuestions = state.incorrectNotes
    .map(id => state.questions.find(q => q.id === id))
    .filter((q): q is Question => q !== undefined);

  const displayedQuestions = filterStarred 
    ? incorrectQuestions.filter(q => q.isStarred)
    : incorrectQuestions;

  if (state.incorrectNotes.length === 0) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <Star size={48} className="mb-4" />
        <h2>오답 노트가 비어있습니다!</h2>
        <p>학습을 진행하고 틀린 문제를 채워보세요.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>오답 노트</h1>
          <p style={{ color: 'var(--text-secondary)' }}>틀린 문제를 다시 확인하고 복습하세요.</p>
        </div>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}>
          <input 
            type="checkbox" 
            checked={filterStarred} 
            onChange={(e) => setFilterStarred(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--primary-color)' }}
          />
          <Star size={18} style={{ color: 'var(--warning-color)' }} /> 
          중요 문제만 보기
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {displayedQuestions.map((q, i) => (
          <div key={q.id} style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-16px', right: '0', display: 'flex', gap: '8px', zIndex: 1 }}>
              <button 
                onClick={() => removeFromIncorrectNotes(q.id)}
                style={{ backgroundColor: 'var(--bg-card)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}
              >
                오답노트에서 제거
              </button>
            </div>
            {/* We render QuestionCard in 'review' mode so user can see answer directly and toggle star */}
            <QuestionCard 
              question={q} 
              mode="review" 
              selectedAnswer={q.answer} // Display the correct answer
              showFeedback={true}
              onToggleStar={() => toggleStar(q.id)}
              index={i}
            />
          </div>
        ))}
        
        {displayedQuestions.length === 0 && filterStarred && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            별표(중요) 표시된 오답이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewNotes;
