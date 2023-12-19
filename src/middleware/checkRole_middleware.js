const { urlencoded } = require("body-parser");
const db = require("../models");
const handleError = require("../services/error_service").handleErrors;
const UserEvent = db.userEvent;
const ShiftCategoryEditor = db.shiftCategoryEditor;
const ShiftCategory = db.shift_category;

const checkRole = async (req, res, next) => {
    try {
        const userEvent = await UserEvent.findOne({ where: { userId: req.currentUserId, eventId: req.params.current_event_id } });
        if (!userEvent) {
            const error = new Error("Forbidden");
            error.statusCode = 403;
            throw error;
        }
        const roles = {
            admin: false,
            guest: false,
            user: false,
            editor: []
        }
        roles.admin = userEvent.admin;
        roles.user = userEvent.user;
        roles.guest = userEvent.guest;

        const shiftCategoryEditors = await db.shiftCategoryEditor.findAll({ where: { userEventId: userEvent.id } });
        shiftCategoryEditors.forEach(shiftCategoryEditor => {
            roles.editor.push(shiftCategoryEditor.dataValues.ShiftCategoryId);
        });
        req.roles = roles;
        next();
    } catch (error) {
        next(handleError(error, "checkRoleMiddleware"));
    }
}

module.exports = {
    checkRole
}