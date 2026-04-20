import type { Question } from '../types';

const generateHashId = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; 
  }
  return `q_${Math.abs(hash)}_${text.length}`;
};

export const parseQuestionsJSON = (jsonString: string, sourcePrefix?: string): Question[] => {
  try {
    const data = JSON.parse(jsonString);
    const questionsArray = Array.isArray(data) ? data : (data.questions || [data]);
    
    // Parse subject from sourcePrefix (e.g., "cloud_1" -> subject: "cloud", sourceFile: "cloud_1")
    const subject = sourcePrefix ? (sourcePrefix.split('_')[0] || 'Uncategorized') : 'Manual';
    const sourceFile = sourcePrefix || 'manual_input';

    return questionsArray.map((item: any) => {
      const qText = item.question || '';
      const baseId = item.id || generateHashId(qText);
      return {
        id: sourcePrefix ? `${sourcePrefix}_${baseId}` : baseId,
        question: qText,
        options: item.options || [],
        answer: String(item.answer || ''),
        explanation: item.explanation || '',
        difficulty: item.difficulty || 'medium',
        probability: item.probability || 'medium',
        isStarred: !!item.isStarred,
        subject,
        sourceFile,
      };
    }).filter((q: Question) => q.question.trim().length > 0);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error("올바르지 않은 JSON 형식입니다.");
  }
};
