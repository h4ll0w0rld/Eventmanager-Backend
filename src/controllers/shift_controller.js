const { where } = require("sequelize");
const db = require("../models");

// create main Model
const Shift = db.shift;

// GET ALL Shifts from Event
const getAllShifts = async (req, res) => {
    let event_id = req.params.event_id;
    let shifts = await Shift.findAll({ where: { event_id: event_id } })
    res.status(200).send(shifts)
}


// ADD NEW Shift
const addShift = async (req, res) => {
    let info = {
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        event_id: req.body.event_id
    }
    const shift = await Shift.create(info)
    res.status(200).send({ message: "successful created new Shift", data: shift })
}


module.exports = {
    getAllShifts: getAllShifts,
    addShift: addShift
}