import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

const TEXT_MODEL = "moonshotai/Kimi-K2.5";
// const TEXT_MODEL = "Qwen/Qwen3-Coder-Next";
// const TEXT_MODEL = "MiniMaxAI/MiniMax-M2.1";
// const TEXT_MODEL = "Qwen/Qwen3-235B-A3B-Instruct";

// const IMAGE_MODEL = "together";
const IMAGE_MODEL = "black-forest-labs/FLUX.1-schnell";

export async function generateQuestionsFromText(
  content,
  numberOfQuestions = 10,
  difficulty = "medium",
) {
  try {
    // Truncate content if too long (HF has token limits)
    const maxContentLength = 4000;
    const truncatedContent =
      content.length > maxContentLength
        ? content.substring(0, maxContentLength) + "..."
        : content;

    const BATCH_SIZE = 20;
    const batches = Math.ceil(numberOfQuestions / BATCH_SIZE);
    let allQuestions = [];

    console.log(
      `Generating ${numberOfQuestions} questions in ${batches} batches...`,
    );

    for (let i = 0; i < batches; i++) {
      const count = Math.min(BATCH_SIZE, numberOfQuestions - i * BATCH_SIZE);
      console.log(
        `Batch ${i + 1}/${batches}: Generating ${count} questions...`,
      );

      const prompt = `[INST] You are an expert university exam question generator.
Generate exactly ${count} multiple-choice questions from the following content.
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

      try {
        const response = await hf.chatCompletion({
          model: TEXT_MODEL,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 4096, // Increased for larger batches
          temperature: 0.7,
          top_p: 0.95,
        });

        // Extract content from chat response
        let jsonText = response.choices[0].message.content.trim();

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

        const batchQuestions = JSON.parse(jsonText);

        if (Array.isArray(batchQuestions)) {
          allQuestions = [...allQuestions, ...batchQuestions];
        } else {
          console.warn(`Batch ${i + 1} did not return an array.`);
        }
      } catch (batchError) {
        console.error(`Error in batch ${i + 1}:`, batchError);
        // Continue to next batch instead of failing completely if one fails
      }
    }

    if (allQuestions.length === 0) {
      throw new Error("AI generated no questions across all batches");
    }

    // Validate and format questions
    return allQuestions
      .map((q, index) => {
        if (
          !q.question ||
          !q.options ||
          !Array.isArray(q.options) ||
          q.options.length < 2
        ) {
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
    if (
      error.message.includes("Model") &&
      error.message.includes("not supported")
    ) {
      throw new Error(
        `The AI model is not available. Please try again later or contact support.`,
      );
    }

    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}

/**
 * Improve or refine existing questions using HuggingFace
 */
export async function improveQuestions(questions) {
  try {
    const prompt = `[INST] Review and improve these exam questions. Make them clearer, ensure options are distinct, and verify correctness.

Questions:
${JSON.stringify(questions, null, 2)}

Return ONLY the improved questions as a JSON array with the same structure (no markdown, no explanation). [/INST]`;

    const response = await hf.chatCompletion({
      model: TEXT_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.5,
      top_p: 0.95,
    });

    let jsonText = response.choices[0].message.content.trim();

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
 */
export async function generateImageFromPrompt(prompt) {
  try {
    // Create a more descriptive prompt for better images
    const enhancedPrompt = `Educational illustration: ${prompt}. Clear, simple, high quality, professional style.`;

    const response = await hf.textToImage({
      model: IMAGE_MODEL,
      inputs: enhancedPrompt,
      parameters: {
        negative_prompt:
          "blurry, low quality, text, watermark, ugly, distorted",
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
