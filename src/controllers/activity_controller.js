const db = require("../models");

// create main Model
const Activity = db.activity;
const User = db.user;

// Add new Activity
const addActivity = async (req, res) => {
    let info = {
        shift_id: req.body.shift_id,
        shift_category_id: req.body.shift_category_id
    }
    const activity = await Activity.create(info)
    res.status(200).send({ message: "successful created new Activity", data: activity })
}


// Add User to Activity

const addUserToActivity = async (req, res, next) => {
    let activity_id = req.params.activity_id;
    let user_id = req.params.user_id;
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

        if (activity.user) {
            // if activity already has an user
            res.status(400).send({ message: "Activity already has an user!" })
        } else {
            // if user doesn't exist
            let user = await User.findOne({ where: { id: user_id } });
            if (!user) {
                res.status(404).send({ message: "User not found!" });
            } else {
                await activity.update({ user_id: user_id });
                res.status(200).send({ message: "successful added User to Activity" })
            }
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
        let activity = await Activity.update({ user_id: null }, { where: { id: activity_id } })
        res.status(200).send({ message: "successful deleted User from Activity" })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}




// GET ALL Activities by Shift_Category

const getActivitiesByShiftCategory = async (req, res) => {
    let shift_category_id = req.params.shift_category_id;
    let activities = await Activity.findAll({ where: { shift_category_id: shift_category_id } })
    res.status(200).send(activities)
}


module.exports = {
    addActivity: addActivity,
    addUserToActivity: addUserToActivity,
    removeUserFromActivity: removeUserFromActivity,
    getActivitiesByShiftCategory: getActivitiesByShiftCategory
}
