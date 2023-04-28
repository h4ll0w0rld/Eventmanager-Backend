import Sequelize from 'sequelize';
import config from '../../config';
// import sequelize from "../../server";

//importing models
import ShiftModel from "../models/shift";
import EventModel from "../models/event";

// sets up the database connection
const sequelize = new Sequelize(
    config.database.name,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        port: config.database.port,
        dialect: "mysql",
    }
);

//connects to the database
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});


/** Database-Setup **/
//Models/tables
const Event = EventModel(sequelize, Sequelize);
const Shift = ShiftModel(sequelize, Sequelize);


// TODO Relations
// Event.hasMany(Shift);


//syncs the database
sequelize.sync()
    .then(() => {
        console.log(`Database & tables created!`)
    }).catch((error) => {
        console.log(`Error creating database & tables!`)
    });



/** 
 * 
 * Controller-Functions 
 * 
 * **/

/**** SHIFTS ****/

//GET all shifts
// export const getAllShifts = (req, res) => {
//     db.query('Select * from Shift;', (err, data) => {
//         if (err) throw err;
//         res.json(data);
//     });
// }

export const getAllShifts = (req, res) => {
    Shift.findAll().then((shifts) => {
        res.json(shifts);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}
//POST a new shift
export const addNewShift = (req, res) => {
    db.query('INSERT INTO Shift (startTime, endTime) VALUES (?,?);', [req.body.startTime, req.body.endTime], (err, data) => {
        if (err) throw err;
        res.json(data);
    });
}


//EDIT excisting shift
export const editShift = (req, res) => {
    db.query('UPDATE Shift SET startTime = ?, endTime = ? WHERE idShift = ? ', [req.body.startTime, req.body.endTime, req.params.idShift], (err, data) => {
        console.log(req.body.startTime, req.body.endTime, req.params.idShift);
        if (err) throw err;
        res.json(data);
    });
}


//DELETE excisting shift
export const deleteShift = (req, res) => {
    db.query('DELETE FROM Shift WHERE idShift = ? ', [req.params.idShift], (err, data) => {
        if (err) throw err;
        res.json(data);
    });
}