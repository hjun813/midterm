import React from 'react';
import { useQuizContext } from '../context/QuizContext';
import { Database, Lightbulb } from 'lucide-react';
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
  const isPinguTheme = selectedSubject === 'koreanHistory';
  const isSlowpokeTheme = selectedSubject === 'multiProcess';

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

  // Expanded Pool of all available Pingu assets
  const pinguHeroPool = [
    "/assets/pingu_happy.png",
    "/assets/pingu_full.png",
    "/assets/pingu_peek.png",
    "/assets/pingu_satisfied.png",
    "/assets/pingu_suprised.png",
    "/assets/pingu_tongue.jpg",
    "/assets/pingu_angry.png",
    "/assets/pingu_angry_2.jpg",
    "/assets/pingu_cry.jpg",
    "/assets/pingu_shock.jpg",
    "/assets/pingu_study.png"
  ];

  const randomPinguHero = React.useMemo(() => {
    return pinguHeroPool[Math.floor(Math.random() * pinguHeroPool.length)];
  }, [isPinguTheme]);

  // Pool of all Slowpoke assets
  const slowpokeHeroPool = [
    "/assets/slowpoke_1.jpeg",
    "/assets/slowpoke_2.jpeg",
    "/assets/slowpoke_3.webp",
    "/assets/slowpoke_4.jpg",
    "/assets/slowpoke_5.jpg",
    "/assets/slowpoke_6.jpg",
    "/assets/slowpoke_7.jpg",
    "/assets/slowpoke_8.jpg",
    "/assets/slowpoke_9.jpg",
    "/assets/slowpoke_10.jpg",
    "/assets/slowpoke_11.jpg"
  ];

  const randomSlowpokeHero = React.useMemo(() => {
    return slowpokeHeroPool[Math.floor(Math.random() * slowpokeHeroPool.length)];
  }, [isSlowpokeTheme]);

  return (
    <div className="fade-in">
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            {isKirbyTheme ? "💖 Kirby's Dream Land" : (isPinguTheme ? "🐧 Pingu's Ice Village" : (isSlowpokeTheme ? "🐚 Slowpoke's Lazy Beach" : "🦖 Hangyo's Learning Lab"))}
          </div>
          <h1 className={styles.title}>{pageTitle}</h1>
          <p className={styles.subtitle}>
            {isKirbyTheme 
              ? "커비와 함께 꿈의 샘에서 즐겁게 한글 문법을 배워보아요! 뾰로롱~✨"
              : (isPinguTheme
                ? "핑구와 핑가, 그리고 친구들과 함께 남극처럼 시원하게 한국사를 마스터해볼까요? Noot Noot! 🐧❄️"
                : (isSlowpokeTheme
                  ? "야돈과 함께라면 운영체제도 느긋하게 정복할 수 있어요... 야돈야돈... 🐚💤"
                  : (selectedSubject === 'cloud'
                    ? "구름 위를 걷는 듯 가벼운 마음으로 클라우드 컴퓨팅을 마스터해볼까요? ☁️"
                    : "한교동과 함께라면 어떤 과목이든 문제없어요! 지금 바로 시작하세요!")))}
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
              ) : (isPinguTheme ? (
                <span style={{ marginRight: '8px' }}>⛄</span>
              ) : (isSlowpokeTheme ? (
                <span style={{ marginRight: '8px' }}>🏖️</span>
              ) : (
                <span style={{ marginRight: '8px' }}>🚀</span>
              )))}
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
          src={isKirbyTheme ? randomKirbyHero : (isPinguTheme ? randomPinguHero : (isSlowpokeTheme ? randomSlowpokeHero : heroEmoji))} 
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
          <img src={isKirbyTheme ? "/assets/kirby_inhale.jpg" : (isPinguTheme ? "/assets/pingu_satisfied.png" : (isSlowpokeTheme ? "/assets/slowpoke_3.webp" : statEmoji1))} alt="stat" />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{incorrectCount}</span>
            <span className={styles.statLabel}>오답 노트 개수</span>
          </div>
          <img src={isKirbyTheme ? "/assets/enemy_waddle.png" : (isPinguTheme ? "/assets/pingu_angry.png" : (isSlowpokeTheme ? "/assets/slowpoke_4.jpg" : statEmoji2))} alt="stat" />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statInfo}>
            <span className={styles.statNumber}>{state.examResults.length}</span>
            <span className={styles.statLabel}>완료한 테스트</span>
          </div>
          <img src={isKirbyTheme ? "/assets/kirby_eat.jpg" : (isPinguTheme ? "/assets/pingu_tongue.jpg" : (isSlowpokeTheme ? "/assets/slowpoke_5.jpg" : statEmoji3))} alt="stat" />
        </div>
      </div>

      <div className={styles.tocSection}>
        <h2 className={styles.tocTitle}>
          {isKirbyTheme && <img src="/assets/waddle_dee_jump.png" alt="jump" style={{ width: '32px', marginRight: '10px', verticalAlign: 'middle' }} />}
          {isPinguTheme && <span style={{ fontSize: '24px', marginRight: '10px' }}>📁</span>}
          {isSlowpokeTheme && <span style={{ fontSize: '24px', marginRight: '10px' }}>🏖️</span>}
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

      {isSlowpokeTheme && (
        <div className={`${styles.studyGuideSection} fade-in`}>
          <h2 className={styles.studyGuideTitle}>
            <Lightbulb className="text-yellow-500" />
            핵심 학습 가이드 (시험 단골 주제)
          </h2>
          <div className={styles.studyGuideGrid}>
            <div className={styles.studyGuideCard}>
              <div className={styles.guideHeader}>
                <h4>1. 레지스터 및 버스</h4>
                <div className={styles.importance}>★★★</div>
              </div>
              <div className={styles.guideContent}>
                <ul>
                  <li><strong>주소 버스:</strong> CPU → 외부 (단방향), 최대 기억장치 용량 결정</li>
                  <li><strong>데이터 버스:</strong> CPU ↔ 기억장치 (양방향), 데이터 전송</li>
                  <li><strong>MAR vs MBR:</strong> MAR(주소 일시 저장), MBR(데이터 일시 저장)</li>
                </ul>
              </div>
              <div className={styles.tipBadge}>기초 개념 필수 암기</div>
            </div>

            <div className={styles.studyGuideCard}>
              <div className={styles.guideHeader}>
                <h4>2. 명령어 사이클</h4>
                <div className={styles.importance}>★★★★★</div>
              </div>
              <div className={styles.guideContent}>
                <ul>
                  <li><strong>인출 사이클:</strong> $t_0(PC \to MAR)$, $t_1(M[MAR] \to MBR, PC+1)$, $t_2(MBR \to IR)$</li>
                  <li><strong>간접 사이클:</strong> 실제 데이터 주소(유효 주소)를 가져오는 단계</li>
                  <li><strong>JUMP 명령어:</strong> $t_0$에 PC에 목적지 주소를 직접 적재</li>
                </ul>
              </div>
              <div className={styles.tipBadge}>마이크로 연산 순서 100% 출제</div>
            </div>

            <div className={styles.studyGuideCard}>
              <div className={styles.guideHeader}>
                <h4>3. 주소지정 방식</h4>
                <div className={styles.importance}>★★★★</div>
              </div>
              <div className={styles.guideContent}>
                <ul>
                  <li><strong>직접 vs 간접:</strong> 직접(액세스 1번, 제한적), 간접(액세스 2번, 확장성)</li>
                  <li><strong>상대 주소지정:</strong> PC + 변위, 분기 명령어에 사용</li>
                  <li><strong>계산 문제:</strong> 명령어 비트 구조 기반 유효 주소 도출</li>
                </ul>
              </div>
              <div className={styles.tipBadge}>장단점 및 계산법 비교</div>
            </div>

            <div className={styles.studyGuideCard}>
              <div className={styles.guideHeader}>
                <h4>4. 파이프라이닝</h4>
                <div className={styles.importance}>★★★</div>
              </div>
              <div className={styles.guideContent}>
                <ul>
                  <li><strong>속도 향상($S_p$):</strong> $S_p = (k \times N) / (k + N - 1)$ 공식 활용</li>
                  <li><strong>해저드:</strong> 성능 저하 요인 (특히 조건 분기)</li>
                  <li><strong>슈퍼스칼라:</strong> 여러 파이프라인으로 동시 실행</li>
                </ul>
              </div>
              <div className={styles.tipBadge}>성능 분석 계산 연습</div>
            </div>

            <div className={styles.studyGuideCard}>
              <div className={styles.guideHeader}>
                <h4>5. 최신 프로세서</h4>
                <div className={styles.importance}>★★</div>
              </div>
              <div className={styles.guideContent}>
                <ul>
                  <li><strong>인텔 하이브리드:</strong> P-코어(고성능) vs E-코어(저전력/효율)</li>
                  <li><strong>트렌드:</strong> 멀티코어 및 전력 효율 중점 설계</li>
                </ul>
              </div>
              <div className={styles.tipBadge}>최신 기술 트렌드 이해</div>
            </div>
          </div>
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255, 166, 201, 0.1)', borderRadius: '12px', fontSize: '14px', border: '1px dashed var(--primary-color)' }}>
            <strong>💡 시험 팁:</strong> 인출 사이클의 마이크로 연산 순서와 파이프라인 속도 향상 계산은 거의 100% 출제되는 단골 문제이니 꼭 손으로 직접 써보며 익히시길 권장합니다!
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
