import Lecturer from "../models/lecturer.model.js";
import fs from "fs/promises";
import { uploadToCloudinary } from "../services/cloudinary.service.js";
import { extractTextFromPDFBuffer, extractTextFromDocxBuffer, extractTextFromDocxPath, extractQuestionsFromFile } from "../core/utils/pdf-docx-export.js";
import QuestionBank from "../models/question.model.js";
import { generateQuestionsFromText, improveQuestions, generateImageFromPrompt } from "../config/huggingface.config.js";

/**
 * Helper function to extract text based on file type
 */
async function extractText(file, fileType) {
  let extractedText = "";

  if (fileType === "application/pdf") {
    if (file.buffer) {
      extractedText = await extractTextFromPDFBuffer(file.buffer);
    } else {
      const dataBuffer = await fs.readFile(file.path);
      extractedText = await extractTextFromPDFBuffer(dataBuffer);
      await fs.unlink(file.path).catch(() => {});
    }
  } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    if (file.buffer) {
      extractedText = await extractTextFromDocxBuffer(file.buffer);
    } else {
      extractedText = await extractTextFromDocxPath(file.path);
      await fs.unlink(file.path).catch(() => {});
    }
  }

  return extractedText;
}

/**
 * Helper function to save document to Cloudinary
 */
async function saveDocumentToCloudinary(file, userId) {
  if (!file.buffer) return null;

  const folder = `projects/unidel/lecturers/${userId}/documents`;
  const uploadResult = await uploadToCloudinary(file.buffer, file.originalname, folder);
  await Lecturer.findByIdAndUpdate(userId, { $push: { documents: uploadResult.url } });
  return uploadResult.url;
}

/**
 * Extract text from uploaded file (PDF or DOCX)
 */
export const extractTextFromFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileType = req.file.mimetype;
    const supportedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (!supportedTypes.includes(fileType)) {
      if (req.file.path) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        message: "Unsupported file type for extraction. Only PDF and DOCX are supported.",
      });
    }

    // Save to Cloudinary
    const uploadedDocUrl = await saveDocumentToCloudinary(req.file, req.user._id);

    // Extract text
    const extractedText = await extractText(req.file, fileType);

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({
        message: fileType === "application/pdf" ? "Failed to extract text from PDF. This PDF may be scanned or image-based. Please upload a text-based PDF or use DOCX." : "DOCX file does not contain enough text to extract.",
      });
    }

    res.status(200).json({
      message: "Text extracted successfully",
      text: extractedText,
      wordCount: extractedText.split(/\s+/).length,
      uploadedDocUrl,
    });
  } catch (error) {
    console.error("File extraction error:", error);
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({ message: "Failed to extract text from file", error: error.message });
  }
};

/**
 * Generate questions from uploaded file using AI
 */
export const generateQuestionsFromFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { numberOfQuestions = 10, difficulty = "medium" } = req.body;
    const fileType = req.file.mimetype;
    const supportedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (!supportedTypes.includes(fileType)) {
      if (req.file.path) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        message: "Unsupported file type for question generation. Only PDF and DOCX are supported.",
      });
    }

    // Extract text
    const extractedText = await extractText(req.file, fileType);

    if (!extractedText || extractedText.trim().length < 100) {
      return res.status(400).json({
        message: fileType === "application/pdf" ? "Failed to extract enough text from PDF for question generation. This PDF may be scanned or image-based. Please upload a text-based PDF or use DOCX." : "DOCX file does not contain enough text for question generation.",
      });
    }

    const questions = await generateQuestionsFromText(extractedText, parseInt(numberOfQuestions), difficulty);

    res.status(200).json({
      message: "Questions generated successfully",
      questions,
      sourceFile: req.file.originalname,
    });
  } catch (error) {
    console.error("Question generation error:", error);
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({ message: "Failed to generate questions", error: error.message });
  }
};

/**
 * Bulk upload questions from file (CSV, XLSX, DOCX, PDF)
 * POST /api/exams/question-bank/bulk-upload
 * Body: file (multipart)
 * Returns: { questions: [...] }
 */
export const bulkUploadQuestions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let questions = [];

    try {
      // Use the unified extraction function that handles all file types
      questions = await extractQuestionsFromFile(req.file);
    } catch (err) {
      // Clean up file if on disk
      if (req.file.path) await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ message: err.message });
    }

    // Clean up file if on disk
    if (req.file.path) await fs.unlink(req.file.path).catch(() => {});

    if (questions.length === 0) {
      return res.status(400).json({
        message: "No valid questions found in the file. Please ensure questions are formatted correctly:\n\n" + "1. Question text\n" + "A. Option 1\n" + "B. Option 2\n" + "C. Option 3\n" + "D. Option 4\n" + "Answer: A (or full option text)",
      });
    }

    res.status(200).json({
      message: `Parsed ${questions.length} questions from file`,
      questions,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({ message: "Failed to parse questions from file", error: error.message });
  }
};

/**
 * Use AI to improve questions in question bank
 */
export const improveQuestionsWithAI = async (req, res) => {
  try {
    const { id } = req.params;
    const lecturerId = req.user._id;

    const questionBank = await QuestionBank.findById(id);

    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    if (questionBank.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (questionBank.questions.length === 0) {
      return res.status(400).json({ message: "No questions to improve" });
    }

    const improvedQuestions = await improveQuestions(questionBank.questions);
    questionBank.questions = improvedQuestions;
    await questionBank.save();

    res.status(200).json({
      message: "Questions improved successfully",
      questionBank,
    });
  } catch (error) {
    console.error("Improve questions error:", error);
    res.status(500).json({ message: "Failed to improve questions", error: error.message });
  }
};

/**
 * Generate an image/illustration for a given exam question and save to Cloudinary/Mongo
 * POST /api/exams/question-image
 * Body: { question, questionBankId, questionId }
 */
export const generateImageForQuestion = async (req, res) => {
  try {
    const { question, questionBankId, questionId } = req.body;

    if (!question || !questionBankId || !questionId) {
      return res.status(400).json({
        message: "question, questionBankId, and questionId are required",
      });
    }

    // Generate image from HuggingFace
    const imageBuffer = await generateImageFromPrompt(question);

    // Upload image to Cloudinary
    const folder = `projects/unidel/question-images/${questionBankId}`;
    const uploadResult = await uploadToCloudinary(imageBuffer, `question_${questionId}_${Date.now()}.png`, folder);

    // Save image URL to the question in the question bank
    const questionBank = await QuestionBank.findById(questionBankId);
    if (!questionBank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    const qIndex = questionBank.questions.findIndex((q) => q._id.toString() === questionId);
    if (qIndex === -1) {
      return res.status(404).json({ message: "Question not found in bank" });
    }

    questionBank.questions[qIndex].imageUrl = uploadResult.url;
    await questionBank.save();

    res.status(200).json({
      message: "Image generated and saved successfully",
      imageUrl: uploadResult.url,
      question: questionBank.questions[qIndex],
    });
  } catch (error) {
    console.error("Generate image for question error:", error);
    res.status(500).json({ message: "Failed to generate image", error: error.message });
  }
};
