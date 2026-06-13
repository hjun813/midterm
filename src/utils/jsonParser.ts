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
      const qType = item.type || (item.options?.length > 0 ? 'multiple' : 'short');
      
      return {
        id: sourcePrefix ? `${sourcePrefix}_${baseId}` : baseId,
        type: qType,
        question: qText,
        image: item.image,
        options: item.options || [],
        answer: Array.isArray(item.answer) ? item.answer.map(String) : String(item.answer || ''),
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

/**
 * Shuffles an array using Fisher-Yates algorithm.
 */
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
