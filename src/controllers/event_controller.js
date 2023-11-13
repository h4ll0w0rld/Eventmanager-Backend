const db = require("../models");

const validationService = require("../services/validation_service");

// create main Model
const Event = db.event;
const User = db.user;
const ShiftCategory = db.shift_category;
const Activity = db.activity;
const Shift = db.shift;
const UserEvent = db.userEvent;


// GET ALL Events
const getAllEvents = async (req, res, next) => {
    try {
        let events = await Event.findAll(
            {
                order: [['name', 'ASC']],
            }
        )
        res.status(200).send(events)
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


const getAllUsersByEvent = async (req, res, next) => {
    let eventId = req.params.event_id;
    try {
        const event = await validationService.isEventIDValid(eventId);
        let users = await event.getUsers({
            order: [['lastName', 'ASC'], ['firstName', 'ASC']]
        });
        res.status(200).send(users)
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}



// ADD NEW Event
const addEvent = async (req, res, next) => {
    let info = {
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
    }
    try {
        await validationService.isAddEventValid(info);
        const event = await Event.create(info)
        res.status(201).send({ message: "successful created new Event", data: event })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

//Delete Event by ID
const deleteEventById = async (req, res, next) => {
    let eventId = req.params.event_id;

    try {
        await validationService.isEventIDValid(eventId);
        const event = await Event.destroy({
            where: {
                id: eventId
            }
        })
        res.status(204).send({ message: "successful deleted Event" })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const addUserToEvent = async (req, res, next) => {
    let eventId = req.params.event_id;
    let userId = req.params.user_id;
    try {
        const event = await validationService.isEventIDValid(eventId);
        const user = await validationService.isUserIDValid(userId);
        await UserEvent.create({ UserId: user.id, EventId: event.id });
        res.status(204).send({ message: "successful added User to Event" })
    } catch (error) {
        if (error.errors[0].message == "PRIMARY must be unique") {
            error.message = "User is already added to Event"
        };
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

const removeUserFromEvent = async (req, res, next) => {
    let eventId = req.params.event_id;
    let userId = req.params.user_id;
    try {
        const event = await validationService.isEventIDValid(eventId);
        const user = await validationService.isUserIDValid(userId);

        //remove the user from all activities of the event
        Activity.findAll({
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

            }
        }).then(activities => {
            activities.forEach(activity => {
                activity.update({ user_id: null })
            })
        })

        await UserEvent.destroy({ where: { UserId: user.id, EventId: event.id } });

        res.status(204).send({ message: "successful removed User from Event" })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}




module.exports = {
    getAllEvents: getAllEvents,
    getAllUsersByEvent: getAllUsersByEvent,
    addEvent: addEvent,
    deleteEventById: deleteEventById,
    addUserToEvent: addUserToEvent,
    removeUserFromEvent: removeUserFromEvent
}