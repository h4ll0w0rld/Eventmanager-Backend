const jwt = require('jsonwebtoken');
require('dotenv').config();
const handleError = require('../../services/error_service').handleErrors;
const db = require('../../models');



const User = db.user;


const handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    try {
        if (!cookies?.jwt) {
            const error = new Error("Unauthorized");
            error.statusCode = 401;
            throw error;
        }
        const refreshToken = cookies.jwt;
        const user = await User.findOne({ where: { refreshToken: refreshToken } });
        if (!user) {
            const error = new Error("refresh Token does not exist");
            error.statusCode = 401;
            throw error;
        }
        //evaluate jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || user.id !== decoded.id) {
                    const error = new Error('refresh Token is not valid');
                    error.statusCode = 401;
                    throw error;
                }
                const accessToken = jwt.sign(
                    {
                        id: decoded.id,
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '1d'
                    }
                );
                res.status(200).send({ message: "successful refresh", accessToken: accessToken })
            }
        )
    } catch (error) {
        next(handleError(error, "refreshTokenController"));
    }
}


module.exports = {
    handleRefreshToken
};
