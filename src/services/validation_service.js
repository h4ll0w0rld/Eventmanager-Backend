const moment = require('moment');

const db = require("../models");
const sequelize = db.Sequelize;

const Event = db.event;
const ShiftCategory = db.shift_category;
const Shift = db.shift;
const User = db.user;
const Activity = db.activity;





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
                        date: activity.shift.date,
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







/******
 * 
 *  POST body checks 
 * 
 *  ******/

const isAddShiftCategoryValid = async (shiftCategory) => {
    try {
        isTimeValid(shiftCategory.startTime);
        isTimeValid(shiftCategory.endTime);
        isTimeRangeValid(shiftCategory.startTime, shiftCategory.endTime);
        isArrayofDatesValid(shiftCategory.days);
        const event = await isEventIDValid(shiftCategory.event_id);
        shiftCategory.days.forEach(day => {
            isDayinEvent(day, event);
        });
        isTimeRangeDivisibleByIntervall(shiftCategory.startTime, shiftCategory.endTime, shiftCategory.intervall);
        return true;
    } catch (err) {
        throw err;
    }
}

const isAddEventValid = async (event) => {
    try {
        isDateValid(event.startDate);
        isDateValid(event.endDate);
        isDateRangeValid(event.startDate, event.endDate);
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
        let user = await User.findOne({ where: { id: user_id } });
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
        const duration = moment.duration(moment(endTime, 'HH:mm').diff(moment(startTime, 'HH:mm')));
        const durationInMinutes = duration.asMinutes();
        if (durationInMinutes % intervall === 0) {
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
        if (moment(startTime, 'HH:mm', true).isBefore(moment(endTime, 'HH:mm', true))) {
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
        if (moment(time, 'HH:mm', true).isValid()) {
            return true;
        } else {
            throw Object.assign(new Error("Time is not a valid format (HH:mm) (validationService)"), { statusCode: 400 });
        }
    } catch (err) {
        throw err;
    }
}
// checks if date is valid format (YYYY-MM-DD)
const isDateValid = (date) => {
    try {
        if (moment(date, 'YYYY-MM-DD', true).isValid()) {
            return true;
        } else {
            throw Object.assign(new Error("Date is not a valid format (YYYY-MM-DD) (validationService)"), { statusCode: 400 });
        }
    } catch (err) {
        throw err;
    }
}

//checks if array of dates is valid format and if dates are unique
const isArrayofDatesValid = (dates) => {
    try {
        dates.forEach(date => {
            isDateValid(date);
        });
        if (dates.length === new Set(dates).size) {
            return true;
        } else {
            throw Object.assign(new Error("Dates are not unique (validationService)"), { statusCode: 400 });
        }
    } catch (err) {
        throw err;
    }
}




// checks if startDate is before endDate
const isDateRangeValid = (startDate, endDate) => {
    try {
        if (moment(startDate, 'YYYY-MM-DD', true).isBefore(moment(endDate, 'YYYY-MM-DD', true))) {
            return true;
        } else {
            throw Object.assign(new Error("startDate must be before endDate (validationService)"), { statusCode: 400 });
        }
    } catch (err) {
        throw err;
    }
}


module.exports = {
    isUserAvailable,
    isAddShiftCategoryValid,
    isAddEventValid,
    isEventIDValid,
    isShiftCategoryIDValid,
    isShiftIDValid,
    isActivityIDValid,
    isUserIDValid

}
