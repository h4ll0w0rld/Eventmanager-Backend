const db = require('../models');
const bcrypt = require('bcrypt');
const validationService = require('../services/validation_service');



const User = db.user;



const registerNewUser = async (req, res, next) => {
    let info = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: req.body.password
    }
    try {
        //validate input
        await validationService.isRegisterValid(info);
        //encrypt password
        const hashedPassword = await bcrypt.hash(info.password, 10);
        //create user in database
        const user = await User.create({
            firstName: info.firstName,
            lastName: info.lastName,
            emailAddress: info.emailAddress,
            password: hashedPassword
        });
        res.status(201).send({ message: "successful created new User", data: user })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            error.message = "Email address already exists";
            error.statusCode = 409;
        }
        next(error);
    }
}


const registerExistingUser = async (req, res, next) => {
    let info = {
        id: req.params.user_id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        emailAddress: req.body.emailAddress,
    }
    try {
        //validate input and get user
        const user = await validationService.isUserIDValid(info.id);
        await validationService.isRegisterValid(info);
        //encrypt password
        const hashedPassword = await bcrypt.hash(info.password, 10);
        //update user in database
        await User.update({
            firstName: info.firstName,
            lastName: info.lastName,
            emailAddress: info.emailAddress,
            password: hashedPassword
        }, { where: { id: info.id } });
        res.status(200).send({ message: "successful claimed excisting new User", data: user })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        if (error.name === 'SequelizeUniqueConstraintError') {
            error.message = "Email address already exists";
            error.statusCode = 409;
        }
        next(error);
    }
}



module.exports = {
    registerNewUser,
    registerExistingUser
}