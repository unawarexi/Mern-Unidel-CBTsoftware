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

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const questions = [];
  let currentQ = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match question number (e.g., "1.", "1)", "Q1.", "Question 1:")
    const matchQ = line.match(/^(?:Q(?:uestion)?\s*)?(\d+)[.):\s]+(.+)/i);

    if (matchQ) {
      // Save previous question if exists and is valid
      if (currentQ && isValidQuestion(currentQ)) {
        questions.push(currentQ);
      }

      // Start new question
      currentQ = {
        question: matchQ[2].trim(),
        options: [],
        correctAnswer: "",
        marks: 1,
        difficulty: "medium",
        topic: "",
      };
    }
    // Match options (A., B., C., D. or a), b), c), d))
    else if (currentQ && line.match(/^[A-D][.)]\s*/i)) {
      const optionText = line.replace(/^[A-D][.)]\s*/i, "").trim();
      if (optionText) {
        currentQ.options.push(optionText);
      }
    }
    // Match answer line
    else if (currentQ && line.match(/^(?:Answer|Correct Answer|Ans)[:\s]*/i)) {
      currentQ.correctAnswer = extractCorrectAnswer(line, currentQ.options);
    }
    // Continue multiline question or option
    else if (currentQ) {
      if (currentQ.options.length === 0 && !line.match(/^[A-D][.)]/i)) {
        // Continuation of question text
        currentQ.question += " " + line;
      } else if (currentQ.options.length > 0 && !line.match(/^[A-D][.)]/i) && !line.match(/^(?:Answer|Correct Answer|Ans)/i)) {
        // Continuation of last option
        currentQ.options[currentQ.options.length - 1] += " " + line;
      }
    }
  }

  // Don't forget the last question
  if (currentQ && isValidQuestion(currentQ)) {
    questions.push(currentQ);
  }

  return questions;
}

/**
 * Extract correct answer from answer line
 */
function extractCorrectAnswer(answerLine, options) {
  let answerText = answerLine.replace(/^(?:Answer|Correct Answer|Ans)[:\s]*/i, "").trim();

  // Remove trailing punctuation
  answerText = answerText.replace(/[.,;!?]$/, "");

  // Check if answer is a single letter (A, B, C, D)
  if (answerText.length === 1 && /^[A-D]$/i.test(answerText)) {
    const idx = answerText.toUpperCase().charCodeAt(0) - 65;
    return options[idx] || "";
  }

  // Check if answer is like "A)" or "A."
  if (answerText.match(/^[A-D][.)]$/i)) {
    const idx = answerText.toUpperCase().charCodeAt(0) - 65;
    return options[idx] || "";
  }

  // Try to match answer text to options
  // 1. Exact match
  const exactMatch = options.find((opt) => opt === answerText);
  if (exactMatch) return exactMatch;

  // 2. Case-insensitive match
  const caseInsensitiveMatch = options.find((opt) => opt.toLowerCase() === answerText.toLowerCase());
  if (caseInsensitiveMatch) return caseInsensitiveMatch;

  // 3. Partial match
  const partialMatch = options.find((opt) => opt.toLowerCase().includes(answerText.toLowerCase()) || answerText.toLowerCase().includes(opt.toLowerCase()));
  if (partialMatch) return partialMatch;

  // Default to first option or the answer text itself
  return options[0] || answerText;
}

/**
 * Check if a question is valid
 */
function isValidQuestion(question) {
  return question.question && question.question.trim().length >= 5 && question.options.length >= 2 && question.correctAnswer && question.options.includes(question.correctAnswer);
}

/**
 * Validate a single question object
 */
export function validateQuestion(question) {
  const errors = [];

  if (!question.question || question.question.trim().length < 5) {
    errors.push("Question text is too short or missing");
  }

  if (!Array.isArray(question.options) || question.options.length < 2) {
    errors.push("Must have at least 2 options");
  }

  if (!question.correctAnswer || question.correctAnswer.trim().length === 0) {
    errors.push("Correct answer is missing");
  }

  if (question.options && !question.options.includes(question.correctAnswer)) {
    errors.push("Correct answer must be one of the options");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format questions for display
 */
export function formatQuestionsForDisplay(questions) {
  return questions.map((q, index) => ({
    ...q,
    questionNumber: index + 1,
    optionsWithLetters: q.options.map((opt, i) => ({
      letter: String.fromCharCode(65 + i),
      text: opt,
    })),
  }));
}
