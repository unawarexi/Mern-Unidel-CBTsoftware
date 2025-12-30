import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

// Use models that are widely supported and reliable
const TEXT_MODEL = "mistralai/Mistral-7B-Instruct-v0.2"; // Better for text generation
const IMAGE_MODEL = "stabilityai/stable-diffusion-2-1";

/**
 * Generate exam questions from text content using HuggingFace
 * @param {string} content - The text content to generate questions from
 * @param {number} numberOfQuestions - Number of questions to generate
 * @param {string} difficulty - Difficulty level (easy, medium, hard)
 * @returns {Promise<Array>} Array of generated questions
 */
export async function generateQuestionsFromText(content, numberOfQuestions = 10, difficulty = "medium") {
  try {
    // Truncate content if too long (HF has token limits)
    const maxContentLength = 2000;
    const truncatedContent = content.length > maxContentLength ? content.substring(0, maxContentLength) + "..." : content;

    const prompt = `[INST] You are an expert university exam question generator.
Generate exactly ${numberOfQuestions} multiple-choice questions from the following content.
Difficulty: ${difficulty}

Content:
${truncatedContent}

Return ONLY a valid JSON array with this structure (no markdown, no explanation):
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
- Each question must have exactly 4 options
- correctAnswer must exactly match one of the options
- Questions should test understanding, not just memorization
- Ensure questions are clear and unambiguous
- Return ONLY the JSON array, no other text [/INST]`;

    const response = await hf.textGeneration({
      model: TEXT_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 2048,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    // Extract and parse JSON from response
    let jsonText = response.generated_text.trim();

    // Remove markdown code blocks if present
    jsonText = jsonText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Try to find JSON array in the text
    const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      jsonText = arrayMatch[0];
    }

    let questions;
    try {
      questions = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", response.generated_text);
      throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
    }

    if (!Array.isArray(questions)) {
      throw new Error("AI response is not an array");
    }

    if (questions.length === 0) {
      throw new Error("AI generated no questions");
    }

    // Validate and format questions
    return questions
      .map((q, index) => {
        if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length < 2) {
          console.warn(`Invalid question structure at index ${index}:`, q);
          return null;
        }

        return {
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer || q.options[0],
          marks: q.marks || 1,
          difficulty: q.difficulty || difficulty,
          topic: q.topic || "General",
        };
      })
      .filter(Boolean); // Remove any null entries
  } catch (error) {
    console.error("HuggingFace text generation error:", error);

    // Provide more specific error messages
    if (error.message.includes("Model") && error.message.includes("not supported")) {
      throw new Error(`The AI model is not available. Please try again later or contact support.`);
    }

    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}

/**
 * Improve or refine existing questions using HuggingFace
 * @param {Array} questions - Array of questions to improve
 * @returns {Promise<Array>} Improved questions
 */
export async function improveQuestions(questions) {
  try {
    const prompt = `[INST] Review and improve these exam questions. Make them clearer, ensure options are distinct, and verify correctness.

Questions:
${JSON.stringify(questions, null, 2)}

Return ONLY the improved questions as a JSON array with the same structure (no markdown, no explanation). [/INST]`;

    const response = await hf.textGeneration({
      model: TEXT_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 2048,
        temperature: 0.5,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    let jsonText = response.generated_text.trim();

    // Remove markdown code blocks
    jsonText = jsonText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Extract JSON array
    const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      jsonText = arrayMatch[0];
    }

    const improvedQuestions = JSON.parse(jsonText);

    if (!Array.isArray(improvedQuestions)) {
      throw new Error("AI response is not an array");
    }

    return improvedQuestions;
  } catch (error) {
    console.error("HuggingFace improve questions error:", error);
    throw new Error(`Failed to improve questions: ${error.message}`);
  }
}

/**
 * Generate an image/illustration for a given prompt (exam question)
 * @param {string} prompt - The question or description for the image
 * @returns {Promise<Buffer>} - The image buffer (PNG)
 */
export async function generateImageFromPrompt(prompt) {
  try {
    // Create a more descriptive prompt for better images
    const enhancedPrompt = `Educational illustration: ${prompt}. Clear, simple, high quality, professional style.`;

    const response = await hf.textToImage({
      model: IMAGE_MODEL,
      inputs: enhancedPrompt,
      parameters: {
        negative_prompt: "blurry, low quality, text, watermark, ugly, distorted",
        width: 512,
        height: 512,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    });

    // Convert Blob to Buffer if needed
    if (response instanceof Blob) {
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    return response;
  } catch (error) {
    console.error("HuggingFace image generation error:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}
