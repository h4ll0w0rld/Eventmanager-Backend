const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../../models');
const handleError = require('../../services/error_service').handleErrors;
const validationService = require('../../services/validation_service');
const authService = require('../../services/authValidation_service');



const User = db.user;


const handleLogin = async (req, res, next) => {
    let info = {
        emailAddress: req.body.emailAddress,
        password: req.body.password
    }
    try {
        //validate input and get user
        let user = await authService.isLoginValid(info);
        //compare password
        const isPasswordValid = await bcrypt.compare(info.password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        } if (isPasswordValid) {
            //create JWTs
            const accessToken = jwt.sign(
                {
                    id: user.id,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '5m'
                }
            );
            const refreshToken = jwt.sign(
                {
                    id: user.id
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '1d'
                }
            );
            //save refresh token in database
            await User.update({
                refreshToken: refreshToken
            }, { where: { id: user.id } });
            user.password = undefined;
            res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });    //Removen: , sameSite: 'None' 
            res.status(200).send({ message: "successful login", accessToken: accessToken, user: user })
        }
    } catch (error) {
        next(handleError(error, "authController"));
    }
}


module.exports = {
    handleLogin
};
