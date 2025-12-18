import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, "..", "template", "base.html");

function safeReplace(template, pattern, replacement) {
  return template.replace(pattern, () => replacement);
}

function renderContentSections(sections = []) {
  if (!Array.isArray(sections) || sections.length === 0) return "";
  return sections
    .map(
      (s) => `
      <div class="content-section">
        ${s.title ? `<div class="section-title">${s.title}</div>` : ""}
        <div>${s.content || ""}</div>
      </div>
    `
    )
    .join("");
}

function renderExamDetails(details = []) {
  if (!Array.isArray(details) || details.length === 0) return "";
  const rows = details
    .map(
      (d) => `
      <div class="exam-detail-row">
        <div class="exam-detail-label">${d.label}</div>
        <div class="exam-detail-value">${d.value}</div>
      </div>
    `
    )
    .join("");
  return `
    <div class="exam-details-card">
      <div class="section-title" style="border-bottom: none; padding-bottom: 0; margin-bottom: 16px;">Exam Details</div>
      ${rows}
    </div>
  `;
}

function renderButtons(buttons = []) {
  if (!Array.isArray(buttons) || buttons.length === 0) return "";
  return `
    <div class="button-container">
      ${buttons
        .map(
          (b) =>
            `<a href="${b.url || "#"}" class="${b.primary ? "primary-button" : "secondary-button"}" style="margin-right:8px">${b.text}</a>`
        )
        .join("")}
    </div>
  `;
}

// Read and cache template
let cachedTemplate = null;
function getTemplate() {
  if (cachedTemplate) return cachedTemplate;
  cachedTemplate = fs.readFileSync(TEMPLATE_PATH, "utf8");
  return cachedTemplate;
}

export function render(templateData = {}) {
  let html = getTemplate();

  // Basic replacements
  html = html.replace(/{{EMAIL_TITLE}}/g, templateData.EMAIL_TITLE || "");
  html = html.replace(/{{GREETING}}/g, templateData.GREETING || "");
  html = html.replace(/{{MAIN_CONTENT}}/g, templateData.MAIN_CONTENT || "");
  html = html.replace(/{{ADDITIONAL_CONTENT}}/g, templateData.ADDITIONAL_CONTENT || "");
  html = html.replace(/{{UNSUBSCRIBE_LINK}}/g, templateData.UNSUBSCRIBE_LINK || "");

  // CONTENT_SECTIONS block
  html = safeReplace(html, /{{#if CONTENT_SECTIONS}}[\s\S]*?{{\/if}}/g, renderContentSections(templateData.CONTENT_SECTIONS));

  // EXAM_DETAILS block
  html = safeReplace(html, /{{#if EXAM_DETAILS}}[\s\S]*?{{\/if}}/g, renderExamDetails(templateData.EXAM_DETAILS));

  // BUTTONS block
  html = safeReplace(html, /{{#if BUTTONS}}[\s\S]*?{{\/if}}/g, renderButtons(templateData.BUTTONS));

  // INFO_BOX block (simple injection)
  if (templateData.INFO_BOX) {
    const infoHtml = `
      <div class="info-box ${templateData.INFO_BOX.type || ""}">
        ${templateData.INFO_BOX.title ? `<div class="info-box-title">${templateData.INFO_BOX.title}</div>` : ""}
        <div class="info-box-content">${templateData.INFO_BOX.content || ""}</div>
      </div>
    `;
    html = safeReplace(html, /{{#if INFO_BOX}}[\s\S]*?{{\/if}}/g, infoHtml);
  } else {
    html = html.replace(/{{#if INFO_BOX}}[\s\S]*?{{\/if}}/g, "");
  }

  // Remove any remaining handlebars-like leftovers to clean template
  html = html.replace(/{{[#\/]?[^}]*}}/g, "");

  return html;
}
