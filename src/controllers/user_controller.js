const db = require("../models");
const crudController = require("./crud_controller");

// create main Model
const User = db.user;

// GET User by ID
const getUserById = async (req, res, next) => {
    let id = req.params.id;
    try {
        let user = await crudController.getUserById(id);
        res.status(200).send(user)
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
    addUser: addUser
}
