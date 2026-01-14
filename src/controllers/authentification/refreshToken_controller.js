const jwt = require('jsonwebtoken');
require('dotenv').config();
const handleError = require('../../services/error_service').handleErrors;
const db = require('../../models');



const User = db.user;


const handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    //const authHeader = req.headers['authorization'];
    console.log("Haha", cookies.jwt)

    try {
        // if (!authHeader) {
        //     const error = new Error('Authentification required');
        //     console.log("AUTH REQ")
        //     error.statusCode = 401;
        //     throw error;
        // }

        if (!cookies?.jwt) {
            const error = new Error("Unauthorized");
            error.statusCode = 402;
            throw error;
        }
        //const token = .split(' ')[1];
        const refreshToken = cookies.jwt;
        const user = await User.findOne({ where: { refreshToken: refreshToken } });
        if (!user) {
            const error = new Error("refresh Token does not exist");
            console.log("refresh Token does not exist")
            error.statusCode = 402;
            throw error;
        }
        //evaluate jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || user.id !== decoded.id) {
                    const error = new Error('refresh Token is not valid');
                    console.log("refresh Token is not valid")
                    error.statusCode = 402;
                    throw error;
                }
                console.log("alles jütz")
                const accessToken = jwt.sign(
                    {
                        id: decoded.id,
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: '50m'
                    }
                );
                res.cookie('jwt', accessToken, { httpOnly: true, secure: true, maxAge: 60 * 1000 });
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
