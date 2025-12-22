import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate exam questions from text content using OpenAI
 * @param {string} content - The text content to generate questions from
 * @param {number} numberOfQuestions - Number of questions to generate
 * @param {string} difficulty - Difficulty level (easy, medium, hard)
 * @returns {Promise<Array>} Array of generated questions
 */
export const generateQuestionsFromText = async (content, numberOfQuestions = 10, difficulty = "medium") => {
  try {
    const prompt = `You are an expert exam question generator for university courses. 
Generate ${numberOfQuestions} multiple-choice questions from the following content.
Difficulty level: ${difficulty}

Content:
${content}

Return ONLY a valid JSON array with this exact structure (no markdown, no explanations):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "marks": 1,
    "difficulty": "${difficulty}",
    "topic": "Main topic covered"
  }
]

Requirements:
- Generate exactly ${numberOfQuestions} questions
- Each question must have 4 options
- correctAnswer must exactly match one of the options
- Questions should test understanding, not just memorization
- Ensure questions are clear and unambiguous
- Return ONLY the JSON array, no other text`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator specializing in generating high-quality exam questions. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0].message.content.trim();

    // Remove markdown code blocks if present
    const jsonText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const questions = JSON.parse(jsonText);

    // Validate the structure
    if (!Array.isArray(questions)) {
      throw new Error("AI response is not an array");
    }

    return questions.map((q) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      marks: q.marks || 1,
      difficulty: q.difficulty || difficulty,
      topic: q.topic || "General",
    }));
  } catch (error) {
    console.error("OpenAI generation error:", error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
};

/**
 * Improve or refine existing questions using OpenAI
 * @param {Array} questions - Array of questions to improve
 * @returns {Promise<Array>} Improved questions
 */
export const improveQuestions = async (questions) => {
  try {
    const prompt = `Review and improve these exam questions. Make them clearer, ensure options are distinct, and verify correctness.

Questions:
${JSON.stringify(questions, null, 2)}

Return ONLY the improved questions as a JSON array with the same structure.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an expert exam question editor. Improve questions for clarity and accuracy. Respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0].message.content.trim();
    const jsonText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    return JSON.parse(jsonText);
  } catch (error) {
    console.error("OpenAI improvement error:", error);
    throw new Error(`Failed to improve questions: ${error.message}`);
  }
};

export default openai;
