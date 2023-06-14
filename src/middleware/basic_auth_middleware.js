const auth = require('basic-auth');

const username = 'projektle';
const password = 'ventit23';

const basicAuth = (req, res, next) => {
    const user = auth(req);
    if (!user || user.name !== username || user.pass !== password) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Authorization Required"');
        res.status(401).send('Unauthorized');
        return
    } else {
        next();
    }
}


module.exports = {
    basicAuth: basicAuth
}