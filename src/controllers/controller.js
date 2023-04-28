import Sequelize from 'sequelize';
import config from '../../config';

//importing models
import ShiftModel from "../models/shift";
import EventModel from "../models/event";
import UserModel from "../models/user";
import ShiftCategoryModel from "../models/shift_category";
import StatusModel from "../models/status";
import ActivityModel from "../models/activity";

// sets up the database connection
export const sequelize = new Sequelize(
    config.database.name,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        port: config.database.port,
        dialect: "mysql",
        define: {
            timestamps: false
        },
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
const User = UserModel(sequelize, Sequelize);
const UserEvent = sequelize.define('UserEvent', {});
const Shift = ShiftModel(sequelize, Sequelize);
const Shift_Category = ShiftCategoryModel(sequelize, Sequelize);
const Status = StatusModel(sequelize, Sequelize);
const Activity = ActivityModel(sequelize, Sequelize);


//  Relations
Event.hasMany(Shift, {
    onDelete: 'cascade',
    foreignKey: {
        allowNull: false
    }
});
Event.hasMany(Shift_Category, {
    onDelete: 'cascade',
    foreignKey: {
        allowNull: false
    }
});

//TODO: onDelete: 'cascade'
Event.belongsToMany(User, { through: UserEvent });
User.belongsToMany(Event, { through: UserEvent });

Shift.hasMany(Activity, {
    onDelete: 'cascade',
    foreignKey: {
        allowNull: false
    }
});

User.hasMany(Activity, {
    onDelete: 'restrict',
    foreignKey: {
        allowNull: true
    }
});

Status.hasMany(Activity, {
    onDelete: 'restrict',
    foreignKey: {
        allowNull: false
    }
});

Shift_Category.hasMany(Activity, {
    onDelete: 'cascade',
    foreignKey: {
        allowNull: false
    }
}
);


//syncs the database
const sync_database_structure = (force) => {
    sequelize.sync({ force: force })
        .then(() => {
            console.log(`Database & tables created!`)
        }).catch((error) => {
            console.log(`Error creating database & tables!`, error)
        });
};

// NOTE set to true to replace the database
const replace_database = false;
// NOTE comment out to prevent database from being synced
// sync_database_structure(replace_database);





/** 
 * 
 * ****************   Controller-Functions ****************
 * 
 * **/


/**************** Events  ****************/

//GET all events
export const getAllEvents = (req, res) => {
    Event.findAll().then((events) => {
        res.json(events);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

//GET event by id
export const getEventById = (req, res) => {
    Event.findByPk(req.params.id).then((event) => {
        res.json(event);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

//POST a new event

export const addNewEvent = (req, res) => {
    // Add a new Event with sequelize
    Event.create({
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
    }).then((event) => {
        res.status(200).json({ msg: "added successfully a event" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

//EDIT excisting event

export const editEvent = (req, res) => {
    Event.update({
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        location: req.body.location,
    }, { where: { id: req.params.id } }).then((event) => {
        res.status(200).json({ msg: "updated successfully a event" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

//DELETE event by id

export const deleteEvent = (req, res) => {
    Event.destroy({ where: { id: req.params.id } }).then((event) => {
        res.status(200).json({ msg: "deleted successfully a event" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}


/**************** Users  ****************/

//GET user by id

export const getUserById = (req, res) => {
    User.findByPk(req.params.id).then((user) => {
        res.json(user);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

//POST a new user

export const addNewUser = (req, res) => {
    // Add a new User with sequelize
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,

    }).then((user) => {
        res.status(200).json({ msg: "added successfully a user" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

//EDIT excisting user

export const editUser = (req, res) => {
    User.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
    }, { where: { id: req.params.id } }).then((user) => {
        res.status(200).json({ msg: "updated successfully a user" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}


//DELETE user by id

export const deleteUser = (req, res) => {
    User.destroy({ where: { id: req.params.id } }).then((user) => {
        res.status(200).json({ msg: "deleted successfully a user" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}





/************* SHIFTS *************/



//GET all shifts
export const getAllShifts = (req, res) => {
    Shift.findAll().then((shifts) => {
        res.json(shifts);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

//GET shift by id
export const getShiftById = (req, res) => {
    Shift.findByPk(req.params.id).then((shift) => {
        res.json(shift);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}

//POST a new shift
export const addNewShift = (req, res) => {
    // Add a new Shift with sequelize
    Shift.create({
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        EventId: req.body.EventId,
    }).then((shift) => {
        res.status(200).json({ msg: "added successfully a shift" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}


//EDIT excisting shift
export const editShift = (req, res) => {
    Shift.update({
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        EventId: req.body.EventId,
    }, { where: { id: req.params.id } }).then((shift) => {
        res.status(200).json({ msg: "updated successfully a shift" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}


//DELETE excisting shift
export const deleteShift = (req, res) => {
    Shift.destroy({ where: { id: req.params.id } }).then((shift) => {
        res.status(200).json({ msg: "deleted successfully a shift" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });
}



/************* SHIFT CATEGORIES *************/




//GET all shift categories
export const getAllShiftCategories = (req, res) => {
    Shift_Category.findAll().then((shift_categories) => {
        res.json(shift_categories);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });

}

//GET shift category by id
export const getShiftCategoryById = (req, res) => {
    Shift_Category.findByPk(req.params.id).then((shift_category) => {
        res.json(shift_category);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });
        });

}

//POST a new shift category
export const addNewShiftCategory = (req, res) => {
    // Add a new Shift_Category with sequelize
    Shift_Category.create({
        name: req.body.name,
        description: req.body.description,
        EventId: req.body.EventId,
    }).then((shift_category) => {
        res.status(200).json({ msg: "added successfully a shift_category" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });

        });
}

//EDIT excisting shift category
export const editShiftCategory = (req, res) => {
    Shift_Category.update({
        name: req.body.name,
        description: req.body.description,
        EventId: req.body.EventId,
    }, { where: { id: req.params.id } }).then((shift_category) => {
        res.status(200).json({ msg: "updated successfully a shift_category" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });

        });
}

//DELETE excisting shift category
export const deleteShiftCategory = (req, res) => {
    Shift_Category.destroy({ where: { id: req.params.id } }).then((shift_category) => {
        res.status(200).json({ msg: "deleted successfully a shift_category" });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: "error", details: err });

        });
}