const db = require("../models");
import Shift_Category from "../models/classes/Shift_category";
// create main Model
const ShiftCategory = db.shift_category;
const Shift = db.shift;
const Activity = db.activity;
const User = db.user;


// ADD NEW Shift_Category

const addShiftCategory = async (req, res, next) => {
    let info = {
        name: req.body.name,
        description: req.body.description,
        event_id: req.body.event_id
    }
    try {
        const shiftCategory = await ShiftCategory.create(info)
        res.status(200).send({ message: "successful created new Category", data: shiftCategory })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


// DELETE Shift_Category by ID

const deleteShiftCategory = async (req, res, next) => {
    let id = req.params.id;
    try {
        let shiftCategory = await ShiftCategory.destroy({ where: { id: id } })
        res.status(200).send({ message: "successful deleted Shift_Category" })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}



// GET ALL Shift_Categories by Event

const getAllShiftCategories = async (req, res, next) => {
    let event_id = req.params.event_id;
    try {
        let shiftCategories = await ShiftCategory.findAll({ where: { event_id: event_id } })
        res.status(200).send(shiftCategories)
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


// GET Shift_Category content by ID

const getShiftCategoryById = async (req, res, next) => {
    let id = req.params.id;
    try {
        let shiftCategory = await ShiftCategory.findOne({ where: { id: id } });
        let event_id = shiftCategory.event_id;
        let shifts = await Shift.findAll(
            {
                include: [{
                    model: Activity,
                    as: "activities",
                    include: [{
                        model: User,
                        as: "user"
                    }],
                    where: { shift_category_id: id }
                }],
                where: { event_id: event_id }
            })
        let shiftCategoryObject = new Shift_Category(shiftCategory, shifts);
        res.status(200).send(shiftCategoryObject);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


module.exports = {
    addShiftCategory: addShiftCategory,
    deleteShiftCategory: deleteShiftCategory,
    getAllShiftCategories: getAllShiftCategories,
    getShiftCategoryById: getShiftCategoryById
}