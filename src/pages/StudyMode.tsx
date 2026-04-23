import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuizContext } from '../context/QuizContext';
import { checkAnswer } from '../utils/quizUtils';
import QuestionCard from '../components/QuestionCard';
import { ArrowLeft, ArrowRight, BookOpen, AlertCircle, Sparkles, EyeOff } from 'lucide-react';
import { shuffleArray } from '../utils/jsonParser';
import styles from './Mode.module.css';

const EMOJIS = [
  '/assets/emoji_1.png',
  '/assets/emoji_2.png',
  '/assets/emoji_3.png',
  '/assets/emoji_4.png',
  '/assets/emoji_5.png',
  '/assets/emoji_6.png',
  '/assets/emoji_7.png',
  '/assets/emoji_8.png',
  '/assets/emoji_9.png',
  '/assets/emoji_10.png',
  '/assets/emoji_11.png',
  '/assets/emoji_12.png',
  '/assets/emoji_13.png',
  '/assets/emoji_14.png',
  '/assets/emoji_15.png',
  '/assets/emoji_16.png'
];

const SUCCESS_MESSAGES = [
  "정답이에요!",
  "천재인데요?!",
  "참 잘했어요!",
  "완벽해요!",
  "대단해요!",
  "교동이가 칭찬해요!",
  "최고예요!"
];

