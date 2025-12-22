import openai from "../services/openai.service.js";

export const generateQuestionsFromText = async (req, res) => {
  const { extractedText } = req.body;

  if (!extractedText) {
    return res.status(400).json({ message: "No content provided" });
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "You generate academic exam questions.",
      },
      {
        role: "user",
        content: extractedText,
      },
    ],
    temperature: 0.3,
  });

  const aiOutput = response.choices[0].message.content;

  let questions;
  try {
    questions = JSON.parse(aiOutput);
  } catch (err) {
    return res.status(500).json({
      message: "AI output could not be parsed",
    });
  }

  res.json({
    status: "success",
    questions,
  });
};
