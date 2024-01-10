const db = require("../models");
const validationService = require("../services/validation_service");
const handleError = require("../services/error_service").handleErrors;

const moment = require('moment');


// create main Model
const Shift = db.shift;
const Activity = db.activity;
const User = db.user;
const Event = db.event;
const ShiftCategory = db.shift_category;

// GET ALL Shifts from ShiftCategory
const getAllShifts = async (req, res, next) => {
    let shift_category_id = req.params.shift_category_id;
    let event_id = req.params.current_event_id;
    try {
        await validationService.isShiftCategoryInEvent(shift_category_id, event_id);
        let shifts = await Shift.findAll(
            {
                order: [['startTime', 'ASC']],
                where: { shift_category_id: shift_category_id }
            })
        res.status(200).send(shifts)
    } catch (error) {
        next(handleError(error, "shiftController"));
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
                    [{ model: Activity, as: "activities" }, "id", "DESC"]
                ]
            });
        res.status(200).send(shift);
    } catch (error) {
        next(handleError(error, "shiftController"));
    }
}



//DELETE Shift by ID

const deleteShiftById = async (req, res, next) => {
    let shift_id = req.params.shift_id;
    let shift_category_id = req.params.shift_category_id;
    let event_id = req.params.current_event_id;
    try {
        await validationService.isShiftInEvent(shift_id, shift_category_id, event_id);
        await Shift.destroy({ where: { id: shift_id } });
        res.status(200).send({ message: "Shift was deleted successfully!" });
    } catch (error) {
        next(handleError(error, "shiftController"));
    }
}




// GET all Shifts by User

const getShiftsByUserAndEvent = async (req, res, next) => {
    let user_id = req.params.user_id;
    let event_id = req.params.current_event_id;
    let status = req.params.status;
    try {
        await validationService.isUserinEvent(user_id, event_id)
        if (status === "all") {
            let shifts = await Shift.findAll(
                {
                    include: [
                        {
                            model: Activity,
                            as: "activities",
                            include: [
                                {
                                    model: User,
                                    as: "user",
                                    attributes: ['id', 'firstName', 'lastName']
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
                        ['activities', 'status', 'DESC'],
                        ['startTime', 'ASC']
                    ],
                });
            res.status(200).send(shifts);
        } else if (status === "requested" || status === "confirmed") {
            let shifts = await Shift.findAll(
                {
                    include: [
                        {
                            model: Activity,
                            as: "activities",
                            include: [
                                {
                                    model: User,
                                    as: "user",
                                    attributes: ['id', 'firstName', 'lastName']
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
                        '$activities.user_id$': user_id,
                        '$activities.status$': status
                    },
                    order: [
                        ['startTime', 'ASC']
                    ]
                });
            res.status(200).send(shifts);
        } else {
            throw Object.assign(new Error('Status must be requested, confirmed or all!'), { statusCode: 400 });
        }
    } catch (error) {
        console.log(error);
        next(handleError(error, "shiftController"));
    }
}







//TODO Validate

const getShiftArray = (shiftBlocks) => {
    let shiftArray = [];
    try {
        shiftBlocks.forEach(shiftBlock => {
            const intervall = shiftBlock.intervall;
            const activitiesPerShift = shiftBlock.activitiesPerShift;
            const numberOfShifts = shiftBlock.numberOfShifts;
            const startTime = shiftBlock.startTime;
            const endTime = shiftBlock.endTime;
            for (let i = 0; i < numberOfShifts; i++) {
                const shiftStartTime = moment(startTime, 'YYYY-MM-DD HH:mm', true).add(intervall * i, 'minutes').format('YYYY-MM-DD HH:mm');
                const shiftEndTime = moment(shiftStartTime, 'YYYY-MM-DD HH:mm', true).add(intervall, 'minutes').format('YYYY-MM-DD HH:mm');
                let shift = {
                    startTime: shiftStartTime,
                    endTime: shiftEndTime,
                    activities: []
                }
                // check if the given endTime matches the numberofShifts
                if (i === (numberOfShifts - 1) && shift.endTime !== endTime) {
                    console.log(shift);
                    throw Object.assign(new Error('Shifts do not match the given time range!'), { statusCode: 400 });
                }
                //adding the activities to the shift
                for (let j = 0; j < activitiesPerShift; j++) {
                    shift.activities.push({})
                }
                //add the shift to the array of shifts
                shiftArray.push(shift);
            }
        })
        return shiftArray;
    } catch (error) {
        throw handleError(error, "shiftController");
    }
}


module.exports = {
    getAllShifts: getAllShifts,
    getShiftById: getShiftById,
    deleteShiftById: deleteShiftById,
    getShiftsByUserAndEvent: getShiftsByUserAndEvent,
    getShiftArray: getShiftArray
}