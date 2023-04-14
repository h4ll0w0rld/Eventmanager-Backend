import express from 'express';
import mysql from 'mysql';
import config from './config';  //import config file for database connection
import routes from './src/routes/crmRoutes';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

//set up database connection
const db = mysql.createConnection({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name
});


//connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log(`Connected to database: ${config.database.name} and logged in with the user: ${config.database.user}`);
});


//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


routes(app);


//default request
app.get('/', (req, res) => {
    res.send(`Your Server is running and ready for requests on port ${PORT}`)
})


/*
*
* API Request impmenetation
*
*/


/********** SHIFTs *********/


//GET all shifts
app.get('/shift', (req, res) => {

    //get every shift 
    db.query('Select * from Shift;', (err, rows) => {

        if (err) throw err;

        console.log(rows);

        //responde all shifts
        res.send(
            {
                rows
            }
        );
    });
});


//POST a new shift
app.post('/shift', (req, res) => {

});




app.listen(PORT, () => console.log(`Your server is listening on port ${PORT}!`))

