const db = require("../models");
const validationService = require("../services/validation_service");

// create main Model
const User = db.user;

// GET User by ID
const getUserById = async (req, res, next) => {
    let id = req.params.id;
    try {
        let user = await validationService.isUserIDValid(id);
        res.status(200).send(user)
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

// GET all Users from Event

const getUserByEvent = async (req, res, next) => {
    let event_id = req.params.event_id;
    try {
        const event = await validationService.isEventIDValid(event_id);
        let users = await event.getUsers(
            {
                order: [['lastName', 'ASC'], ['firstName', 'ASC']]
            })
        res.status(200).send(users)
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

//GET all Users

const getAllUsers = async (req, res, next) => {
    try {
        let users = await User.findAll(
            {
                order: [['lastName', 'ASC'], ['firstName', 'ASC']]
            })
        res.status(200).send(users)
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

// DELETE User by ID

const deleteUserById = async (req, res, next) => {
    let user_id = req.params.user_id;
    try {
        await validationService.isUserIDValid(user_id);
        let user = await User.destroy({ where: { id: user_id } })
        res.status(200).send({ message: "successful deleted User" })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}




// TODO Add user to event
// ADD NEW User
const addUser = async (req, res, next) => {
    let info = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
    }
    try {
        const user = await User.create(info)
        res.status(200).send({ message: "successful created new User", data: user })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


module.exports = {
    getUserById: getUserById,
    getUserByEvent: getUserByEvent,
    getAllUsers: getAllUsers,
    deleteUserById: deleteUserById,
    addUser: addUser
}
