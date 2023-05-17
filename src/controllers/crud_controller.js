const db = require("../models");

// create main Model
const Activity = db.activity;
const User = db.user;
const Shift = db.shift;
const ShiftCategory = db.shift_category;
const Event = db.event;





/* ACTIVITY */

// GET Activity by ID

const getActivityById = async (activity_id) => {
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
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error;
    }
}

/* USER */

// GET User by ID

const getUserById = async (user_id) => {
    try {
        let user = await User.findOne({ where: { id: user_id } });
        if (!user) {
            throw Object.assign(new Error("User not found!"), { statusCode: 404 });
        }
        return user;
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error;
    }
}


/* EVENT */

// GET Event by ID

const getEventById = async (event_id) => {
    try {
        let event = await Event.findOne({ where: { id: event_id } });
        if (!event) {
            throw Object.assign(new Error("Event not found!"), { statusCode: 404 });
        } else {
            return event;
        }
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error;
    }
}


/* SHIFT_CATEGORY */

// GET Shift_Category by ID

const getShiftCategoryById = async (id) => {
    try {
        let shiftCategory = await ShiftCategory.findOne({ where: { id: id } });
        if (!shiftCategory) {
            throw Object.assign(new Error("Shift_Category not found!"), { statusCode: 404 });
        } else {
            return shiftCategory;
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error;
    }
}


/* SHIFT */

// GET Shift by ID

const getShiftById = async (shift_id) => {
    try {
        let shift = await Shift.findOne({ where: { id: shift_id } });
        if (!shift) {
            throw Object.assign(new Error("Shift not found!"), { statusCode: 404 });
        } else {
            return shift;
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error;
    }
}



module.exports = {
    getActivityById,
    getUserById,
    getEventById,
    getShiftCategoryById,
    getShiftById
}