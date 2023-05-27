const db = require("../models");

const validationService = require("../services/validation_service");

// create main Model
const Event = db.event;


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



// ADD NEW Event
const addEvent = async (req, res, next) => {
    let info = {
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
        // user_id: req.body.user_id
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


module.exports = {
    getAllEvents: getAllEvents,
    addEvent: addEvent,
    deleteEventById: deleteEventById
}