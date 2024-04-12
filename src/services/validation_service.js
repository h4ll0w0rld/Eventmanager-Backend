const moment = require('moment');

const db = require("../models");
const handleError = require("./error_service").handleErrors;
const sequelize = db.Sequelize;

const Event = db.event;
const ShiftCategory = db.shift_category;
const Shift = db.shift;
const User = db.user;
const Activity = db.activity;
const UserEvent = db.userEvent;





// checks if the user is available for the activity
const isUserAvailable = async (user_id, activity_id) => {
    try {
        const activity = await Activity.findOne({
            where: {
                id: activity_id
            },
            include: [
                {
                    model: Shift,
                    as: "shift"
                }
            ]
        })
        const conflictingActivities = await Activity.findAll({
            include: [
                {
                    model: Shift,
                    as: "shift",
                    where: {
                        startTime: { [sequelize.Op.lt]: activity.shift.endTime },
                        endTime: { [sequelize.Op.gt]: activity.shift.startTime }
                    },
                },
                {
                    model: User,
                    as: "user",
                    where: {
                        id: user_id
                    },
                }
            ],
        })
        if (conflictingActivities.length > 0) {
       
            if (conflictingActivities[0].id != activity_id) {
                throw Object.assign(new Error("User is not available!"), { statusCode: 400 });
            } else {
                return true;
            }
        } else {
            return true;
        }
    } catch (err) {
        throw handleError(err, "validationService");
    }
}


const areAdminsLeft = async (event_id) => {
    try {
        const userEvents = await UserEvent.findAll({
            where: {
                EventId: event_id,
                admin: true
            }
        });
        if (userEvents.length === 1) {
            throw Object.assign(new Error("Last Admin can not be removed!"), { statusCode: 400 });
        }
        return true;
    } catch (err) {
        throw handleError(err, "validationService");
    }
}

const isDeleteUserValid = async (user_id) => {
    try {
        const userEvent = await UserEvent.findAll({
            where: {
                UserId: user_id,
                admin: true
            }
        });
        if (userEvent.length > 0) {
            for (const event of userEvent) {
                try {
                    await areAdminsLeft(event.EventId);
                } catch (err) {
                    throw Object.assign(new Error("You are the only Admin in the Event with the ID: " + event.EventId + " Please delete the Event or make another User to Admin before you are able to remove your account"), { statusCode: 400 });
                }
            }
            return true;
        } else {
            return true;
        }
    } catch (err) {
        throw handleError(err, "validationService");
    }
}


/*****
 * 
 * GET Param checks
 * 
 * 
 ********/

const isShiftCategoryInEvent = async (shift_category_id, event_id) => {
    try {
        const shift_category = await ShiftCategory.findOne(
            {
                include: [
                    {
                        model: Event,
                        as: "event",
                        where: {
                            id: event_id
                        }
                    }
                ],
                where: {
                    id: shift_category_id
                }
            }
        )
        if (!shift_category) {
            await isShiftCategoryIDValid(shift_category_id);
            throw Object.assign(new Error("Shift Category is not in Event"), { statusCode: 400 });
        }
        return shift_category;
    }
    catch (err) {
        throw handleError(err, "validationService");
    }
}

const isShiftInEvent = async (shift_id, shift_category_id, event_id) => {
    try {
        const shift = await Shift.findOne(
            {
                include: [
                    {
                        model: ShiftCategory,
                        as: "shift_category",
                        include: [
                            {
                                model: Event,
                                as: "event",
                                where: {
                                    id: event_id
                                }
                            }
                        ],
                        where: {
                            id: shift_category_id
                        }
                    }
                ],
                where: {
                    id: shift_id
                }
            }
        )
        //TODO: if routes currently unreachable
        if (!shift) {
            throw Object.assign(new Error("Shift not found"), { statusCode: 400 });
        } if (!shift.shift_category) {
            throw Object.assign(new Error("Shift is not in Shift Category"), { statusCode: 400 });
        } if (!shift.shift_category.event) {
            throw Object.assign(new Error("Shift is not in Event"), { statusCode: 400 });
        }
        return shift;
    }
    catch (err) {
        throw handleError(err, "validationService");
    }
}


