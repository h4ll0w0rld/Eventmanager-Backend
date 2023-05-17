const db = require("../models");

// create main Model
const Event = db.event;


// GET ALL Events
const getAllEvents = async (req, res, next) => {
    try {
        let events = await Event.findAll()
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
        const event = await Event.create(info)
        res.status(200).send({ message: "successful created new Event", data: event })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


module.exports = {
    getAllEvents: getAllEvents,
    addEvent: addEvent
}