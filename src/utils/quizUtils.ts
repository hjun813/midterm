/**
 * Centralized grading utility to check if the user's answer is correct.
 * Handles single answers, multiple blanks (match all), and synonyms (match any).
 */
export const checkAnswer = (userAnswer: any, correctAnswer: string | string[], type: string): boolean => {
  if (userAnswer === undefined || userAnswer === null || userAnswer === '') return false;
  
  if (Array.isArray(correctAnswer)) {
    if (type === 'blank') {
      // Fill-in-the-blanks: USER must match all items in the array (positionally matched)
      const uArr = Array.isArray(userAnswer) ? userAnswer : String(userAnswer).split(',').map(s => s.trim());
      return correctAnswer.every((ans, i) => uArr[i]?.trim().toLowerCase() === ans.trim().toLowerCase());
    } else {
      // Synonyms / Multiple options: USER matches any one item in the array
      // This is common in 'short' type Korean History questions
      const uStr = String(userAnswer).trim().toLowerCase();
      return correctAnswer.some(ans => uStr === ans.trim().toLowerCase());
    }
  }
  
  // Single string answer
  return String(userAnswer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
};
