const moment = require('moment-timezone');

const db = require("../models");
const validationService = require("../services/validation_service");
const handleError = require("../services/error_service").handleErrors;
const shiftController = require("../controllers/shift_controller");

const Shift_Category_class = require("../models/classes/Shift_category");


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
        event_id: req.params.current_event_id,
        shiftBlocks: req.body.shiftBlocks
    }
    try {
        await validationService.isAddShiftCategoryValid(info);
        const shifts = shiftController.getShiftArray(info.shiftBlocks);
        const shiftCategoryObject = new Shift_Category_class(info, shifts);
        const shiftCategoryArray = [shiftCategoryObject];
        const shiftCategory = await ShiftCategory.bulkCreate(shiftCategoryArray,
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
        res.status(201).send({ message: "successful created new Category", data: shiftCategory })
    } catch (error) {
        next(handleError(error, "shiftCategoryController"));
    }
}

// ADD a new Shiftblock to excisting Shift_Category
const addShiftBlock = async (req, res, next) => {
    const shift_category_id = req.params.shift_category_id;
    const event_id = req.params.current_event_id;
    const shiftBlocks = req.body.shiftBlocks;
    try {
        await validationService.isShiftCategoryInEvent(shift_category_id, event_id);
        await validationService.isAddShiftBlockToCategoryValid(shift_category_id, shiftBlocks);
        const shifts = shiftController.getShiftArray(shiftBlocks);
        shifts.forEach(shift => {
            shift.shift_category_id = shift_category_id;
        });
        await Shift.bulkCreate(shifts,
            {
                include: [{
                    model: Activity,
                    as: "activities"
                }]
            }
        );
        res.status(201).send({ message: "successful added new Shifts" })
    } catch (error) {
        next(handleError(error, "shiftCategoryController"));
    }
}


// DELETE Shift_Category by ID

const deleteShiftCategory = async (req, res, next) => {
    let id = req.params.id;
    let event_id = req.params.current_event_id;
    try {
        await validationService.isShiftCategoryInEvent(id, event_id);
        await ShiftCategory.destroy({ where: { id: id } });
        res.status(204).send({ message: "successful deleted Shift_Category" })
    } catch (error) {
        next(handleError(error, "shiftCategoryController"));
    }
}


// GET Shift_Category Names by Event

const getAllShiftCategoryNames = async (req, res, next) => {
    let event_id = req.params.current_event_id;
    try {
        await validationService.isEventIDValid(event_id);
        let shiftCategories = await ShiftCategory.findAll(
            {
                order: [['name', 'ASC']],
                where: { event_id: event_id }
            });
        res.status(200).send(shiftCategories);
    } catch (error) {
        next(handleError(error, "shiftCategoryController"));
    }
}



// GET one Shift_Category content by ID

const getShiftCategoryObjectById = async (req, res, next) => {
    let id = req.params.id;
    let event_id = req.params.current_event_id;
    try {
        await validationService.isShiftCategoryInEvent(id, event_id);
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
                                exclude: ['emailAddress', 'password', 'refreshToken'],
                            }
                        }],
                    }],
                }],
                where: { id: id },
                order: [
                    [{ model: Shift, as: 'shifts' }, 'startTime', 'ASC'],
                    [{ model: Shift, as: "shifts" }, { model: Activity, as: "activities" }, "id", "DESC"],
                ]
            });
        res.status(200).send(shiftCategoryObject);
    } catch (error) {
        next(handleError(error, "shiftCategoryController"));
    }
}


// GET all Shift_Category content by Event

const getAllShiftCategoriesByEvent = async (req, res, next) => {
    let event_id = req.params.current_event_id;
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
                                    exclude: ['emailAddress', 'password', 'refreshToken'],
                                }
                            }],
                        }],
                    }],
                }],
                where: { id: event_id },
                order: [
                    [{ model: ShiftCategory, as: 'shift_categories' }, 'name', 'ASC'],
                    [{ model: ShiftCategory, as: 'shift_categories' }, { model: Shift, as: 'shifts' }, 'startTime', 'ASC'],
                    [{ model: ShiftCategory, as: 'shift_categories' }, { model: Shift, as: "shifts" }, { model: Activity, as: "activities" }, "id", "DESC"]
                ]
            });
        res.status(200).send(eventObject);
    } catch (error) {
        next(handleError(error, "shiftCategoryController"));
    }
}





module.exports = {
    addShiftCategory: addShiftCategory,
    deleteShiftCategory: deleteShiftCategory,
    getAllShiftCategoryNames: getAllShiftCategoryNames,
    getShiftCategoryById: getShiftCategoryObjectById,
    getAllShiftCategoriesByEvent: getAllShiftCategoriesByEvent,
    addShiftBlock: addShiftBlock
}