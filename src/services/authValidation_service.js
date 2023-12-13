const db = require("../models");
const handleError = require("./error_service").handleErrors;

const User = db.user;


const isRegisterValid = async (user) => {
    try {
        if (user.firstName && user.lastName && user.emailAddress && user.password) {
            if (user.password.length < 8) {
                const error = new Error("Password must be at least 8 characters long");
                error.statusCode = 400;
                throw error;
            }
        } else {
            throw Object.assign(new Error("Missing required fields!"), { statusCode: 400 });
        }
    }
    catch (error) {
        throw handleError(error, "authValidationService");
    }
}

const isLoginValid = async (info) => {
    try {
        if (info.emailAddress && info.password) {
            const user = await User.findOne({ where: { emailAddress: info.emailAddress } });
            if (!user) {
                throw Object.assign(new Error("User not found!"), { statusCode: 404 });
            } else {
                return user;
            }
        } else {
            throw Object.assign(new Error("Missing required fields!"), { statusCode: 400 });
        }
    }
    catch (error) {
        throw handleError(error, "authValidationService");
    }
}




module.exports = {
    isRegisterValid,
    isLoginValid,
}