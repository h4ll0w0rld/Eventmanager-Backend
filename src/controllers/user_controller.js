const db = require("../models");
const validationService = require("../services/validation_service");
const handleError = require("../services/error_service").handleErrors;

// create main Model
const User = db.user;
const UserEvent = db.userEvent;
const Activity = db.activity;

// GET User by ID
const getUserById = async (req, res, next) => {
    let event_id = req.params.current_event_id;
    let id = req.params.id;
    try {
        await validationService.isUserinEvent(id, event_id);
        let user = await validationService.isUserIDValid(id);
        res.status(200).send(user)
    } catch (error) {
        next(handleError(error, "userController"));
    }
}

// GET all Users from Event

const getEventsByUser = async (req, res, next) => {
    let user_id = req.params.user_id;
    try {
        const user = await validationService.isUserIDValid(user_id);
        let events = await user.getEvents({
            order: [['name', 'ASC']],
        });
        res.status(200).send(events)
    } catch (error) {
        next(handleError(error, "userController"));
    }
}

// DELETE User by ID

const deleteUserById = async (req, res, next) => {
    let user_id = req.params.user_id;
    try {
        await validationService.isUserIDValid(user_id);
        await validationService.isDeleteUserValid(user_id);
        let user = await User.destroy({ where: { id: user_id } })
        res.status(204).send({ message: "successful deleted User" })
    } catch (error) {
        next(handleError(error, "userController"));
    }
}




// ADD NEW User
const addUser = async (req, res, next) => {
    let event_id = req.params.current_event_id;
    let info = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
    }
    let user;
    try {
        await validationService.isEventIDValid(event_id);
        db.sequelize.transaction(async (t) => {
            user = await User.create(info, { transaction: t })
            await user.addEvent(event_id, { transaction: t });
        }).then(() => {
            res.status(201).send({ message: "successful created new User", data: user })
        }).catch((error) => {
            if (error.name === 'SequelizeUniqueConstraintError') {
                error.message = "Email address already exists";
                error.statusCode = 409;
            }
            next(handleError(error, "userController"));
        })
    } catch (error) {
        next(handleError(error, "userController"));
    }
}


const claimUser = async (req, res, next) => {
    let event_id = req.params.current_event_id;
    let user_id = req.params.user_id;
    let currentUserId = req.currentUserId;
    let firstName = req.params.firstName;
    let lastName = req.params.lastName;
    try {
        const userEvent = await validationService.isUserinEvent(user_id, event_id);
        const user = await validationService.isUserIDValid(user_id);
        if (user.emailAddress) {
            throw Object.assign(new Error('User already claimed!'), { statusCode: 400 });
        }
        if (user.firstName !== firstName || user.lastName !== lastName) {
            throw Object.assign(new Error('Name does not match!'), { statusCode: 400 });
        }

        await db.sequelize.transaction(async (t) => {
            if (!await UserEvent.findOne({ where: { UserId: currentUserId, EventId: event_id } })) {
                await UserEvent.create({ UserId: currentUserId, EventId: event_id, user: true }, { transaction: t });
            }
            await Activity.update({ user_id: currentUserId }, { where: { user_id: user_id } }, { transaction: t });
            await UserEvent.destroy({ where: { UserId: user_id, EventId: event_id } }, { transaction: t });
            await User.destroy({ where: { id: user_id } }, { transaction: t });
        })
        res.status(204).send({ message: "successful claimed User" })
    } catch (error) {
        next(handleError(error, "userController"));
    }
}


module.exports = {
    getUserById: getUserById,
    getEventsByUser: getEventsByUser,
    deleteUserById: deleteUserById,
    addUser: addUser,
    claimUser: claimUser
}
