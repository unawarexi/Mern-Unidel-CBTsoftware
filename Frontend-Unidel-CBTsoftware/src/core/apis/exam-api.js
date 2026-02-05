const API_ROOT =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const BASE_URL = `${API_ROOT}/exams`;

// ========== FILE EXTRACTION & AI GENERATION ==========

export const extractTextFromFile = async (file) => {
  console.log("[API] extractTextFromFile called");
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/extract-text`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] extractTextFromFile error:", error);
    throw new Error(error.message || "Failed to extract text from file");
  }
  return response.json();
};

export const generateQuestionsFromFile = async ({
  file,
  numberOfQuestions,
  difficulty,
  signal,
}) => {
  console.log("[API] generateQuestionsFromFile called", {
    file,
    numberOfQuestions,
    difficulty,
  });
  const formData = new FormData();
  formData.append("file", file);
  if (numberOfQuestions)
    formData.append("numberOfQuestions", numberOfQuestions);
  if (difficulty) formData.append("difficulty", difficulty);

  const response = await fetch(`${BASE_URL}/generate-from-file`, {
    method: "POST",
    credentials: "include",
    body: formData,
    signal, // Pass abort signal to fetch
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] generateQuestionsFromFile error:", error);
    throw new Error(error.message || "Failed to generate questions from file");
  }
  return response.json();
};

// ========== QUESTION BANK API FUNCTIONS ==========

export const createQuestionBank = async (data) => {
  console.log("[API] createQuestionBank called", data);
  const response = await fetch(`${BASE_URL}/question-bank`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] createQuestionBank error:", error);
    throw new Error(error.message || "Failed to create question bank");
  }
  return response.json();
};

export const getLecturerQuestionBanks = async ({ status, courseId } = {}) => {
  console.log("[API] getLecturerQuestionBanks called", { status, courseId });
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (courseId) params.append("courseId", courseId);

  const response = await fetch(
    `${BASE_URL}/question-bank?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getLecturerQuestionBanks error:", error);
    throw new Error(error.message || "Failed to fetch question banks");
  }
  return response.json();
};

export const getQuestionBankById = async (id) => {
  console.log("[API] getQuestionBankById called", id);
  const response = await fetch(`${BASE_URL}/question-bank/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getQuestionBankById error:", error);
    throw new Error(error.message || "Failed to fetch question bank");
  }
  return response.json();
};

export const updateQuestionBank = async ({ id, data }) => {
  console.log("[API] updateQuestionBank called", { id, data });
  const response = await fetch(`${BASE_URL}/question-bank/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] updateQuestionBank error:", error);
    throw new Error(error.message || "Failed to update question bank");
  }
  return response.json();
};

export const addQuestionToBank = async ({ id, question }) => {
  console.log("[API] addQuestionToBank called", { id, question });
  const response = await fetch(`${BASE_URL}/question-bank/${id}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(question),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] addQuestionToBank error:", error);
    throw new Error(error.message || "Failed to add question");
  }
  return response.json();
};

export const updateQuestionInBank = async ({ id, questionId, data }) => {
  console.log("[API] updateQuestionInBank called", { id, questionId, data });
  const response = await fetch(
    `${BASE_URL}/question-bank/${id}/questions/${questionId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] updateQuestionInBank error:", error);
    throw new Error(error.message || "Failed to update question");
  }
  return response.json();
};

export const deleteQuestionFromBank = async ({ id, questionId }) => {
  console.log("[API] deleteQuestionFromBank called", { id, questionId });
  const response = await fetch(
    `${BASE_URL}/question-bank/${id}/questions/${questionId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] deleteQuestionFromBank error:", error);
    throw new Error(error.message || "Failed to delete question");
  }
  return response.json();
};

export const submitForApproval = async (id) => {
  console.log("[API] submitForApproval called", id);
  const response = await fetch(`${BASE_URL}/question-bank/${id}/submit`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] submitForApproval error:", error);
    throw new Error(error.message || "Failed to submit for approval");
  }
  return response.json();
};

export const deleteQuestionBank = async (id) => {
  console.log("[API] deleteQuestionBank called", id);
  const response = await fetch(`${BASE_URL}/question-bank/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] deleteQuestionBank error:", error);
    throw new Error(error.message || "Failed to delete question bank");
  }
  return response.json();
};

