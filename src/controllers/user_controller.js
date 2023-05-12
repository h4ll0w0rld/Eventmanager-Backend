const db = require("../models");

// create main Model
const User = db.user;

// GET User by ID
const getUserById = async (req, res) => {
    let id = req.params.id;
    let user = await User.findOne({ where: { id: id } })
    res.status(200).send(user)
}

// TODO Add user to event
// ADD NEW User
const addUser = async (req, res) => {
    let info = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
    }
    const user = await User.create(info)
    res.status(200).send({ message: "successful created new User", data: user })
}


module.exports = {
    getUserById: getUserById,
    addUser: addUser
}
