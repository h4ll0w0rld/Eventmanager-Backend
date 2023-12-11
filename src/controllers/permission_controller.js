const db = require("../models");
const validationService = require("../services/validation_service");

// create main Model
const ShiftCategoryEditor = db.shiftCategoryEditor;
const UserEvent = db.userEvent;



const makeEditor = async (req, res, next) => {
    let user_id = req.params.user_id;
    let event_id = req.params.current_event_id;
    try {
        await validationService.isUserinEvent(user_id, event_id);
        const editor = await ShiftCategoryEditor.create({ UserId: user_id, EventId: event_id });
        res.status(201).send({ message: "successful created new Editor", data: editor })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


const makeAdmin = async (req, res, next) => {
    let user_id = req.params.user_id;
    let event_id = req.params.current_event_id;
    try {
        const userEvent = await validationService.isUserinEvent(user_id, event_id);
        await userEvent.update({ admin: true });
        res.status(201).send({ message: "successful created new Admin" })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}



module.exports = {
    makeEditor,
    makeAdmin
}
