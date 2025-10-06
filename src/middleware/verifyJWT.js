const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user;
const handleError = require('../services/error_service').handleErrors;
require('dotenv').config();

const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            const error = new Error('Authentification required');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];
        console.log(token, "bbb")
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    const error = new Error('Not authenticated');
                    error.statusCode = 401;
                    throw error;
                }
                req.currentUserId = decoded.id;
            }
        )
        const user = await User.findOne({ where: { id: req.currentUserId } });
        if (!user) {
            const error = new Error('Logged in User does not exist anymore');
            error.statusCode = 401;
            throw error;
        }
        next();
    } catch (error) {
        next(handleError(error, "verifyJWT"));
    }
}


module.exports = {
    verifyJWT
}