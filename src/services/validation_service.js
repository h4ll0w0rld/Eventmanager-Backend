const moment = require('moment');

const db = require("../models");
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
            throw Object.assign(new Error("User is not available! (validationService)"), { statusCode: 400 });
        } else {
            return true;
        }
    } catch (err) {
        throw err;
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
            throw Object.assign(new Error("Shift Category not found (validationService)"), { statusCode: 400 });
        } if (!shift_category.event) {
            throw Object.assign(new Error("Shift Category is not in Event (validationService)"), { statusCode: 400 });
        }
        return shift_category;
    }
    catch (err) {
        throw err;
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
        if (!shift) {
            throw Object.assign(new Error("Shift not found (validationService)"), { statusCode: 400 });
        } if (!shift.shift_category) {
            throw Object.assign(new Error("Shift is not in Shift Category (validationService)"), { statusCode: 400 });
        } if (!shift.shift_category.event) {
            throw Object.assign(new Error("Shift is not in Event (validationService)"), { statusCode: 400 });
        }
        return shift;
    }
    catch (err) {
        throw err;
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
            throw Object.assign(new Error("Activity not found (validationService)"), { statusCode: 400 });
        } if (!activity.shift_category) {
            throw Object.assign(new Error("Activity is not the specified Shift Category (validationService)"), { statusCode: 400 });
        } if (!activity.shift_category.event) {
            throw Object.assign(new Error("Activity is not in Event (validationService)"), { statusCode: 400 });
        }
        return activity;
    }
    catch (err) {
        throw err;
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
            throw Object.assign(new Error("User is not in Event (validationService)"), { statusCode: 400 });
        }
        return userEvent;
    }
    catch (err) {
        throw err;
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
        throw err;
    }
}

const isAddShiftCategoryValid = async (shiftCategory) => {
    try {
        const event = await isEventIDValid(shiftCategory.event_id);
        const shiftBlocks = shiftCategory.shiftBlocks;
        areShiftBlocksValid(shiftBlocks, event);
        return true;
    } catch (err) {
        throw err;
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
                throw Object.assign(new Error("ShiftBlocks overlap with excisting Shifts in this category! (validationService)"), { statusCode: 400 });
            }
        };
        return true;
    } catch (err) {
        throw err;
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
                        throw Object.assign(new Error("Shiftblocks overlap! (validationService)"), { statusCode: 400 });
                    }
                }
            });
        });
        return true;
    } catch (err) {
        throw err;
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
            throw Object.assign(new Error("Event not found! (validationService)"), { statusCode: 404 });
        } else {
            return event;
        }
    }
    catch (error) {
        throw error;
    }
}


// checks if Shift_Category with this ID exists

const isShiftCategoryIDValid = async (id) => {
    try {
        let shiftCategory = await ShiftCategory.findOne({ where: { id: id } });
        if (!shiftCategory) {
            throw Object.assign(new Error("Shift_Category not found! (validationService)"), { statusCode: 404 });
        } else {
            return shiftCategory;
        }
    } catch (error) {
        throw error;
    }
}

//checks if Shift with this ID exists

const isShiftIDValid = async (shift_id) => {
    try {
        let shift = await Shift.findOne({ where: { id: shift_id } });
        if (!shift) {
            throw Object.assign(new Error("Shift not found! (validationService)"), { statusCode: 404 });
        } else {
            return shift;
        }
    } catch (error) {
        throw error;
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
            throw Object.assign(new Error("Activity not found! (validationService)"), { statusCode: 404 });
        }
        return activity;
    } catch (error) {
        throw error;
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
            throw Object.assign(new Error("User not found! (validationService)"), { statusCode: 404 });
        }
        return user;
    } catch (error) {
        throw error;
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
            throw Object.assign(new Error("Day is not in Event (validationService)"), { statusCode: 400 });
        }
    } catch (err) {
        throw err;
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
            throw Object.assign(new Error("Time range is not divisible by intervall (validationService)"), { statusCode: 400 });
        }
    } catch (err) {
        throw err;
    }
}

// checks if startTime is before endTime
const isTimeRangeValid = (startTime, endTime) => {
    try {
        if (moment(startTime, 'YYYY-MM-DD HH:mm', true).isBefore(moment(endTime, 'YYYY-MM-DD HH:mm', true))) {
            return true;
        } else {
            throw Object.assign(new Error("startTime must be before endTime (validationService)"), { statusCode: 400 });
        }
    } catch (err) {
        throw err;
    }
}

// checks if time is valid format (HH:mm)
const isTimeValid = (time) => {
    try {
        if (moment(time, 'YYYY-MM-DD HH:mm', true).isValid()) {
            return true;
        } else {
            throw Object.assign(new Error("Time is not a valid format (YYYY-MM-DD HH:mm) (validationService)"), { statusCode: 400 });
        }
    } catch (err) {
        throw err;
    }
}


module.exports = {
    isUserAvailable,
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