const isActivityInEvent = async (activity_id, shift_category_id, event_id) => {
    try {
        const activity = await Activity.findOne(
            {
                include: [
                    {
                        model: Shift,
                        as: "shift",
                        include: [
                            {
                                model: ShiftCategory,
                                as: "shift_category",
                                include: [
                                    {
                                        model: Event,
                                        as: "event",
                                        where: {
                                            id: event_id
                                        }
                                    }
                                ],
                                where: {
                                    id: shift_category_id
                                }
                            }
                        ]
                    }
                ],
                where: {
                    id: activity_id
                }
            }
        )
        if (!activity) {
            throw Object.assign(new Error("Activity not found"), { statusCode: 400 });
        } if (!activity.shift) {
            await isShiftCategoryInEvent(shift_category_id, event_id);
            throw Object.assign(new Error("Activity is not in the specified Shift Category"), { statusCode: 400 });
        }
        return activity;
    }
    catch (err) {
        throw handleError(err, "validationService");
    }
}

const isUserinEvent = async (user_id, event_id) => {
    try {
        const userEvent = await UserEvent.findOne({
            where: {
                UserId: user_id,
                EventId: event_id
            }
        });
        if (!userEvent) {
            throw Object.assign(new Error("User is not in Event"), { statusCode: 400 });
        }
        return userEvent;
    }
    catch (err) {
        throw handleError(err, "validationService");
    }
}



/******
 * 
 *  POST body checks 
 * 
 *  ******/


const isAddEventValid = async (event) => {
    try {
        isTimeValid(event.startDate);
        isTimeValid(event.endDate);
        isTimeRangeValid(event.startDate, event.endDate);
        return true;
    } catch (err) {
        throw handleError(err, "validationService");
    }
}

const isAddShiftCategoryValid = async (shiftCategory) => {
    try {
        const event = await isEventIDValid(shiftCategory.event_id);
        const shiftBlocks = shiftCategory.shiftBlocks;
        areShiftBlocksValid(shiftBlocks, event);
        return true;
    } catch (err) {
        throw handleError(err, "validationService");
    }
}


const isAddShiftBlockToCategoryValid = async (shift_category_id, shiftBlocks) => {
    try {
        await isShiftCategoryIDValid(shift_category_id);
        const shift_category = await ShiftCategory.findOne(
            {
                include: [{
                    model: Event,
                    as: "event",
                }],
                where: { id: shift_category_id }
            });
        const event = shift_category.event;
        console.log(event);
        areShiftBlocksValid(shiftBlocks, event);
        for (const shiftBlock of shiftBlocks) {
            const conflictingShifts = await Shift.findAll({
                where: {
                    shift_category_id: shift_category_id,
                    startTime: { [sequelize.Op.lt]: shiftBlock.endTime },
                    endTime: { [sequelize.Op.gt]: shiftBlock.startTime }
                }
            })
            if (conflictingShifts.length > 0) {
                throw Object.assign(new Error("ShiftBlocks overlap with excisting Shifts in this category!"), { statusCode: 400 });
            }
        };
        return true;
    } catch (err) {
        throw handleError(err, "validationService");
    }
}



//Tests if the given Blocks with a shiftcategory are valid
const areShiftBlocksValid = (shiftBlocks, event) => {
    try {
        shiftBlocks.forEach(shiftBlock => {
            isTimeValid(shiftBlock.startTime);
            isTimeValid(shiftBlock.endTime);
            isTimeRangeValid(shiftBlock.startTime, shiftBlock.endTime);
            isTimeRangeDivisibleByIntervall(shiftBlock.startTime, shiftBlock.endTime, shiftBlock.intervall);
            isDayinEvent(shiftBlock.startTime, event);
            isDayinEvent(shiftBlock.endTime, event);

            //Test if ShiftBlocks are overlapping
            shiftBlocks.forEach(shiftBlock2 => {
                if (shiftBlock !== shiftBlock2) {
                    if (moment(shiftBlock.startTime, 'YYYY-MM-DD HH:mm', true).isBefore(moment(shiftBlock2.endTime, 'YYYY-MM-DD HH:mm', true)) &&
                        moment(shiftBlock.endTime, 'YYYY-MM-DD HH:mm', true).isAfter(moment(shiftBlock2.startTime, 'YYYY-MM-DD HH:mm', true))) {
                        throw Object.assign(new Error("Shiftblocks overlap!"), { statusCode: 400 });
                    }
                }
            });
        });
        return true;
    } catch (err) {
        throw handleError(err, "validationService");
    }
}



/****** 
 * 
 * ID checks  
 * 
 * ******/
