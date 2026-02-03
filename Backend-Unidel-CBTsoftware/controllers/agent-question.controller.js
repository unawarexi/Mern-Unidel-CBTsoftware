import QuestionBank from "../models/question.model.js";

// @desc    Create Question Bank (Agent only)
// @route   POST /api/agents/question-banks
// @access  Private (Agent)
export const createAgentQuestionBank = async (req, res) => {
  try {
    const { title, description, courseId, questions } = req.body;
    const agentId = req.user.userId;

    const questionBank = await QuestionBank.create({
      title,
      description,
      courseId,
      agentId,
      questions: questions || [],
      status: "approved", // Agent questions are auto-approved for their own use
    });

    res.status(201).json({ success: true, data: questionBank });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Agent Question Banks (Agent and Admin)
// @route   GET /api/agents/question-banks
// @access  Private (Agent/Admin)
export const getAgentQuestionBanks = async (req, res) => {
  try {
    const query =
      req.user.role === "agent"
        ? { agentId: req.user.userId }
        : { agentId: { $ne: null } };
    const questionBanks = await QuestionBank.find(query).populate(
      "courseId",
      "courseCode courseTitle",
    );
    res
      .status(200)
      .json({
        success: true,
        count: questionBanks.length,
        data: questionBanks,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Agent Question Bank (Agent only)
// @route   PUT /api/agents/question-banks/:id
// @access  Private (Agent)
export const updateAgentQuestionBank = async (req, res) => {
  try {
    const questionBank = await QuestionBank.findOne({
      _id: req.params.id,
      agentId: req.user.userId,
    });
    if (!questionBank) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Question bank not found or unauthorized",
        });
    }

    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      if (key !== "agentId") questionBank[key] = updates[key];
    });

    await questionBank.save();
    res.status(200).json({ success: true, data: questionBank });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Agent Question Bank (Agent only)
// @route   DELETE /api/agents/question-banks/:id
// @access  Private (Agent)
export const deleteAgentQuestionBank = async (req, res) => {
  try {
    const questionBank = await QuestionBank.findOne({
      _id: req.params.id,
      agentId: req.user.userId,
    });
    if (!questionBank) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Question bank not found or unauthorized",
        });
    }

    await questionBank.deleteOne();
    res.status(200).json({ success: true, message: "Question bank deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
