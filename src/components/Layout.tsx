import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Database, LayoutDashboard, Star, HelpCircle } from 'lucide-react';
import { useQuizContext } from '../context/QuizContext';
import type { Question } from '../types';
import styles from './Layout.module.css';

const Layout: React.FC = () => {
  const { state } = useQuizContext();
  const location = useLocation();
  const isFocusMode = location.pathname === '/exam' || location.pathname === '/study';

  // Extract unique subjects from questions
  const subjects = Array.from(new Set(state.questions.map((q: Question) => q.subject))).sort();

  const searchParams = new URLSearchParams(location.search);
  const subjectFilter = searchParams.get('subject');
  const fileFilter = searchParams.get('file');
  
  const currentSubject = subjectFilter || (fileFilter ? state.questions.find(q => q.sourceFile === fileFilter)?.subject : null);
  const isKirbyTheme = currentSubject === 'koreanGrammer';
  const isPinguTheme = currentSubject === 'koreanHistory';

  // Apply theme class to body for global consistency
  React.useEffect(() => {
    document.body.classList.remove('theme-kirby', 'theme-pingu');
    if (isKirbyTheme) {
      document.body.classList.add('theme-kirby');
    } else if (isPinguTheme) {
      document.body.classList.add('theme-pingu');
    }
  }, [isKirbyTheme, isPinguTheme]);

  return (
    <div 
      className={styles.container}
      data-subject={currentSubject || 'default'}
    >
      {!isFocusMode && (
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <div className={styles.logoCircle}>
              <img 
                src={isKirbyTheme ? "/assets/kirby_classic.png" : (isPinguTheme ? "/assets/pingu_happy.png" : "/assets/octopus.png")} 
                alt="logo" 
                className={styles.logoImg} 
              />
            </div>
            <h2>{isKirbyTheme ? "Kirby Prep" : (isPinguTheme ? "Pingu History" : "GyoDong Prep")}</h2>
          </div>
          
          <nav className={styles.nav}>
            <div className={styles.navSection}>
              <span className={styles.sectionLabel}>Dashboard</span>
              <NavLink to="/" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                <LayoutDashboard size={18} />
                <span>메인 대시보드</span>
              </NavLink>
              <NavLink to="/review" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                <Star size={18} />
                <span>오답 노트</span>
              </NavLink>
              <NavLink to="/input" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                <Database size={18} />
                <span>데이터 관리</span>
              </NavLink>
              <NavLink to="/guide" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
                <HelpCircle size={18} />
                <span>사용 가이드</span>
              </NavLink>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.navSection}>
              <span className={styles.sectionLabel}>Subjects</span>
              {subjects.map(subject => {
                const subjectStr = String(subject || 'Uncategorized');
                return (
                  <NavLink 
                    key={subjectStr}
                    to={`/?subject=${subjectStr}`} 
                    className={() => `${styles.subNavItem} ${location.search.includes(`subject=${subjectStr}`) ? styles.active : ''}`}
                  >
                    {isKirbyTheme && subjectStr === 'koreanGrammer' ? (
                      <img src="/assets/kirby_round.png" alt="dot" style={{ width: '16px', height: '16px', marginRight: '10px' }} />
                    ) : (isPinguTheme && subjectStr === 'koreanHistory' ? (
                      <span style={{ fontSize: '16px', marginRight: '10px' }}>🐧</span>
                    ) : (
                      <div className={styles.dot}></div>
                    ))}
                    <span>{subjectStr ? subjectStr.charAt(0).toUpperCase() + subjectStr.slice(1) : 'Uncategorized'}</span>
                  </NavLink>
                );
              })}
              {subjects.length === 0 && (
                <div className={styles.emptyNav}>문제를 추가해주세요</div>
              )}
            </div>
          </nav>

          <div className={styles.sidebarFooter}>
            <img 
              src={isKirbyTheme ? "/assets/kirby_hero.png" : (isPinguTheme ? "/assets/pingu_full.png" : "/assets/hangyodong_full.png")} 
              alt="character" 
              className={styles.hangyoFull} 
            />
          </div>
        </aside>
      )}
      
      <main className={`${styles.mainContent} ${isFocusMode ? styles.focusMode : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
