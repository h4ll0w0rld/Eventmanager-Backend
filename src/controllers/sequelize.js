import Sequelize from 'sequelize';
import config from '../../config';

//importing models
import ShiftModel from "../models/sequelize/shift";
import EventModel from "../models/sequelize/event";
import UserModel from "../models/sequelize/user";
import ShiftCategoryModel from "../models/sequelize/shift_category";
import StatusModel from "../models/sequelize/status";
import ActivityModel from "../models/sequelize/activity";

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
export const Event = EventModel(sequelize, Sequelize);
export const User = UserModel(sequelize, Sequelize);
export const UserEvent = sequelize.define('UserEvent', {});
export const Shift = ShiftModel(sequelize, Sequelize);
export const Shift_Category = ShiftCategoryModel(sequelize, Sequelize);
export const Status = StatusModel(sequelize, Sequelize);
export const Activity = ActivityModel(sequelize, Sequelize);


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


