const db = require("../models");
const baseController = require("./base_controller");
import Shift_Category_class from "../models/classes/Shift_category";
import Event_class from "../models/classes/Event";

// create main Model
const ShiftCategory = db.shift_category;
// create sub Models
const Shift = db.shift;
const Activity = db.activity;
const User = db.user;
const Event = db.event;


// ADD NEW Shift_Category

const addShiftCategory = async (req, res, next) => {
    let info = {
        name: req.body.name,
        description: req.body.description,
        intervall: req.body.intervall,
        event_id: req.body.event_id
    }
    try {
        await baseController.getEventById(info.event_id);
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
        await baseController.getShiftCategoryById(id);
        await ShiftCategory.destroy({ where: { id: id } });
        res.status(200).send({ message: "successful deleted Shift_Category" })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


// GET Shift_Category Names by Event

const getAllShiftCategoryNames = async (req, res, next) => {
    let event_id = req.params.event_id;
    try {
        let shiftCategories = await ShiftCategory.findAll({ where: { event_id: event_id } });
        res.status(200).send(shiftCategories);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}



// GET one Shift_Category content by ID

const getShiftCategoryObjectById = async (req, res, next) => {
    let id = req.params.id;
    try {
        await baseController.getShiftCategoryById(id);
        let shiftCategoryObject = await ShiftCategory.findOne(
            {
                include: [{
                    model: Shift,
                    as: "shifts",
                    include: [{
                        model: Activity,
                        as: "activities",
                        include: [{
                            model: User,
                            as: "user",
                            attributes: {
                                exclude: ['emailAddress'],
                            }
                        }],
                    }],
                }],
                where: { id: id }
            });
        res.status(200).send(shiftCategoryObject);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


// GET all Shift_Category content by Event

const getAllShiftCategoriesByEvent = async (req, res, next) => {
    let event_id = req.params.event_id;
    try {
        await baseController.getEventById(event_id);
        let eventObject = await Event.findOne(
            {
                include: [{
                    model: ShiftCategory,
                    as: "shift_categories",
                    include: [{
                        model: Shift,
                        as: "shifts",
                        include: [{
                            model: Activity,
                            as: "activities",
                            include: [{
                                model: User,
                                as: "user",
                                attributes: {
                                    exclude: ['emailAddress'],
                                }
                            }],
                        }],
                    }],
                }],
                where: { id: event_id }
            });
        res.status(200).send(eventObject);
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
    getAllShiftCategoryNames: getAllShiftCategoryNames,
    getShiftCategoryById: getShiftCategoryObjectById,
    getAllShiftCategoriesByEvent: getAllShiftCategoriesByEvent
}