const StudyMode: React.FC = () => {
  const { state, addToIncorrectNotes, toggleExcludeQuestion } = useQuizContext();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const fileFilter = searchParams.get('file');
  const subjectFilter = searchParams.get('subject');
  const isRandom = searchParams.get('random') === 'true';
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [randomEmoji, setRandomEmoji] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  
  const currentSubject = subjectFilter || (fileFilter ? state.questions.find(q => q.sourceFile === fileFilter)?.subject : null);
  const isKirbyTheme = currentSubject === 'koreanGrammer';
  const isPinguTheme = currentSubject === 'koreanHistory';
  const isSlowpokeTheme = currentSubject === 'multiProcess';

  // Filter and optionally shuffle questions
  const questions = useMemo(() => {
    let list = state.questions.filter(q => !state.excludedQuestionIds.includes(q.id));
    if (fileFilter) list = list.filter(q => q.sourceFile === fileFilter);
    else if (subjectFilter) list = list.filter(q => q.subject === subjectFilter);
    
    if (isRandom) list = shuffleArray(list);
    if (limit) list = list.slice(0, limit);
    
    return list;
  }, [state.questions, state.excludedQuestionIds, fileFilter, subjectFilter, isRandom, limit]);

  if (questions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <AlertCircle size={48} className="mb-4 text-secondary" />
        <h2>저장된 문제가 없거나 모두 제외되었습니다</h2>
        <p>문제 관리 페이지에서 JSON으로 문제를 추가하거나, 제외된 설정을 확인해주세요.</p>
        <button className="btn-primary mt-6" onClick={() => navigate('/input')}>
          문제 추가하러 가기
        </button>
      </div>
    );
  }

  // Adjust currentIndex if it's out of bounds after filtering
  if (currentIndex >= questions.length && questions.length > 0) {
    setCurrentIndex(questions.length - 1);
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
    const isCorrect = checkAnswer(userAnswer, currentQuestion.answer, currentQuestion.type || 'multiple');
    
    if (!isCorrect && currentQuestion.type !== 'essay') {
      addToIncorrectNotes(currentQuestion.id);
      
      if (isKirbyTheme) {
        setRandomEmoji('/assets/kirby_sick.jpg');
        setSuccessMessage("앗! 다시 한번 생각해보세요.");
        setShowEmoji(true);
        setTimeout(() => setShowEmoji(false), 1500);
      } else if (isPinguTheme) {
        const pinguIncorrectEmojis = [
          '/assets/pingu_angry.png',
          '/assets/pingu_angry_2.jpg',
          '/assets/pingu_cry.jpg',
          '/assets/pingu_shock.jpg',
          '/assets/pingu_suprised.png'
        ];
        const randomIncorrectEmoji = pinguIncorrectEmojis[Math.floor(Math.random() * pinguIncorrectEmojis.length)];
        
        setRandomEmoji(randomIncorrectEmoji);
        setSuccessMessage("앗! 핑구가 속상해해요. 다시 해볼까요?");
        setShowEmoji(true);
        setTimeout(() => setShowEmoji(false), 1500);
      } else if (isSlowpokeTheme) {
        setRandomEmoji('/assets/slowpoke_6.jpg');
        setSuccessMessage("어라...? 틀렸나...?");
        setShowEmoji(true);
        setTimeout(() => setShowEmoji(false), 2000); // Slowpoke is slow
      }
    } else if (isCorrect) {
      const kirbyEmojis = [
        '/assets/kirby_classic.png', 
        '/assets/kirby_flat.jpg', 
        '/assets/kirby_inhale.jpg', 
        '/assets/kirby_eat.jpg',
        '/assets/kirby_agree.png',
        '/assets/kirby_yep.png',
        '/assets/kirby_round.png',
        '/assets/kirby_car.png',
        '/assets/kirby_hero.png',
        '/assets/waddle_dee_1.png',
        '/assets/waddle_dee_2.png',
        '/assets/waddle_dee_jump.png',
        '/assets/waddle_dee_group.png'
      ];
      const kirbyMessages = ["커비가 칭찬해요!", "뾰로롱! 정답이에요!", "정말 대단해!", "커비처럼 완벽해요!", "꿈의 샘의 기운이 느껴져요!", "커비도 동의해요!", "Yep! Yep! 최고예요!", "와들디와 함께 정답!", "와들디가 박수를 보내요!"];
      
      const pinguEmojis = [
        '/assets/pingu_happy.png',
        '/assets/pingu_full.png',
        '/assets/pingu_satisfied.png',
        '/assets/pingu_tongue.jpg',
        '/assets/pingu_study.png'
      ];
      const pinguMessages = [
        "Noot Noot! 정답이에요!", 
        "핑구가 박수를 쳐요! 🐧", 
        "핑가가 너무 기뻐서 춤을 춰요! ❄️", 
        "요리사 핑구가 축하의 의미로 생선을 준비했대요! 🐟", 
        "핑구의 썰매처럼 빠르게 정답을 맞히셨네요!", 
        "대단해요! 핑구 가족이 모두 기뻐하고 있어요! 🐧💖",
        "열공 중인 핑구도 인정하는 정답입니다!"
      ];

      const slowpokeEmojis = [
        '/assets/slowpoke_1.jpeg',
        '/assets/slowpoke_2.jpeg',
        '/assets/slowpoke_3.webp',
        '/assets/slowpoke_4.jpg',
        '/assets/slowpoke_5.jpg',
        '/assets/slowpoke_7.jpg',
        '/assets/slowpoke_8.jpg',
        '/assets/slowpoke_9.jpg',
        '/assets/slowpoke_10.jpg',
        '/assets/slowpoke_11.jpg'
      ];
      const slowpokeMessages = [
        "와... 맞았어요... (3초 뒤)", 
        "천천히... 정답이에요...", 
        "하아암... 잘했어요...", 
        "야돈야돈! 정답이다!", 
        "어...? 정답이었네...?", 
        "느릿느릿 정답 완료!"
      ];

      const emoji = isKirbyTheme 
        ? kirbyEmojis[Math.floor(Math.random() * kirbyEmojis.length)]
        : (isPinguTheme 
            ? pinguEmojis[Math.floor(Math.random() * pinguEmojis.length)]
            : (isSlowpokeTheme
                ? slowpokeEmojis[Math.floor(Math.random() * slowpokeEmojis.length)]
                : EMOJIS[Math.floor(Math.random() * EMOJIS.length)]));
      
      const msg = isKirbyTheme
        ? kirbyMessages[Math.floor(Math.random() * kirbyMessages.length)]
        : (isPinguTheme
            ? pinguMessages[Math.floor(Math.random() * pinguMessages.length)]
            : (isSlowpokeTheme
                ? slowpokeMessages[Math.floor(Math.random() * slowpokeMessages.length)]
                : SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]));
        
      setRandomEmoji(emoji);
      setSuccessMessage(msg);
      setShowEmoji(true);
      setTimeout(() => setShowEmoji(false), isSlowpokeTheme ? 2000 : 1000);
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

  const handleExclude = () => {
    if (window.confirm('이 문제를 시험 범위에서 제외하시겠습니까? (학습 및 시험 과정에서 제외됩니다)')) {
      toggleExcludeQuestion(currentQuestion.id);
      // currentIndex will remain same, but the 'currentQuestion' will be the next one in the updated list
      // If we are at the last question, we should go back one.
      if (currentIndex >= questions.length - 1 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={styles.excludeBtn} 
            onClick={handleExclude}
            title="범위에서 제외"
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: 'var(--error-color)',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            <EyeOff size={16} /> 제외
          </button>
          <button className={styles.exitBtn} onClick={() => navigate('/')}>
            종료
          </button>
        </div>
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
      {showEmoji && randomEmoji && (
        <div className={styles.emojiOverlay}>
          <div className={styles.emojiContent}>
            <img src={randomEmoji} alt="celebration" className={styles.emojiImg} />
            <div className={styles.emojiText}>{successMessage}</div>
            <Sparkles className={styles.sparkle} size={24} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMode;
