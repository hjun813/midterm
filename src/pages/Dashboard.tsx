import React from 'react';
import { useQuizContext } from '../context/QuizContext';
import { Database, TrendingUp, AlertTriangle, PlayCircle, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { state } = useQuizContext();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedSubject = searchParams.get('subject');
  const [isRandom, setIsRandom] = React.useState(false);

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

  return (
    <div className="fade-in">
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>GyoDong과 함께 준비해요!</div>
          <h1 className={styles.title}>{pageTitle}</h1>
          <p className={styles.subtitle}>
            {selectedSubject 
              ? `${selectedSubject} 과목도 한교동이랑 같이하면 문제 없어요!`
              : "한교동과 함께 모든 과목을 완벽하게 마스터해봐요!"}
          </p>
          <div className={styles.heroActions}>
            <button className="btn-primary" onClick={() => navigate(`/study?${selectedSubject ? `subject=${selectedSubject}&` : ''}random=${isRandom}`)}>
              전체 학습하기
            </button>
            <button className={`${styles.btnOutline}`} onClick={() => navigate(`/exam?${selectedSubject ? `subject=${selectedSubject}&` : ''}random=${isRandom}`)}>
              실전 테스트
            </button>
          </div>
        </div>
        <img src={heroEmoji} alt="hero" className={styles.heroCharacter} />
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{totalQuestions}</span>
            <span className={styles.statLabel}>전체 문제 수</span>
          </div>
          <img src={statEmoji1} alt="stat" />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{incorrectCount}</span>
            <span className={styles.statLabel}>오답 노트 개수</span>
          </div>
          <img src={statEmoji2} alt="stat" />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{state.examResults.length}</span>
            <span className={styles.statLabel}>완료한 테스트</span>
          </div>
          <img src={statEmoji3} alt="stat" />
        </div>
      </div>

      <div className={styles.tocSection}>
        <h2 className={styles.tocTitle}>목차</h2>
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
              <Database size={40} />
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
