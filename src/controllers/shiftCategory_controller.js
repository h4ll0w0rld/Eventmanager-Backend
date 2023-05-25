const db = require("../models");
const validationService = require("../services/validation_service");

import Shift_Category_class from "../models/classes/Shift_category";


// create main Model
const ShiftCategory = db.shift_category;
// create sub Models
const Shift = db.shift;
const Activity = db.activity;
const User = db.user;
const Event = db.event;


// ADD NEW Shift_Category
//TODO fix
const addShiftCategory = async (req, res, next) => {
    let info = {
        name: req.body.name,
        description: req.body.description,
        intervall: req.body.intervall,
        activitiesPerShift: req.body.activitiesPerShift,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        days: req.body.days,
        event_id: req.body.event_id,

    }

    try {
        await validationService.isAddShiftCategoryValid(info);
        const shiftCategoryObject = new Shift_Category_class(info);
        shiftCategoryObject.createShifts(info);
        const shiftCategory = await ShiftCategory.create(shiftCategoryObject,
            {
                include: [{
                    model: Shift,
                    as: "shifts",
                    include: [{
                        model: Activity,
                        as: "activities"
                    }]
                }]
            }

        );
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
        await validationService.isShiftCategoryIDValid(id);
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
        await validationService.isEventIDValid(event_id);
        let shiftCategories = await ShiftCategory.findAll(
            {
                order: [['name', 'ASC']],
                where: { event_id: event_id }
            });
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
        await validationService.isShiftCategoryIDValid(id);
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
                where: { id: id },
                order: [
                    [{ model: Shift, as: 'shifts' }, 'date', 'ASC'],
                    [{ model: Shift, as: 'shifts' }, 'startTime', 'ASC'],
                    [{ model: Shift, as: "shifts" }, { model: Activity, as: "activities" }, "user_id", "DESC"],
                ]
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
        await validationService.isEventIDValid(event_id);
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
                where: { id: event_id },
                order: [
                    [{ model: ShiftCategory, as: 'shift_categories' }, 'name', 'ASC'],
                    [{ model: ShiftCategory, as: 'shift_categories' }, { model: Shift, as: 'shifts' }, 'date', 'ASC'],
                    [{ model: ShiftCategory, as: 'shift_categories' }, { model: Shift, as: 'shifts' }, 'startTime', 'ASC'],
                    [{ model: ShiftCategory, as: 'shift_categories' }, { model: Shift, as: "shifts" }, { model: Activity, as: "activities" }, "user_id", "DESC"]
                ]
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