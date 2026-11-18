import React, { useState } from 'react';
import type { Question, QuestionType } from '../types';
import { parseQuestionsJSON } from '../utils/jsonParser';
import { useQuizContext } from '../context/QuizContext';
import styles from './InputPage.module.css';

const labels: Record<QuestionType, string> = { multiple: '객관식', ox: 'OX', short: '단답형', blank: '빈칸', essay: '서술형' };
const PdfGenerator: React.FC = () => {
  const { addQuestions } = useQuizContext();
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState(10);
  const [type, setType] = useState<QuestionType>('multiple');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<boolean[]>([]);

  const generate = async () => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf') || file.size === 0 || file.size > 2 * 1024 * 1024) {
      setMessage('2MB 이하의 PDF 파일을 선택해주세요.'); return;
    }
    setLoading(true); setMessage(''); setQuestions([]); setSelected([]);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1]);
        reader.onerror = () => reject(new Error('PDF 파일을 읽지 못했습니다.'));
        reader.readAsDataURL(file);
      });
      const response = await fetch('/api/generate-questions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pdf: base64, count, type }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || `요청 실패 (${response.status}). Vercel 개발 서버 설정을 확인해주세요.`);
      if (!Array.isArray(result?.questions) || result.questions.length !== count) throw new Error('서버 응답이 올바르지 않습니다.');
      // Give each generation unique IDs, including repeated uploads of the same PDF.
      const source = `PDF-${crypto.randomUUID()}`;
      const parsed = parseQuestionsJSON(JSON.stringify(result.questions.map((q: object) => ({ ...q, id: crypto.randomUUID() }))), source);
      if (parsed.length !== count) throw new Error('생성된 문제를 읽을 수 없습니다.');
      setQuestions(parsed); setSelected(parsed.map(() => true));
    } catch (error) { setMessage(error instanceof Error ? error.message : '문제 생성에 실패했습니다.'); }
    finally { setLoading(false); }
  };
  const register = () => {
    const chosen = questions.filter((_, index) => selected[index]);
    if (!chosen.length) { setMessage('등록할 문제를 선택해주세요.'); return; }
    addQuestions(chosen); setQuestions([]); setSelected([]); setMessage(`${chosen.length}개의 문제를 등록했습니다.`);
  };
  return <section className={`${styles.card} ${styles.generator} card`}>
    <div className={styles.cardHeader}><h3>PDF로 문제 생성</h3></div>
    <p className={styles.description}>텍스트 기반 PDF (최대 2MB)를 Gemini에 전송해 문제를 생성합니다. 생성 결과의 정확성을 확인한 후 등록하세요.</p>
    <div className={styles.pdfControls}>
      <label>PDF 파일 <input type="file" accept=".pdf,application/pdf" disabled={loading} onChange={e => { setFile(e.target.files?.[0] || null); setQuestions([]); setMessage(''); }} /></label>
      <label>문제 수 <select value={count} disabled={loading} onChange={e => setCount(Number(e.target.value))}>{[10, 20, 30].map(n => <option key={n} value={n}>{n}개</option>)}</select></label>
      <label>문제 유형 <select value={type} disabled={loading} onChange={e => setType(e.target.value as QuestionType)}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <button className="btn-primary" disabled={loading || !file} onClick={generate}>{loading ? '문제 생성 중…' : '문제 생성'}</button>
    </div>
    {loading && <p role="status">PDF를 분석하고 있습니다. 잠시만 기다려주세요.</p>}
    {message && <p role="status" className={styles.generatorMessage}>{message}</p>}
    {questions.length > 0 && <div className={styles.preview}>
      <h3>생성된 문제 미리보기 ({selected.filter(Boolean).length}/{questions.length}개 선택)</h3>
      {questions.map((q, i) => <article key={q.id} className={styles.previewItem}>
        <label><input type="checkbox" checked={selected[i]} onChange={e => setSelected(prev => prev.map ( (v, index) => index === i ? e.target.checked : v))} /> <strong>{i + 1}. {q.question}</strong></label>
        {q.type === 'multiple' && <ol>{q.options?.map((option, index) => <li key={index}>{option}</li>)}</ol>}
        <p>정답: {Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</p><p>해설: {q.explanation}</p>
      </article>)}
      <button className="btn-primary" onClick={register} disabled={!selected.some(Boolean)}>선택한 문제 등록</button>
    </div>}
  </section>;
};
export default PdfGenerator;
