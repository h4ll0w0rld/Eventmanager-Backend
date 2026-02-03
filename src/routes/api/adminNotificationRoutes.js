const express = require("express");
const router = express.Router();
const adminNotificationController = require("../../controllers/adminNotificationController");
const permissionMiddleware = require('../../middleware/permission_middleware');
const checkRole = require('../../middleware/checkRole_middleware').checkRole;

// GET all notifications for an event (admin only)
router.get("/:current_event_id", checkRole, permissionMiddleware.checkAdmin, adminNotificationController.getNotificationsByEvent);
// PATCH / mark a notification as read
router.patch("/:notification_id/read", checkRole, permissionMiddleware.checkAdmin, adminNotificationController.markAsRead);

// POST / create notification manually (optional)
router.post("/", checkRole, permissionMiddleware.checkAdmin, adminNotificationController.createNotification);

module.exports = router;
