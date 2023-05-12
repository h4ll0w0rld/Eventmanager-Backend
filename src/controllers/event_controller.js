const db = require("../models");

// create main Model
const Event = db.event;


// GET ALL Events
const getAllEvents = async (req, res) => {
    let events = await Event.findAll()
    res.status(200).send(events)
}



// ADD NEW Event
const addEvent = async (req, res) => {
    let info = {
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
        // user_id: req.body.user_id
    }
    const event = await Event.create(info)
    res.status(200).send({ message: "successful created new Event", data: event })
}


module.exports = {
    getAllEvents: getAllEvents,
    addEvent: addEvent
}