const express = require("express");
const router = express.Router();

const feedbackController = require("../../controllers/feedback_controller");


router.put("/", feedbackController.addFeedback);
router.delete("/:feedback_id", feedbackController.deleteFeedback);
router.get("/", feedbackController.getFeedback);
module.exports = router;