// (returns the corresponding object if valid, throws error if not)


// checks if Event with this ID exists
const isEventIDValid = async (id) => {
    try {
        let event = await Event.findOne({ where: { id: id } });
        if (!event) {
            throw Object.assign(new Error("Event not found!"), { statusCode: 404 });
        } else {
            return event;
        }
    }
    catch (error) {
        throw handleError(error, "validationService");
    }
}


// checks if Shift_Category with this ID exists

const isShiftCategoryIDValid = async (id) => {
    try {
        let shiftCategory = await ShiftCategory.findOne({ where: { id: id } });
        if (!shiftCategory) {
            throw Object.assign(new Error("Shift_Category not found!"), { statusCode: 404 });
        } else {
            return shiftCategory;
        }
    } catch (error) {
        throw handleError(error, "validationService");
    }
}

//checks if Shift with this ID exists

const isShiftIDValid = async (shift_id) => {
    try {
        let shift = await Shift.findOne({ where: { id: shift_id } });
        if (!shift) {
            throw Object.assign(new Error("Shift not found!"), { statusCode: 404 });
        } else {
            return shift;
        }
    } catch (error) {
        throw handleError(error, "validationService");
    }
}

// checks if Activity with this ID exists

const isActivityIDValid = async (activity_id) => {
    try {
        let activity = await Activity.findOne(
            {
                include: [{
                    model: User,
                    as: "user",
                }],
                where: { id: activity_id }
            }
        );
        if (!activity) {
            throw Object.assign(new Error("Activity not found!"), { statusCode: 404 });
        }
        return activity;
    } catch (error) {
        throw handleError(error, "validationService");
    }
}


// checks if User with this ID exists

const isUserIDValid = async (user_id) => {
    try {
        let user = await User.findOne(
            {
                where: { id: user_id },
                exclude: ['password', 'refreshToken']
            });
        if (!user) {
            throw Object.assign(new Error("User not found!"), { statusCode: 404 });
        }
        return user;
    } catch (error) {
        throw handleError(error, "validationService");
    }
}




/****** 
 * 
 * TIME and DATE checks 
 * 
 * *******/



// checks if day is in Event
const isDayinEvent = (day, event) => {
    try {
        if (day >= event.startDate && day <= event.endDate) {
            return true;
        } else {
            throw Object.assign(new Error("Day is not in Event"), { statusCode: 400 });
        }
    } catch (err) {
        throw handleError(err, "validationService");
    }
}



// checks if time range is divisible by intervall
const isTimeRangeDivisibleByIntervall = (startTime, endTime, intervall) => {
    try {
        const startMoment = moment(startTime, 'YYYY-MM-DD HH:mm', true);
        const endMoment = moment(endTime, 'YYYY-MM-DD HH:mm', true);
        const duration = endMoment.diff(startMoment, 'minutes');
        if (duration % intervall === 0) {
            return true;
        } else {
            throw Object.assign(new Error("Time range is not divisible by intervall"), { statusCode: 400 });
        }
    } catch (err) {
        throw handleError(err, "validationService");
    }
}

// checks if startTime is before endTime
const isTimeRangeValid = (startTime, endTime) => {
    try {
        if (moment(startTime, 'YYYY-MM-DD HH:mm', true).isBefore(moment(endTime, 'YYYY-MM-DD HH:mm', true))) {
            return true;
        } else {
            throw Object.assign(new Error("startTime must be before endTime"), { statusCode: 400 });
        }
    } catch (err) {
        throw handleError(err, "validationService");
    }
}

// checks if time is valid format (HH:mm)
const isTimeValid = (time) => {
    try {
        if (moment(time, 'YYYY-MM-DD HH:mm', true).isValid()) {
            return true;
        } else {
            throw Object.assign(new Error("Time is not a valid format (YYYY-MM-DD HH:mm)"), { statusCode: 400 });
        }
    } catch (err) {
        throw handleError(err, "validationService");
    }
}


module.exports = {
    isUserAvailable,
    areAdminsLeft,
    isDeleteUserValid,
    isShiftCategoryInEvent,
    isShiftInEvent,
    isActivityInEvent,
    isUserinEvent,
    isAddShiftCategoryValid,
    isAddEventValid,
    isEventIDValid,
    isShiftCategoryIDValid,
    isShiftIDValid,
    isActivityIDValid,
    isUserIDValid,
    isAddShiftBlockToCategoryValid
}
