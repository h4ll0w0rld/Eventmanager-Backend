const db = require("../models");
const validationService = require("../services/validation_service");

// create main Model
const Activity = db.activity;
const User = db.user;
const Shift = db.shift;
const ShiftCategory = db.shift_category;
const Event = db.event;
const UserEvent = db.userEvent;

const sequelize = db.Sequelize;


// Add new Activity
const addActivity = async (req, res, next) => {
    let info = {
        shift_id: req.params.shift_id,
        shift_category_id: req.params.shift_category_id,
        event_id: req.params.current_event_id,
    }
    try {
        await validationService.isShiftInEvent(info.shift_id, info.shift_category_id, info.event_id);
        const activity = await Activity.create(info.shift_id)
        res.status(201).send({ message: "successful created new Activity", data: activity })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


// GET Available Users
const getAvailableUsers = async (req, res, next) => {
    let activity_id = req.params.activity_id;
    let shift_category_id = req.params.shift_category_id;
    let event_id = req.params.current_event_id;
    try {
        // check if activity exists
        await validationService.isActivityInEvent(activity_id, shift_category_id, event_id);
        const event = await validationService.isEventIDValid(event_id);
        // get activity with shift
        const activity = await Activity.findOne({
            include: [
                {
                    model: Shift,
                    as: "shift"
                }
            ],
            where: { id: activity_id }
        })
        //check if activity already has an user
        if (activity.user_id) {
            throw Object.assign(new Error('Activity already has an user!'), { statusCode: 400 });
        } else {
            // find all unavailable users
            const unavailableUsers = await event.getUsers({
                include: [
                    {
                        model: Activity,
                        as: "activities",
                        include: [
                            {
                                model: Shift,
                                as: "shift",
                                where: {
                                    startTime: { [sequelize.Op.lt]: activity.shift.endTime },
                                    endTime: { [sequelize.Op.gt]: activity.shift.startTime }
                                }
                            }
                        ],
                        required: true
                    }
                ]
            })
            // find all users
            const allUsers = await event.getUsers(
                {
                    order: [['lastName', 'ASC'], ['firstName', 'ASC']],
                    attributes: {
                        exclude: ['emailAddress', 'password', 'refreshToken'],
                    }
                }
            );
            // filter all users by unavailable users
            const availableUsers = allUsers.filter(user => !unavailableUsers.some(unavailableUser => unavailableUser.id === user.id));
            res.status(200).send(availableUsers);
        }
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
    let shift_category_id = req.params.shift_category_id;
    let event_id = req.params.current_event_id;
    let user_id = req.params.user_id;
    try {
        let activity = await validationService.isActivityInEvent(activity_id, shift_category_id, event_id);
        // check if user is in the same event
        let userEvent = await UserEvent.findOne({
            where: {
                UserId: user_id,
                EventId: activity.shift.shift_category.event_id
            }
        });
        if (!userEvent) {
            throw Object.assign(new Error('User is not in the same Event!'), { statusCode: 400 });
        }
        if (activity.user) {
            // if activity already has an user
            throw Object.assign(new Error('Activity already has an user!'), { statusCode: 400 });
        } else {
            // if user doesn't exist
            await validationService.isUserAvailable(user_id, activity_id);
            await activity.update({ user_id: user_id });
            res.status(204).send({ message: "successful added User to Activity" })
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
    let shift_category_id = req.params.shift_category_id;
    let event_id = req.params.current_event_id;
    try {
        const activity = await validationService.isActivityInEvent(activity_id, shift_category_id, event_id);
        if (activity.user_id !== req.currentUserId && !req.roles.admin && !req.roles.editor.includes(shift_category_id)) {
            throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
        }
        await Activity.update({ user_id: null }, { where: { id: activity_id } })
        res.status(204).send({ message: "successful deleted User from Activity" })
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
    let event_id = req.params.current_event_id;
    try {
        await validationService.isShiftCategoryInEvent(shift_category_id, event_id);
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
    getAvailableUsers: getAvailableUsers,
    addUserToActivity: addUserToActivity,
    removeUserFromActivity: removeUserFromActivity,
    getActivitiesByShiftCategory: getActivitiesByShiftCategory
}
