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


// ADD NEW Shift_Category

const addShiftCategory = async (req, res, next) => {
    let info = {
        name: req.body.name,
        description: req.body.description,
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
        let shiftCategories = await private_getAllShiftCategoryNames(event_id);
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
        let shiftCategoryObject = await private_getShiftCategoryObjectById(id);
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
        let shiftCategoryNames = await private_getAllShiftCategoryNames(event_id);
        let event = await baseController.getEventById(event_id);

        let shiftCategoryObjects = [];
        for (let i = 0; i < shiftCategoryNames.length; i++) {
            let shiftCategoryObject = await private_getShiftCategoryObjectById(shiftCategoryNames[i].id);
            shiftCategoryObjects.push(shiftCategoryObject);
        }
        let eventObject = new Event_class(event, shiftCategoryObjects);
        res.status(200).send(eventObject);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}





/**********  PRIVATE FUNCTIONS  *********/

// GET Shift_Category content by ID

const private_getShiftCategoryObjectById = async (id) => {
    try {
        let shiftCategory = await baseController.getShiftCategoryById(id);
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
        let shiftCategoryObject = new Shift_Category_class(shiftCategory, shifts);
        return shiftCategoryObject;

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error;
    }
}





// GET ALL Shift_Categories by Event

const private_getAllShiftCategoryNames = async (event_id) => {
    try {
        await baseController.getEventById(event_id);
        let shiftCategories = await ShiftCategory.findAll({ where: { event_id: event_id } })
        return shiftCategories;

    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error;
    }
}







module.exports = {
    addShiftCategory: addShiftCategory,
    deleteShiftCategory: deleteShiftCategory,
    getAllShiftCategoryNames: getAllShiftCategoryNames,
    getShiftCategoryById: getShiftCategoryObjectById,
    getAllShiftCategoriesByEvent: getAllShiftCategoriesByEvent
}