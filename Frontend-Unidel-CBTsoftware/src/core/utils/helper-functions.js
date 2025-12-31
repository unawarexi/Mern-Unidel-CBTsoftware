/**
 * Parse extracted text into question objects.
 * Expects text in the format:
 * 1. Question text
 * A. Option 1
 * B. Option 2
 * C. Option 3
 * D. Option 4
 * Answer: Option text or letter
 */
export function parseQuestionsFromExtractedText(text) {
  if (!text) return [];
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const questions = [];
  let currentQ = null;

  lines.forEach(line => {
    const matchQ = line.match(/^\d+\.\s*(.+)/);
    if (matchQ) {
      if (currentQ) questions.push(currentQ);
      currentQ = {
        question: matchQ[1],
        options: [],
        correctAnswer: "",
        marks: 1,
        difficulty: "medium",
        topic: "",
      };
    } else if (currentQ && line.match(/^[A-D]\./)) {
      currentQ.options.push(line.replace(/^[A-D]\.\s*/, ""));
    } else if (currentQ && line.toLowerCase().startsWith("answer:")) {
      // Accept both letter or full text as answer
      let ans = line.split(":")[1]?.trim() || "";
      if (ans.length === 1 && /[A-D]/i.test(ans)) {
        const idx = ans.toUpperCase().charCodeAt(0) - 65;
        currentQ.correctAnswer = currentQ.options[idx] || "";
      } else {
        currentQ.correctAnswer = ans;
      }
    }
  });
  if (currentQ) questions.push(currentQ);

  // Filter valid questions
  return questions.filter(q => q.question && q.options.length >= 2 && q.correctAnswer);
}
