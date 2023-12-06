const db = require('../models');
const bcrypt = require('bcrypt');
const validationService = require('../services/validation_service');



const User = db.user;


const handleLogin = async (req, res, next) => {
    let info = {
        emailAddress: req.body.emailAddress,
        password: req.body.password
    }
    try {
        //validate input and get user
        const user = await validationService.isLoginValid(info);
        //compare password
        const isPasswordValid = await bcrypt.compare(info.password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).send({ message: "successful login", data: user })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


module.exports = {
    handleLogin
};
