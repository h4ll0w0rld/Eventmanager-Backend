const db = require("../models");
const validationService = require("../services/validation_service");
const handleError = require("../services/error_service").handleErrors;

// create main Model
const ShiftCategoryEditor = db.shiftCategoryEditor;
const UserEvent = db.userEvent;


const makeEditor = async (req, res, next) => {
    let user_id = req.params.user_id;
    let event_id = req.params.current_event_id;
    let shift_category_id = req.params.shift_category_id;
    try {
        const userEvent = await validationService.isUserinEvent(user_id, event_id);
        const editor = await ShiftCategoryEditor.create({ userEventId: userEvent.id, ShiftCategoryId: shift_category_id });
        res.status(201).send({ message: "successful created new Editor", data: editor })
    } catch (error) {
        next(handleError(error, "permissionController"));
    }
}

// TODO fix
const makeAdmin = async (req, res, next) => {
    let user_id = req.params.user_id;
    let event_id = req.params.current_event_id;
    try {
        const userEvent = await validationService.isUserinEvent(user_id, event_id);
        await userEvent.update({ admin: true });
        res.status(201).send({ message: "successful created new Admin" })
    } catch (error) {
        next(handleError(error, "permissionController"));
    }
}



module.exports = {
    makeEditor,
    makeAdmin
}
