const db = require("../models");
const validationService = require("../services/validation_service");
const handleError = require("../services/error_service").handleErrors;
// create main Model
const Activity = db.activity;
const User = db.user;
const Shift = db.shift;
const ShiftCategory = db.shift_category;
const Event = db.event;
const UserEvent = db.userEvent;
const AdminNotification = db.adminNotification;


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
        const activity = await Activity.create({ shift_id: info.shift_id })
        res.status(201).send({ message: "successful created new Activity", data: activity })
    } catch (error) {
        next(handleError(error, "activityController"));
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
                    },
                    include: [
                        {
                            model: UserEvent,
                            as: "user_event",
                            attributes: []
                        }
                    ]
                }
            );
            // filter all users by unavailable users
            const availableUsers = allUsers.filter(user => !unavailableUsers.some(unavailableUser => unavailableUser.id === user.id));
            res.status(200).send(availableUsers);
        }
    } catch (error) {
        next(handleError(error, "activityController"));
    }
}



// Add User to Activity
const confirmUserToActivity = async (req, res, next) => {
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

        await validationService.isUserAvailable(user_id, activity_id);

        if (!userEvent) {
            throw Object.assign(new Error('User is not in the same Event!'), { statusCode: 400 });
        }

        if (activity.status === "confirmed") {
            throw Object.assign(new Error('Activity already has an requested or confirmed user!'), { statusCode: 400 });
        } else {
            // Confirm the user
            await activity.update({ user_id: user_id, status: "confirmed" });
           
            let user = await User.findByPk(user_id);
            await createAdminNotification({
                userId: req.currentUserId, // user who did the action
                eventId: event_id,
                activityId: activity.id,
                message: ` ${user.firstName} ${user.lastName} hat die ${activity.shift.shift_category.name} Schicht bestätigt`
            });
            res.status(204).send({ message: "successful confirmed User to Activity" });

          

          

        }
    } catch (error) {
        next(handleError(error, "activityController"));
    }
};

const requestUserToActivity = async (req, res, next) => {
    let activity_id = req.params.activity_id;
    let shift_category_id = req.params.shift_category_id;
    let event_id = req.params.current_event_id;
    let user_id = req.params.user_id;
    try {
        let activity = await validationService.isActivityInEvent(activity_id, shift_category_id, event_id);
        if (activity.user_id !== req.currentUserId && !req.roles.admin && !req.roles.editor.includes(parseInt(shift_category_id))) {
            throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
        }
        // check if user is in the same event
        let userEvent = await UserEvent.findOne({
            where: {
                UserId: user_id,
                EventId: activity.shift.shift_category.event_id
            }
        });
        await validationService.isUserAvailable(user_id, activity_id);
        if (!userEvent) {
            throw Object.assign(new Error('User is not in the same Event!'), { statusCode: 400 });
        }
        if (activity.status === "confirmed" || activity.status === "requested") {
            // if activity already has an user
            throw Object.assign(new Error('Activity already has an requested or confirmed user!'), { statusCode: 400 });
        } else {
            await validationService.isUserAvailable(user_id, activity_id);
            await activity.update({ user_id: user_id, status: "requested" });
            res.status(204).send({ message: "successful requestet User for Activity" })
        }
    } catch (error) {
        next(handleError(error, "activityController"));
    }
}

// Delete User from Activity

const removeUserFromActivity = async (req, res, next) => {
    let activity_id = req.params.activity_id;
    let shift_category_id = req.params.shift_category_id;
    let event_id = req.params.current_event_id;
    try {
        const activity = await validationService.isActivityInEvent(activity_id, shift_category_id, event_id);
        if (activity.user_id !== req.currentUserId && !req.roles.admin && !req.roles.editor.includes(parseInt(shift_category_id))) {
            throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
        }
        await Activity.update({ user_id: null, status: "free" }, { where: { id: activity_id } })
        
        let user = await User.findByPk(activity.user_id);
        await createAdminNotification({
            userId: req.currentUserId, // user who did the action
            eventId: event_id,
            activityId: activity_id,
            message: ` ${user.firstName} ${user.lastName} hat die ${activity.shift.shift_category.name} Schicht abgelehnt`
        });
        res.status(204).send({ message: "successful deleted User from Activity" })
    } catch (error) {
        next(handleError(error, "activityController"));
    }
}

const createAdminNotification = async ({ userId, eventId, activityId, message }) => {
    console.log("Creating admin notification:", { userId, eventId, activityId, message });
    try {
        await AdminNotification.create({ userId, eventId, activityId, message });
    } catch (err) {
        console.error("Failed to create admin notification", err);
    }
};



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
        next(handleError(error, "activityController"));
    }
}

const markShiftAsDone = async (req, res, next) => {
    let shift_category_id = req.params.shift_category_id;
    let event_id = req.params.current_event_id;
    let activity_id = req.params.activity_id;
    console.log("MARK AS DONE FIRED")

    try {
        await validationService.isActivityInEvent(activity_id, shift_category_id, event_id);
        await Activity.update({ shiftDone: true }, { where: { id: activity_id } });
        const act = await Activity.findByPk(activity_id, { raw: true });
        console.log("HHHIIIII", act);
        res.status(204).send({ message: "successful marked Shift as Done" })
    } catch (error) {
        next(handleError(error, "activityController"));
    }
}

const markShiftAsUndone = async (req, res, next) => {
    let shift_category_id = req.params.shift_category_id;
    let event_id = req.params.current_event_id;
    let activity_id = req.params.activity_id;
    console.log("MARK AS UNDONE FIRED")

    try {
        await validationService.isActivityInEvent(activity_id, shift_category_id, event_id);
        await Activity.update({ shiftDone: false }, { where: { id: activity_id } });
        const act = await Activity.findByPk(activity_id, { raw: true });
        console.log("HHHIIIII UNDONE", act);
        res.status(204).send({ message: "successful marked Shift as Undone" })
    } catch (error) {
        next(handleError(error, "activityController"));
    }
}


module.exports = {
    addActivity: addActivity,
    getAvailableUsers: getAvailableUsers,
    confirmUserToActivity: confirmUserToActivity,
    requestUserToActivity: requestUserToActivity,
    removeUserFromActivity: removeUserFromActivity,
    getActivitiesByShiftCategory: getActivitiesByShiftCategory,
    markShiftAsDone: markShiftAsDone,
    markShiftAsUndone: markShiftAsUndone
}
