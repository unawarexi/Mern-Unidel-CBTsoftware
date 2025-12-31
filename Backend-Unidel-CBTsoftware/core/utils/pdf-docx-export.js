// Source - https://stackoverflow.com/a/55381739
// PDF extraction: https://mozilla.github.io/pdf.js/
// DOCX extraction: https://github.com/mwilliamson/mammoth.js

import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";
import * as csvParser from "csv-parse/sync";
import * as XLSX from "xlsx";


export async function extractTextFromPDFBuffer(buffer) {
  const data = await pdfParse(buffer);
  return data.text.trim();
}


export async function extractTextFromDocxBuffer(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}

export async function extractTextFromDocxPath(path) {
  const result = await mammoth.extractRawText({ path });
  return result.value.trim();
}

/**
 * Extract questions from uploaded file (CSV, XLSX, DOCX, PDF)
 * Returns array of question objects
 */
export async function extractQuestionsFromFile(file) {
  const fileType = file.mimetype;
  const ext = file.originalname.split(".").pop().toLowerCase();
  let questions = [];

  // CSV
  if (fileType === "text/csv" || ext === "csv") {
    const csvText = file.buffer.toString("utf-8");
    const rows = csvParser.parse(csvText, { columns: true, skip_empty_lines: true });
    questions = rows.map((row) => ({
      question: row.question || row.Question || "",
      options: [
        row.optionA || row.OptionA || row.A || "",
        row.optionB || row.OptionB || row.B || "",
        row.optionC || row.OptionC || row.C || "",
        row.optionD || row.OptionD || row.D || "",
      ].filter(Boolean),
      correctAnswer: row.correctAnswer || row.CorrectAnswer || "",
      marks: parseInt(row.marks || row.Marks || 1),
      difficulty: row.difficulty || row.Difficulty || "medium",
      topic: row.topic || row.Topic || "",
    }));
  }
  // XLSX/XLS
  else if (
    fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    fileType === "application/vnd.ms-excel" ||
    ext === "xlsx" ||
    ext === "xls"
  ) {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const [header, ...body] = rows;
    const idx = (key) => header.findIndex((h) => h.toLowerCase().includes(key));
    questions = body.map((row) => ({
      question: row[idx("question")] || "",
      options: [
        row[idx("optiona")] || "",
        row[idx("optionb")] || "",
        row[idx("optionc")] || "",
        row[idx("optiond")] || "",
      ].filter(Boolean),
      correctAnswer: row[idx("correctanswer")] || "",
      marks: parseInt(row[idx("marks")] || 1),
      difficulty: row[idx("difficulty")] || "medium",
      topic: row[idx("topic")] || "",
    }));
  }
  // DOCX
  else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || ext === "docx") {
    const result = await extractTextFromDocxBuffer(file.buffer);
    const lines = result.split(/\n+/).filter((l) => l.trim());
    let currentQ = null;
    lines.forEach((line) => {
      const matchQ = line.match(/^\d+\.\s*(.+)/);
      if (matchQ) {
        if (currentQ) questions.push(currentQ);
        currentQ = { question: matchQ[1], options: [], correctAnswer: "", marks: 1, difficulty: "medium", topic: "" };
      } else if (currentQ && line.match(/^[A-D]\./)) {
        currentQ.options.push(line.replace(/^[A-D]\.\s*/, ""));
      } else if (currentQ && line.toLowerCase().startsWith("answer:")) {
        currentQ.correctAnswer = line.split(":")[1]?.trim() || "";
      }
    });
    if (currentQ) questions.push(currentQ);
  }
  // PDF
  else if (fileType === "application/pdf" || ext === "pdf") {
    const data = await extractTextFromPDFBuffer(file.buffer);
    const lines = data.split(/\n+/).filter((l) => l.trim());
    let currentQ = null;
    lines.forEach((line) => {
      const matchQ = line.match(/^\d+\.\s*(.+)/);
      if (matchQ) {
        if (currentQ) questions.push(currentQ);
        currentQ = { question: matchQ[1], options: [], correctAnswer: "", marks: 1, difficulty: "medium", topic: "" };
      } else if (currentQ && line.match(/^[A-D]\./)) {
        currentQ.options.push(line.replace(/^[A-D]\.\s*/, ""));
      } else if (currentQ && line.toLowerCase().startsWith("answer:")) {
        currentQ.correctAnswer = line.split(":")[1]?.trim() || "";
      }
    });
    if (currentQ) questions.push(currentQ);
  } else {
    throw new Error("Unsupported file type. Please upload CSV, Excel, DOCX, or PDF.");
  }

  // Filter valid questions
  return questions.filter((q) => q.question && q.options.length >= 2 && q.correctAnswer);
}

