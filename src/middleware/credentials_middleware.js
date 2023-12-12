const allowedOrigins = require('../../config/allowedOrigins').allowedOrigins;
const handleError = require('../services/error_service').handleErrors;


const credentials = (req, res, next) => {
    try {
        const origin = req.headers.origin;
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Credentials', true);
        }
        next();
    } catch (error) {
        next(handleError(error, "credentialsMiddleware"));
    }
}

module.exports = {
    credentials
}