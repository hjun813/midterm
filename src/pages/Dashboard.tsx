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
    return `${subStr.charAt(0).toUpperCase() + subStr.slice(1)} 학습`;
  };

  const pageTitle = getSafeTitle(selectedSubject);

  return (
    <div className="fade-in">
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>학습 시작하기</div>
          <h1 className={styles.title}>{pageTitle}</h1>
          <p className={styles.subtitle}>
            {selectedSubject 
              ? `${selectedSubject} 과목의 챕터별 문제를 풀며 완벽하게 대비하세요.`
              : "등록된 다양한 과목의 예상 문제를 풀며 시험을 준비하세요."}
          </p>
          <div className={styles.heroActions}>
            <button className="btn-primary" onClick={() => navigate(`/study?${selectedSubject ? `subject=${selectedSubject}&` : ''}random=${isRandom}`)}>
              과목 전체 학습하기
              <ChevronRight size={18} />
            </button>
            <button className={`${styles.btnOutline}`} onClick={() => navigate(`/exam?${selectedSubject ? `subject=${selectedSubject}&` : ''}random=${isRandom}`)}>
              실전 테스트 응시
            </button>
            <label className={styles.shuffleToggle}>
              <input 
                type="checkbox" 
                checked={isRandom} 
                onChange={(e) => setIsRandom(e.target.checked)} 
              />
              <span className={styles.shuffleText}>랜덤 섞기</span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{totalQuestions}</span>
            <span className={styles.statLabel}>전체 문제 수</span>
          </div>
          <PlayCircle className={styles.statIcon} size={40} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{incorrectCount}</span>
            <span className={styles.statLabel}>오답 노트 개수</span>
          </div>
          <AlertTriangle className={styles.statIcon} size={40} style={{ color: 'var(--warning-color)' }} />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{state.examResults.length}</span>
            <span className={styles.statLabel}>완료한 테스트</span>
          </div>
          <TrendingUp className={styles.statIcon} size={40} style={{ color: 'var(--primary-color)' }} />
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
