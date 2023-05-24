const db = require("../models");
const baseController = require("./base_controller");

// create main Model
const Activity = db.activity;
const User = db.user;
const Shift = db.shift;
const ShiftCategory = db.shift_category;


// Add new Activity
const addActivity = async (req, res, next) => {
    let info = {
        shift_id: req.body.shift_id,
    }
    try {
        await baseController.getShiftById(info.shift_id);
        const activity = await Activity.create(info)
        res.status(200).send({ message: "successful created new Activity", data: activity })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


// Add User to Activity

const addUserToActivity = async (req, res, next) => {
    let activity_id = req.params.activity_id;
    let user_id = req.params.user_id;
    try {
        let activity = await baseController.getActivityById(activity_id);
        if (activity.user) {
            // if activity already has an user
            throw Object.assign(new Error('Activity already has an user!'), { statusCode: 400 });
        } else {
            // if user doesn't exist
            await baseController.getUserById(user_id);
            await activity.update({ user_id: user_id });
            res.status(200).send({ message: "successful added User to Activity" })
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


// Delete User from Activity

const removeUserFromActivity = async (req, res, next) => {
    let activity_id = req.params.activity_id;
    try {
        await baseController.getActivityById(activity_id);
        await Activity.update({ user_id: null }, { where: { id: activity_id } })
        res.status(200).send({ message: "successful deleted User from Activity" })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

// GET all Activities by User

const getActivitiesByUser = async (req, res, next) => {
    let user_id = req.params.user_id;
    let event_id = req.params.event_id;
    try {
        await baseController.getUserById(user_id);
        await baseController.getEventById(event_id);
        let activities = await Activity.findAll(
            {
                include: [
                    {
                        model: User,
                        as: "user"
                    },
                    {
                        model: Shift,
                        as: "shift",
                        include: [{
                            model: ShiftCategory,
                            as: "shift_category"
                        }]
                    }
                ],
                where: { user_id: user_id }
            })
        res.status(200).send(activities);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}




// GET ALL Activities by Shift_Category

const getActivitiesByShiftCategory = async (req, res, next) => {
    let shift_category_id = req.params.shift_category_id;
    try {
        await baseController.getShiftCategoryById(shift_category_id);
        let activities = await Activity.findAll({
            include: [
                {
                    model: Shift,
                    as: "shift",
                    where: { shift_category_id: shift_category_id },
                }
            ]
        }
        )
        res.status(200).send(activities)
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}








module.exports = {
    addActivity: addActivity,
    addUserToActivity: addUserToActivity,
    removeUserFromActivity: removeUserFromActivity,
    getActivitiesByUser: getActivitiesByUser,
    getActivitiesByShiftCategory: getActivitiesByShiftCategory
}
