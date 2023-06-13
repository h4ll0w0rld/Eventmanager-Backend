const db = require("../models");
const validationService = require("../services/validation_service");

// create main Model
const Shift = db.shift;
const Activity = db.activity;
const User = db.user;
const Event = db.event;
const ShiftCategory = db.shift_category;

// GET ALL Shifts from Event
const getAllShifts = async (req, res, next) => {
    let shift_category_id = req.params.shift_category_id;
    try {
        await validationService.isShiftCategoryIDValid(shift_category_id);
        let shifts = await Shift.findAll(
            {
                order: [['date', 'ASC'], ['startTime', 'ASC']],
                where: { shift_category_id: shift_category_id }
            })
        res.status(200).send(shifts)
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

// Get Shift by ID

const getShiftById = async (req, res, next) => {
    let shift_id = req.params.shift_id;
    try {
        await validationService.isShiftIDValid(shift_id);
        let shift = await Shift.findOne(
            {
                include: [
                    {
                        model: Activity,
                        as: "activities",
                        include: [
                            {
                                model: User,
                                as: "user"
                            }
                        ]
                    },
                ],
                where: { id: shift_id },
                order: [
                    [{ model: Activity, as: "activities" }, "user_id", "DESC"]
                ]
            });
        res.status(200).send(shift);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}




// GET all Shifts by User

const getShiftsByUserAndEvent = async (req, res, next) => {
    let user_id = req.params.user_id;
    let event_id = req.params.event_id;
    try {
        await validationService.isUserIDValid(user_id);
        await validationService.isEventIDValid(event_id);
        let shifts = await Shift.findAll(
            {
                include: [
                    {
                        model: Activity,
                        as: "activities",
                        include: [
                            {
                                model: User,
                                as: "user"
                            }
                        ]
                    },

                    {
                        model: ShiftCategory,
                        as: "shift_category"
                    }
                ],
                where: {
                    '$shift_category.event_id$': event_id,
                    '$activities.user_id$': user_id
                },
                order: [
                    ['date', 'ASC'],
                    ['startTime', 'ASC']
                ]
            });
        res.status(200).send(shifts);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


module.exports = {
    getAllShifts: getAllShifts,
    getShiftById: getShiftById,
    getShiftsByUserAndEvent: getShiftsByUserAndEvent
}