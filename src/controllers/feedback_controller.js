const db = require("../models");
const handleError = require("../services/error_service").handleErrors;

const Feedback = db.feedback;

/**
 * CREATE feedback
 */
const addFeedback = async (req, res, next) => {
  console.log("Received feedback:", req.body);

  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Feedback message is required" });
    }

    const newFeedback = await Feedback.create({
      note: message, // ✅ correct field
    });

    return res.status(201).json({
      message: "Feedback received successfully!",
      data: newFeedback,
    });
  } catch (error) {
    handleError(error, next);
  }
};

/**
 * GET all feedback
 */
const getFeedback = async (req, res, next) => {
  try {
    const feedbackList = await Feedback.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      count: feedbackList.length,
      data: feedbackList,
    });
  } catch (error) {
    handleError(error, next);
  }
};

/**
 * DELETE feedback by ID
 */
const deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Feedback.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    handleError(error, next);
  }
};

module.exports = {
  addFeedback,
  getFeedback,
  deleteFeedback,
};
