
const checkAnswer = (userAnswer, correctAnswer, type) => {
  if (userAnswer === undefined || userAnswer === null || userAnswer === '') return false;

  const normalize = (str) => String(str).replace(/\s+/g, '').toLowerCase();
  
  const getSynonyms = (answer) => {
    const results = new Set();
    const original = answer.trim();
    results.add(normalize(original));
    
    const parenRegex = /^([^(]+)\(([^)]+)\)$/;
    const match = original.match(parenRegex);
    if (match) {
      results.add(normalize(match[1]));
      results.add(normalize(match[2]));
      if (match[2].includes('/')) {
        match[2].split('/').forEach(part => results.add(normalize(part)));
      }
    }
    
    if (original.includes('/')) {
      original.split('/').forEach(part => {
        results.add(normalize(part));
        const partMatch = part.trim().match(/^([^(]+)\(([^)]+)\)$/);
        if (partMatch) {
          results.add(normalize(partMatch[1]));
          results.add(normalize(partMatch[2]));
        }
      });
    }

    return Array.from(results);
  };

  const uNorm = normalize(userAnswer);
  
  if (Array.isArray(correctAnswer)) {
    return correctAnswer.some(ans => {
        const synonyms = getSynonyms(ans);
        return synonyms.includes(uNorm);
    });
  }
  
  const synonyms = getSynonyms(correctAnswer);
  return synonyms.includes(uNorm);
};

// Tests
console.log("Test 1: CPU for 중앙처리장치(CPU) ->", checkAnswer("CPU", "중앙처리장치(CPU)", "short"));
console.log("Test 2: 중앙처리장치 for 중앙처리장치(CPU) ->", checkAnswer("중앙처리장치", "중앙처리장치(CPU)", "short"));
console.log("Test 3: cpu for 중앙처리장치(CPU) ->", checkAnswer("cpu", "중앙처리장치(CPU)", "short"));
console.log("Test 4: assembler for 어셈블러(assembler) ->", checkAnswer("assembler", "어셈블러(assembler)", "short"));
console.log("Test 5: OpCode for 연산 코드 (Operation Code / Opcode) ->", checkAnswer("OpCode", "연산 코드 (Operation Code / Opcode)", "short"));
console.log("Test 6: EA for 유효 주소 (EA / Effective Address) ->", checkAnswer("EA", "유효 주소 (EA / Effective Address)", "short"));
