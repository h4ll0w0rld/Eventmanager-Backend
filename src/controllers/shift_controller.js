const db = require("../models");
const validationService = require("../services/validation_service");

const moment = require('moment');


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
                order: [['startTime', 'ASC']],
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
                    [{ model: Activity, as: "activities" }, "id", "DESC"]
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


//PUT set Shift to active
const setisActive = async (req, res, next) => {
    let shift_id = req.params.shift_id;
    let isActive = req.params.isActive;
    try {
        await validationService.isShiftIDValid(shift_id);
        if (typeof isActive === "boolean") {
            throw Object.assign(new Error('isActive must be a boolean!'), { statusCode: 400 });
        }
        await Shift.update(
            { isActive: isActive },
            { where: { id: shift_id } }
        )
        res.status(204).send({ message: "Shift set to active" });
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
        throw error;
    }
}


module.exports = {
    getAllShifts: getAllShifts,
    getShiftById: getShiftById,
    setisActive: setisActive,
    getShiftsByUserAndEvent: getShiftsByUserAndEvent,
    getShiftArray: getShiftArray
}