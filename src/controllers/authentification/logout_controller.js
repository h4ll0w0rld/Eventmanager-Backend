const db = require('../../models');
const handleError = require('../../services/error_service').handleErrors;
const User = db.user;

const handleLogout = async (req, res, next) => {
    // TODO on client, also delete AccessToken
    const cookies = req.cookies;
    try {
        if (!cookies?.jwt) {
            res.status(204).send({ message: "successful logout" })
        }
        const refreshToken = cookies.jwt;
        // is refreshToken in DB?
        const user = await User.findOne({ where: { refreshToken: refreshToken } });
        if (!user) {
            res.clearCookie('jwt', { httpOnly: true });
            res.status(204).send({ message: "successful logout" })
        }
        // delete refreshToken from DB
        await User.update({
            refreshToken: null
        }, { where: { id: user.id } });
        // delete refreshToken from Cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.status(204).send({ message: "successful logout" })
    } catch (error) {
        next(handleError(error, "logoutController"));
    }
}


module.exports = {
    handleLogout
};