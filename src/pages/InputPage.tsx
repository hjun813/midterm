import React, { useState } from 'react';
import { Upload, FileJson, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuizContext } from '../context/QuizContext';
import { parseQuestionsJSON } from '../utils/jsonParser';
import styles from './InputPage.module.css';

const InputPage: React.FC = () => {
  const { addQuestions, state } = useQuizContext();
  const [jsonText, setJsonText] = useState('');
  const [status, setStatus] = useState<{type: 'idle' | 'success' | 'error', message: string}>({ type: 'idle', message: '' });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setJsonText(text);
        processJSON(text);
      } catch (err) {
        setStatus({ type: 'error', message: '파일을 읽는 중 오류가 발생했습니다.' });
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  const handleTextSubmit = () => {
    if (!jsonText.trim()) {
      setStatus({ type: 'error', message: 'JSON 텍스트를 입력해주세요.' });
      return;
    }
    processJSON(jsonText);
  };

  const processJSON = (text: string) => {
    try {
      const parsed = parseQuestionsJSON(text);
      if (parsed.length === 0) {
        setStatus({ type: 'error', message: '유효한 문제가 없습니다. 형식을 확인해주세요.' });
        return;
      }
      
      addQuestions(parsed);
      setStatus({ type: 'success', message: `${parsed.length}개의 문제가 성공적으로 추가되었습니다!` });
      setJsonText('');
      
      // Clear status after 3 seconds
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'JSON 파싱 오류. 형식을 확인해주세요.' });
    }
  };

  const jsonTemplate = `[
  {
    "question": "React에서 렌더링을 최적화하기 위해 사용하는 Hook은 무엇인가요?",
    "options": ["useState", "useEffect", "useMemo", "useReducer"],
    "answer": "useMemo",
    "explanation": "useMemo는 비용이 높은 연산의 결과를 캐싱하여 렌더링 최적화에 도움을 줍니다.",
    "difficulty": "medium",
    "probability": "high"
  }
]`;

  return (
    <div className="fade-in">
      <div className={styles.header}>
        <h1 className={styles.title}>데이터 관리 (JSON 추가)</h1>
        <p className={styles.subtitle}>PPT별로 정리된 예상 문제 JSON 파일을 업로드하거나 텍스트로 붙여넣으세요.</p>
      </div>

      <div className={styles.statsCard}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>현재 저장된 총 문제 수</span>
          <span className={styles.statValue}>{state.questions.length}개</span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.card} card`}>
          <div className={styles.cardHeader}>
            <Upload size={20} className={styles.icon} />
            <h3>JSON 파일 업로드</h3>
          </div>
          <p className={styles.description}>NotebookLM 등에서 추출한 .json 파일을 직접 업로드하세요.</p>
          <label className={styles.uploadArea}>
            <input type="file" accept=".json" onChange={handleFileUpload} className={styles.fileInput} />
            <FileJson size={48} className={styles.uploadIcon} />
            <span className={styles.uploadText}>클릭하여 JSON 파일 선택</span>
          </label>
        </div>

        <div className={`${styles.card} card`}>
          <div className={styles.cardHeader}>
            <FileJson size={20} className={styles.icon} />
            <h3>텍스트로 입력</h3>
          </div>
          <p className={styles.description}>복사한 JSON 배열을 아래 창에 붙여넣고 추가하세요.</p>
          <textarea 
            className={styles.textarea} 
            value={jsonText} 
            onChange={e => setJsonText(e.target.value)}
            placeholder="[ { ... }, { ... } ] 형식의 JSON 입력"
          />
          <button className={`btn-primary ${styles.submitBtn}`} onClick={handleTextSubmit}>
            문제 추가하기
          </button>
        </div>
      </div>

      {status.type !== 'idle' && (
        <div className={`${styles.alert} ${styles[status.type]} ${status.type === 'error' ? 'shake' : 'fade-in'}`}>
          {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{status.message}</span>
        </div>
      )}

      <div className={`${styles.templateCard} card mt-6`}>
        <h3>📝 권장 JSON 형식 안내</h3>
        <p>AI에게 다음과 같은 형식으로 문제를 출력해달라고 요청하세요.</p>
        <pre className={styles.codeBlock}>
          {jsonTemplate}
        </pre>
      </div>
    </div>
  );
};

export default InputPage;
