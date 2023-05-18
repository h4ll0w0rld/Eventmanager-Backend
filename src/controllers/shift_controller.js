const db = require("../models");
const baseController = require("./base_controller");

// create main Model
const Shift = db.shift;

// GET ALL Shifts from Event
const getAllShifts = async (req, res, next) => {
    let event_id = req.params.event_id;
    try {
        await baseController.getEventById(event_id);
        let shifts = await Shift.findAll({ where: { event_id: event_id } })
        res.status(200).send(shifts)
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


// ADD NEW Shift
const addShift = async (req, res, next) => {
    let info = {
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        event_id: req.body.event_id
    }
    try {
        await baseController.getEventById(event_id);
        const shift = await Shift.create(info)
        res.status(200).send({ message: "successful created new Shift", data: shift })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


module.exports = {
    getAllShifts: getAllShifts,
    addShift: addShift
}