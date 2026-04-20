import React from 'react';
import { HelpCircle, FileJson, Play, CheckCircle, Book } from 'lucide-react';
import styles from './Guide.module.css';

const Guide: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerIcon}>
          <HelpCircle size={32} color="var(--primary-color)" />
        </div>
        <h1>학습 가이드 및 사용법</h1>
        <p>플랫폼을 100% 활용하여 시험을 완벽하게 대비하세요.</p>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <FileJson size={24} />
            <h2>1. 문제 데이터 추가하기</h2>
          </div>
          <div className={styles.card}>
            <p><code>src/problem/</code> 폴더에 JSON 파일을 추가하여 플랫폼에 문제를 등록할 수 있습니다.</p>
            <div className={styles.codeBlock}>
              <pre>
{`[
  {
    "id": 1,
    "type": "multiple",
    "question": "문제 내용",
    "options": ["보기1", "보기2", "보기3", "보기4"],
    "answer": "정답",
    "explanation": "해설"
  }
]`}
              </pre>
            </div>
            <ul className={styles.list}>
              <li><strong>파일 이름:</strong> <code>과목_번호_이름.json</code> 형식을 권장합니다.</li>
              <li><strong>지원 유형:</strong> 객관식(multiple), OX(ox), 빈칸(blank), 단답형(short), 서술형(essay)</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <Play size={24} />
            <h2>2. 효율적인 학습 방법</h2>
          </div>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>📖 학습 모드 (Study)</h3>
              <p>문제를 풀고 즉시 정답과 해설을 확인합니다. 개념을 익힐 때 가장 효과적입니다.</p>
            </div>
            <div className={styles.card}>
              <h3>⏱️ 테스트 모드 (Exam)</h3>
              <p>실제 시험처럼 제한 시간 내에 모든 문제를 풀고 최종 점수를 확인합니다.</p>
            </div>
            <div className={styles.card}>
              <h3>🔀 랜덤 섞기</h3>
              <p>대시보드에서 '랜덤 섞기'를 체크하면 문제 순서가 바뀌어 암기 편향을 방지합니다.</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <CheckCircle size={24} />
            <h2>3. 오답 관리</h2>
          </div>
          <div className={styles.card}>
            <p>플랫폼은 사용자의 학습 기록을 기억합니다.</p>
            <ul className={styles.list}>
              <li>학습 중 틀린 문제는 자동으로 <strong>오답 노트</strong>에 저장됩니다.</li>
              <li>오답 노트 탭에서 약점인 문제들만 따로 모아 집중 학습하세요.</li>
              <li>완벽히 익힌 문제는 오답 노트에서 제거할 수 있습니다.</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <Book size={24} />
            <h2>4. 단축키 및 팁</h2>
          </div>
          <div className={styles.card}>
            <ul className={styles.list}>
              <li><strong>정답 확인:</strong> 학습 모드에서 답 선택 후 하단의 '정답 확인' 버튼을 누르세요.</li>
              <li><strong>서술형 문제:</strong> 자동 채점 대신 자신의 답과 '모범 답안'을 대조해 보세요.</li>
              <li><strong>데이터 새로고침:</strong> JSON 파일을 수정한 후 브라우저를 새로고침하면 즉시 반영됩니다.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Guide;
