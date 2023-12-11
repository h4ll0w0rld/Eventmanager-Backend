const { urlencoded } = require("body-parser");
const db = require("../models");
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

        const shiftCategoryEditors = await ShiftCategoryEditor.findAll(
            {
                where: { userId: req.currentUserId },
            });

        shiftCategoryEditors.forEach(shiftCategoryEditor => {
            roles.editor.push(shiftCategoryEditor.shiftCategory);
        });

        req.roles = roles;
        next();
    } catch (error) {
        console.log(error);
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

module.exports = {
    checkRole
}