export const improveQuestionsWithAI = async (id) => {
  console.log("[API] improveQuestionsWithAI called", id);
  const response = await fetch(`${BASE_URL}/question-bank/${id}/improve`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] improveQuestionsWithAI error:", error);
    throw new Error(error.message || "Failed to improve questions");
  }
  return response.json();
};

// ========== ADMIN APPROVAL API FUNCTIONS ==========

export const getPendingApprovals = async () => {
  console.log("[API] getPendingApprovals called");
  const response = await fetch(`${BASE_URL}/question-bank/pending/approvals`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getPendingApprovals error:", error);
    throw new Error(error.message || "Failed to fetch pending approvals");
  }
  return response.json();
};

export const approveQuestionBank = async ({ id, comments }) => {
  console.log("[API] approveQuestionBank called", { id, comments });
  const response = await fetch(`${BASE_URL}/question-bank/${id}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ comments }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] approveQuestionBank error:", error);
    throw new Error(error.message || "Failed to approve question bank");
  }
  return response.json();
};

export const rejectQuestionBank = async ({ id, comments }) => {
  console.log("[API] rejectQuestionBank called", { id, comments });
  const response = await fetch(`${BASE_URL}/question-bank/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ comments }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] rejectQuestionBank error:", error);
    throw new Error(error.message || "Failed to reject question bank");
  }
  return response.json();
};

// ========== EXAM API FUNCTIONS ==========

export const createExam = async (data) => {
  console.log("[API] createExam called", data);
  const response = await fetch(`${BASE_URL}/exams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] createExam error:", error);
    throw new Error(error.message || "Failed to create exam");
  }
  return response.json();
};

export const createExamFromQuestionBank = async (data) => {
  console.log("[API] createExamFromQuestionBank called", data);
  const response = await fetch(`${BASE_URL}/exams/from-question-bank`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] createExamFromQuestionBank error:", error);
    throw new Error(
      error.message || "Failed to create exam from question bank",
    );
  }
  return response.json();
};

export const getLecturerExams = async ({ status, courseId } = {}) => {
  console.log("[API] getLecturerExams called", { status, courseId });
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (courseId) params.append("courseId", courseId);

  const response = await fetch(`${BASE_URL}/exams?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getLecturerExams error:", error);
    throw new Error(error.message || "Failed to fetch exams");
  }
  return response.json();
};

export const getActiveExamsForStudent = async () => {
  console.log("[API] getActiveExamsForStudent called");
  const response = await fetch(`${BASE_URL}/exams/active`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getActiveExamsForStudent error:", error);
    throw new Error(error.message || "Failed to fetch active exams");
  }
  return response.json();
};

export const getExamById = async (id) => {
  console.log("[API] getExamById called", id);
  const response = await fetch(`${BASE_URL}/exams/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getExamById error:", error);
    throw new Error(error.message || "Failed to fetch exam");
  }
  return response.json();
};

export const updateExam = async ({ id, data }) => {
  console.log("[API] updateExam called", { id, data });
  const response = await fetch(`${BASE_URL}/exams/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] updateExam error:", error);
    throw new Error(error.message || "Failed to update exam");
  }
  return response.json();
};

export const publishExam = async (id) => {
  console.log("[API] publishExam called", id);
  const response = await fetch(`${BASE_URL}/exams/${id}/publish`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] publishExam error:", error);
    throw new Error(error.message || "Failed to publish exam");
  }
  return response.json();
};

export const deleteExam = async (id) => {
  console.log("[API] deleteExam called", id);
  const response = await fetch(`${BASE_URL}/exams/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("[API] deleteExam error:", error);
    throw new Error(error.message || "Failed to delete exam");
  }
  return response.json();
};

export const generateImageForQuestion = async ({
  question,
  questionBankId,
  questionId,
}) => {
  console.log("[API] generateImageForQuestion called", {
    question,
    questionBankId,
    questionId,
  });
  const response = await fetch(`${BASE_URL}/question-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ question, questionBankId, questionId }),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] generateImageForQuestion error:", error);
    throw new Error(error.message || "Failed to generate image for question");
  }
  return response.json();
};

// ========== BULK UPLOAD QUESTIONS API FUNCTION ==========
export const bulkUploadQuestions = async (file) => {
  console.log("[API] bulkUploadQuestions called");
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/question-bank/bulk-upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    console.error("[API] bulkUploadQuestions error:", result);
    throw new Error(result.message || "Failed to parse file");
  }
  return result;
};
