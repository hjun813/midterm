import React from 'react';
import { useQuizContext } from '../context/QuizContext';
import { Database } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { state, setShuffleEnabled, resetExclusions } = useQuizContext();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedSubject = searchParams.get('subject');
  const isRandom = state.isShuffleEnabled || false;

  // Random emojis for dashboard elements
  const { heroEmoji, statEmoji1, statEmoji2, statEmoji3 } = React.useMemo(() => {
    const allEmojis = Array.from({ length: 16 }, (_, i) => `/assets/emoji_${i + 1}.png`);
    const shuffled = [...allEmojis].sort(() => 0.5 - Math.random());
    return {
      heroEmoji: shuffled[0],
      statEmoji1: shuffled[1],
      statEmoji2: shuffled[2],
      statEmoji3: shuffled[3]
    };
  }, []);

  // Filter questions by subject if selected, or show all if none selected
  const filteredQuestions = selectedSubject 
    ? state.questions.filter(q => q.subject === selectedSubject)
    : state.questions;

  const totalQuestions = filteredQuestions.length;
  const incorrectCount = state.incorrectNotes.filter(id => 
    filteredQuestions.find(q => q.id === id)
  ).length;

  // Group chapters (files) within the subject
  const chaptersMap = new Map();
  filteredQuestions.forEach(q => {
    if (!chaptersMap.has(q.sourceFile)) {
      chaptersMap.set(q.sourceFile, {
        id: q.sourceFile,
        name: q.sourceFile,
        count: 0,
        incorrect: 0
      });
    }
    const chapter = chaptersMap.get(q.sourceFile);
    chapter.count++;
    if (state.incorrectNotes.includes(q.id)) {
      chapter.incorrect++;
    }
  });

  const chapters = Array.from(chaptersMap.values()).sort((a, b) => {
    const nameA = String(a.name || '');
    const nameB = String(b.name || '');
    return nameA.localeCompare(nameB);
  });

  const getSafeTitle = (subject: string | null) => {
    if (!subject) return "프로그래밍 시험 대비";
    const subStr = String(subject);
    if (!subStr) return "프로그래밍 시험 대비";
    return `${subStr.charAt(0).toUpperCase() + subStr.slice(1)} 학습`;
  };

  const pageTitle = getSafeTitle(selectedSubject);
  const isKirbyTheme = selectedSubject === 'koreanGrammer';

  // Pool of all Kirby assets for randomization
  const kirbyHeroPool = [
    "/assets/kirby_hero.png",
    "/assets/kirby_classic.png",
    "/assets/kirby_flat.jpg",
    "/assets/kirby_inhale.jpg",
    "/assets/kirby_eat.jpg",
    "/assets/kirby_agree.png",
    "/assets/kirby_yep.png",
    "/assets/kirby_car.png",
    "/assets/kirby_round.png",
    "/assets/kirby_knife.png",
    "/assets/waddle_dee_jump.png"
  ];

  const randomKirbyHero = React.useMemo(() => {
    return kirbyHeroPool[Math.floor(Math.random() * kirbyHeroPool.length)];
  }, [isKirbyTheme]);

  return (
    <div className="fade-in">
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            {isKirbyTheme ? "💖 Kirby's Dream Land" : "🦖 Hangyo's Learning Lab"}
          </div>
          <h1 className={styles.title}>{pageTitle}</h1>
          <p className={styles.subtitle}>
            {isKirbyTheme 
              ? "커비와 함께 꿈의 샘에서 즐겁게 한글 문법을 배워보아요! 뾰로롱~✨"
              : (selectedSubject === 'cloud'
                ? "구름 위를 걷는 듯 가벼운 마음으로 클라우드 컴퓨팅을 마스터해볼까요? ☁️"
                : "한교동과 함께라면 어떤 과목이든 문제없어요! 지금 바로 시작하세요!")}
          </p>
          <div className={styles.heroActions}>
            <button className="btn-primary" onClick={() => navigate(`/study?${selectedSubject ? `subject=${selectedSubject}&` : ''}random=${isRandom}`)}>
              전체 학습하기
            </button>
            <button className={`${styles.btnOutline}`} onClick={() => navigate(`/exam?${selectedSubject ? `subject=${selectedSubject}&` : ''}random=${isRandom}`)}>
              실전 테스트
            </button>
            <button className={`${styles.btnSpecial}`} onClick={() => navigate(`/exam?${selectedSubject ? `subject=${selectedSubject}&` : ''}random=true&limit=20`)}>
              {isKirbyTheme ? (
                <img src="/assets/kirby_car.png" alt="car" style={{ width: '24px', marginRight: '8px', verticalAlign: 'middle' }} />
              ) : (
                <span style={{ marginRight: '8px' }}>🚀</span>
              )}
              20문제 벼락치기
            </button>
            <label className={styles.shuffleToggle}>
              <input 
                type="checkbox" 
                checked={isRandom} 
                onChange={(e) => setShuffleEnabled(e.target.checked)} 
              />
              <span className={styles.shuffleText}>랜덤 섞기</span>
            </label>
            {state.excludedQuestionIds.length > 0 && (
              <button 
                className={styles.resetExclusionsBtn} 
                onClick={() => {
                  if (window.confirm(`${state.excludedQuestionIds.length}개의 제외된 문제를 다시 포함하시겠습니까?`)) {
                    resetExclusions();
                  }
                }}
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: 'var(--primary-color)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginLeft: '10px'
                }}
              >
                제외 설정 초기화 ({state.excludedQuestionIds.length})
              </button>
            )}
          </div>
        </div>
        <img 
          src={isKirbyTheme ? randomKirbyHero : heroEmoji} 
          alt="hero" 
          className={styles.heroCharacter} 
        />
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{totalQuestions}</span>
            <span className={styles.statLabel}>전체 문제 수</span>
          </div>
          <img src={isKirbyTheme ? "/assets/kirby_inhale.jpg" : statEmoji1} alt="stat" />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{incorrectCount}</span>
            <span className={styles.statLabel}>오답 노트 개수</span>
          </div>
          <img src={isKirbyTheme ? "/assets/enemy_waddle.png" : statEmoji2} alt="stat" />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{state.examResults.length}</span>
            <span className={styles.statLabel}>완료한 테스트</span>
          </div>
          <img src={isKirbyTheme ? "/assets/kirby_eat.jpg" : statEmoji3} alt="stat" />
        </div>
      </div>

      <div className={styles.tocSection}>
        <h2 className={styles.tocTitle}>
          {isKirbyTheme && <img src="/assets/waddle_dee_jump.png" alt="jump" style={{ width: '32px', marginRight: '10px', verticalAlign: 'middle' }} />}
          목차
        </h2>
        <div className={styles.chapterList}>
          {chapters.map((chapter, idx) => (
            <div key={chapter.id || `chapter-${idx}`} className={styles.chapterItem}>
              <div className={styles.chapterNumber}>{idx + 1}</div>
              <div className={styles.chapterInfo}>
                <h3>{chapter.name}</h3>
                <p>{chapter.count}문항 구성 • {chapter.incorrect}개 오답 존재</p>
              </div>
              <div className={styles.chapterActions}>
                <button 
                  className={styles.chapterBtn}
                  onClick={() => navigate(`/study?file=${chapter.id}&random=${isRandom}`)}
                >
                  학습하기
                </button>
                <button 
                  className={`${styles.chapterBtn} ${styles.examBtn}`}
                  onClick={() => navigate(`/exam?file=${chapter.id}&random=${isRandom}`)}
                >
                  테스트
                </button>
              </div>
            </div>
          ))}
          {chapters.length === 0 && (
            <div className={styles.emptyContent}>
              {isKirbyTheme ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src="/assets/waddle_dee_group.png" alt="empty" style={{ width: '180px', marginBottom: '16px', borderRadius: '12px' }} />
                  <p style={{ fontWeight: '600' }}>와들디들이 공부할 준비를 마쳤어요!</p>
                </div>
              ) : (
                <Database size={40} />
              )}
              <p>해당 과목에 등록된 챕터가 없습니다.</p>
              <button className="btn-primary" onClick={() => navigate('/input')}>문제 등록하기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
