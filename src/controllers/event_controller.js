const db = require("../models");
const handleError = require("../services/error_service").handleErrors;
const validationService = require("../services/validation_service");
const permission_controller = require("./permission_controller");

// create main Model
const Event = db.event;
const User = db.user;
const ShiftCategory = db.shift_category;
const Activity = db.activity;
const Shift = db.shift;
const UserEvent = db.userEvent;


 


const getAllUsersByEvent = async (req, res, next) => {
    let eventId = req.params.current_event_id;
    try {
        const event = await validationService.isEventIDValid(eventId);

        let users = await event.getUsers({

            attributes: {
                exclude: ['password', 'refreshToken']
            },
            order: [['lastName', 'ASC'], ['firstName', 'ASC'], ['emailAddress', 'ASC']],
        });
      
       
        res.status(200).send(users)
    } catch (error) {
        next(handleError(error, "eventController"));
    }
}



// ADD NEW Event
const addEvent = async (req, res, next) => {
    const currentUserId = req.currentUserId;
    let info = {
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
    }
    let event;
    try {
        await validationService.isAddEventValid(info);
        await db.sequelize.transaction(async (t) => {
            event = await Event.create(info, { transaction: t });
            await UserEvent.create({ UserId: currentUserId, EventId: event.id, admin: true, user: true }, { transaction: t });
        })
        res.status(201).send({ message: "successful created new Event", data: event })
    } catch (error) {
        next(handleError(error, "eventController"));
    }
}

//Delete Event by ID
const deleteEventById = async (req, res, next) => {
    let eventId = req.params.current_event_id;

    try {
        await validationService.isEventIDValid(eventId);
        await Event.destroy({
            where: {
                id: eventId
            }
        })
        res.status(204).send({ message: "successful deleted Event" })
    } catch (error) {
        next(handleError(error, "eventController"));
    }
}

const addUserToEvent = async (req, res, next) => {
    let eventId = req.params.current_event_id;
    let userId = req.params.user_id;
    try {
        const event = await validationService.isEventIDValid(eventId);
        const user = await validationService.isUserIDValid(userId);
        await UserEvent.create({ UserId: user.id, EventId: event.id });
        res.status(204).send({ message: "successful added User to Event" })
    } catch (error) {
        try {
            if (error.errors[0].message == "PRIMARY must be unique") {
                error.message = "User is already added to Event"
                error.statusCode = 400;
            };
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
        } finally {
            if (error.name === 'SequelizeUniqueConstraintError') {
                error.message = "User already added to Event";
                error.statusCode = 400;
            }
            next(handleError(error, "eventController"));
        }
    }
}

const removeUserFromEvent = async (req, res, next) => {
    let eventId = req.params.current_event_id;
    let userId = req.params.user_id;
    try {
        const event = await validationService.isEventIDValid(eventId);
        const user = await validationService.isUserIDValid(userId);
        db.sequelize.transaction(async (t) => {
            //remove the user from all activities of the event
            const activities = await Activity.findAll({
                include: [
                    {
                        model: Shift,
                        as: "shift",
                        include: [
                            {
                                model: ShiftCategory,
                                as: "shift_category",
                            }
                        ]
                    }
                ],
                where: {
                    user_id: user.id,
                    '$shift.shift_category.event_id$': event.id

                },
                transaction: t
            });

            await activities.forEach(activity => {
                activity.update({ user_id: null, status: "free" }, { transaction: t })
            });
            await UserEvent.destroy({ where: { UserId: user.id, EventId: event.id }, transaction: t });
        }).then(() => {
            res.status(204).send({ message: "successful removed User from Event" })
        }).catch((error) => {
            next(handleError(error, "eventController"));
        })
    } catch (error) {
        next(handleError(error, "eventController"));
    }
}




module.exports = {
    getAllUsersByEvent: getAllUsersByEvent,
    addEvent: addEvent,
    deleteEventById: deleteEventById,
    addUserToEvent: addUserToEvent,
    removeUserFromEvent: removeUserFromEvent
}