const db = require('../../models');
const bcrypt = require('bcrypt');
const handleError = require('../../services/error_service').handleErrors;
const validationService = require('../../services/validation_service');
const authService = require('../../services/authValidation_service');



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
        await authService.isRegisterValid(info);
        //encrypt password
        const hashedPassword = await bcrypt.hash(info.password, 10);
        //create user in database
        let user = await User.create({
            firstName: info.firstName,
            lastName: info.lastName,
            emailAddress: info.emailAddress,
            password: hashedPassword
        });
        user.password = undefined;
        res.status(201).send({ message: "successful created new User", data: user })
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            error.message = "Email address already exists";
            error.statusCode = 409;
        }
        next(handleError(error, "registerController"));
    }
}






module.exports = {
    registerNewUser,
}