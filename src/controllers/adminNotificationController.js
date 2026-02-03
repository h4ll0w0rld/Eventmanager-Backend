const db = require("../models");
const handleError = require("../services/error_service").handleErrors;

const AdminNotification = db.adminNotification;

/* ==============================
   Get All Notifications for Event (Admin only)
   ============================== */
const getNotificationsByEvent = async (req, res, next) => {
    console.log("Fetching notifications for event:", req.params, "by user:", req.currentUserId);
    const  event_id = req.params.current_event_id;
    console.log("Event ID:", event_id);

    try {
        // Optional: only allow admins
        // if (!req.roles.admin) throw Object.assign(new Error("Forbidden"), { statusCode: 403 });

        const notifications = await AdminNotification.findAll({
            where: { eventId: event_id },
            order: [['createdAt', 'DESC']],
            //   include: [
            //     { model: db.user, as: "user", attributes: ["id", "firstName", "lastName"] }
            //   ]
        });
        console.log("Notifications fetched:", notifications.length);
        res.status(200).send(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        next(handleError(error, "adminNotificationController"));
    }
};

/* ==============================
   Mark a notification as read
   ============================== */
const markAsRead = async (req, res, next) => {
    const { notification_id } = req.params;

    try {
        // Only admins can mark as read
        //if (!req.roles.admin) throw Object.assign(new Error("Forbidden"), { statusCode: 403 });

        const notification = await AdminNotification.findByPk(notification_id);
        if (!notification) throw Object.assign(new Error("Notification not found"), { statusCode: 404 });

        notification.read = true;
        await notification.save();

        res.status(200).send({ message: "Notification marked as read", notification });
    } catch (error) {
        next(handleError(error, "adminNotificationController"));
    }
};

/* ==============================
   Optional: Create Notification manually (admin)
   ============================== */
const createNotification = async (req, res, next) => {
    const { eventId, userId, activityId, message } = req.body;

    try {
        if (!req.roles.admin) throw Object.assign(new Error("Forbidden"), { statusCode: 403 });

        const notification = await AdminNotification.create({ eventId, userId, activityId, message });
        res.status(201).send({ message: "Notification created", notification });
    } catch (error) {
        next(handleError(error, "adminNotificationController"));
    }
};

module.exports = {
    getNotificationsByEvent,
    markAsRead,
    createNotification
};
