const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require("./src/models");
const cors = require('cors');
const fs = require('fs');
const https = require('https');

const corsOptions = require('./config/corsOptions').corsOptions;
const credentials = require('./src/middleware/credentials_middleware').credentials;
const logoutRoute = require('./src/routes/logout_router');
const registerRoute = require('./src/routes/register_router');
const authRoute = require('./src/routes/auth_router');
const refreshRoute = require('./src/routes/refresh_router');
const verifyJWT = require('./src/middleware/verifyJWT').verifyJWT;
const shiftCategoryRoute = require('./src/routes/api/shiftCategory_router');
const shiftRoute = require('./src/routes/api/shift_router');
const activityRoute = require('./src/routes/api/activity_router');
const userRoute = require('./src/routes/api/user_router');
const eventRoute = require('./src/routes/api/event_router');
const permissionRoute = require('./src/routes/api/permission_router');
const errorHandling = require('./src/middleware/error_middleware');




// initialize express
const app = express();
const PORT = 3000;
const options = {
    key: fs.readFileSync('./certificate/server.key'),
    cert: fs.readFileSync('./certificate/server.crt')
};


//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//middleware for cookies
app.use(cookieParser());


//cors setup
app.use(credentials);
app.use(cors(corsOptions))

app.options('*', cors());


app.use('/logout', logoutRoute);
app.use('/register', registerRoute);
app.use('/auth', authRoute);
app.use('/refresh', refreshRoute);
/*
*******
*******
Middleware
*******
*******
*/

//authenticates the user
app.use(verifyJWT);
//checks for authorization
app.use('/shiftCategory', shiftCategoryRoute);
app.use('/shift', shiftRoute);
app.use('/activity', activityRoute);
app.use('/user', userRoute);
app.use('/event', eventRoute);
app.use('/permission', permissionRoute);







/*
*******
*******
Error Handling
*******
*******
*/


// error handling
app.use(errorHandling.get500);

//close database connection on shutdown
const shutdown = () => {
    console.log('Closing database connection');
    db.sequelize.close()
        .then(() => {
            console.log('Database connection closed');
            process.exit(0);
        })
        .catch((err) => {
            console.log('Error closing database connection', err);
            process.exit(1);
        });
};

// run shutdown on SIGINT and SIGTERM (e.g nodemon restart)
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);



const server = https.createServer(options, app);

//default request
app.get('/', (req, res) => {
    res.send(`Your Server is running and ready for requests on port ${PORT}`)
})


server.listen(PORT, () => console.log(`Your server is listening on port ${PORT}!`))

