const db = require("../models");
const baseController = require("./base_controller");

// create main Model
const Shift = db.shift;

// GET ALL Shifts from Event
const getAllShifts = async (req, res, next) => {
    let shift_category_id = req.params.shift_category_id;
    try {
        await baseController.getShiftCategoryById(shift_category_id);
        let shifts = await Shift.findAll({ where: { shift_category_id: shift_category_id } })
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
        shift_category_id: req.body.shift_category_id
    }
    try {
        await baseController.getShiftCategoryById(info.shift_category_id);
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