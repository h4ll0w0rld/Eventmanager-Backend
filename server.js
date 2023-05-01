import express from 'express';
import routes from './src/routes/routes';
import bodyParser from 'body-parser';
import { sequelize } from './src/controllers/sequelize';


const app = express();
const PORT = 3000;


//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// runs routes.js
routes(app);

//close database connection on shutdown
const shutdown = () => {
    console.log('Closing database connection');
    sequelize.close()
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

