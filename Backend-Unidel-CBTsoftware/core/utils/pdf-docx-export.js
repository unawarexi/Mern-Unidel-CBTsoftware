// Source - https://stackoverflow.com/a/55381739
// PDF extraction: https://mozilla.github.io/pdf.js/
// DOCX extraction: https://github.com/mwilliamson/mammoth.js

import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";


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

