const express = require('express');
const bodyParser = require('body-parser');
const db = require("./src/models");
const cors = require('cors');






// initialize express
const app = express();
const PORT = 3000;


//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//cors setups
const corsOptions = {
    origin: '*', // Specify the allowed origin(s)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
};
app.use(cors(corsOptions))

app.options('*', cors());


/*
*******
*******
Middleware
*******
*******
*/

const baseAuth = require('./src/middleware/basic_auth_middleware');
app.use(baseAuth.basicAuth);
/*
*******
*******
Routes
*******
*******
*/

// define route files
const shiftCategoryRoute = require('./src/routes/shiftCategory_router');
app.use('/shiftCategory', shiftCategoryRoute);


const eventRoute = require('./src/routes/event_router');
app.use('/event', eventRoute);

const userRoute = require('./src/routes/user_router');
app.use('/user', userRoute);

const shiftRoute = require('./src/routes/shift_router');
app.use('/shift', shiftRoute);

const activityRoute = require('./src/routes/activity_router');
app.use('/activity', activityRoute);








/*
*******
*******
Error Handling
*******
*******
*/


// import error controller
const errorController = require('./src/controllers/error_controller');
// error handling
app.use(errorController.get400);
app.use(errorController.get404);
app.use(errorController.get500);

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


//default request
app.get('/', (req, res) => {
    res.send(`Your Server is running and ready for requests on port ${PORT}`)
})


app.listen(PORT, () => console.log(`Your server is listening on port ${PORT}!`))

