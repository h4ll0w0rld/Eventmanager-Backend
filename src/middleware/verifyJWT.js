const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            const error = new Error('Authentification required');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    const error = new Error('Not authenticated');
                    error.statusCode = 403;
                    throw error;
                }
                req.userId = decoded.id;
                next();
            }

        )
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}


module.exports = {
    verifyJWT
}