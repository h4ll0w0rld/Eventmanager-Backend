import express from 'express';
import routes from './src/routes/routes';
import bodyParser from 'body-parser';


const app = express();
const PORT = 3000;


// // sets up the database connection
// export const sequelize = new Sequelize(
//     config.database.name,
//     config.database.user,
//     config.database.password,
//     {
//         host: config.database.host,
//         port: config.database.port,
//         dialect: "mysql",
//     }
// );

// //connects to the database
// sequelize.authenticate().then(() => {
//     console.log('Connection has been established successfully.');
// }).catch((error) => {
//     console.error('Unable to connect to the database: ', error);
// });


//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// runs routes.js
routes(app);


//default request
app.get('/', (req, res) => {
    res.send(`Your Server is running and ready for requests on port ${PORT}`)
})


app.listen(PORT, () => console.log(`Your server is listening on port ${PORT}!`))

