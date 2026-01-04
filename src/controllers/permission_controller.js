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

const removeEditor = async (req, res, next) => {
    let user_id = req.params.user_id;
    let event_id = req.params.current_event_id;
    let shift_category_id = req.params.shift_category_id;
    try {
        const userEvent = await validationService.isUserinEvent(user_id, event_id);
        const editor = await ShiftCategoryEditor.destroy({ where: { userEventId: userEvent.id, ShiftCategoryId: shift_category_id } });
        res.status(201).send({ message: "successful removed Editor rights", data: editor })
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
const checkAdmin = async (req, res, next) => {
  const user_id = req.params.user_id || req.body.user_id; // adjust depending on route
  const event_id = req.params.current_event_id || req.body.event_id;

  try {
    // Check if the user is part of the event
    const userEvent = await validationService.isUserinEvent(user_id, event_id);

    if (!userEvent) {
      const error = new Error("User not part of this event");
      error.statusCode = 403;
      throw error;
    }

    // Check if admin
    if (!userEvent.admin) {
      const error = new Error("User is not an admin");
      error.statusCode = 403;
      throw error;
    }

    // User is admin, continue
    next();
  } catch (error) {
    next(handleError(error, "checkAdminMiddleware"));
  }
};


const removeAdmin = async (req, res, next) => {
    let user_id = req.params.user_id;
    let event_id = req.params.current_event_id;
    try {
        const userEvent = await validationService.isUserinEvent(user_id, event_id);
        await validationService.areAdminsLeft(event_id);
        await userEvent.update({ admin: false });
        res.status(201).send({ message: "successful removed Admin rights" })
    } catch (error) {
        next(handleError(error, "permissionController"));
    }
}


const getRoles = async (req, res, next) => {
    try {
        const roles = req.roles;
        
        if (!roles) {
            const error = new Error("No roles found");
            error.statusCode = 403;
            throw error;
        }
        res.status(200).send(roles)
    } catch (error) {
        next(handleError(error, "permissionController"));
    }
}



module.exports = {
    makeEditor,
    removeEditor,
    makeAdmin,
    removeAdmin,
    getRoles,
    checkAdmin
}
