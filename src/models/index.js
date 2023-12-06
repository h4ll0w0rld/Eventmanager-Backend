const dbConfig = require("../../config/dbConfig.js");

const { Sequelize, DataTypes } = require("sequelize");


const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: dbConfig.DIALECT,
        timezone: dbConfig.TIMEZONE,
        define: {
            timestamps: false
        }
    }
)

//connects to the database
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.event = require('./sequelize_models/event.js')(sequelize, DataTypes);
db.user = require('./sequelize_models/user.js')(sequelize, DataTypes);
db.shift_category = require('./sequelize_models/shift_category.js')(sequelize, DataTypes);
db.shift = require('./sequelize_models/shift.js')(sequelize, DataTypes);
db.status = require('./sequelize_models/status.js')(sequelize, DataTypes);
db.activity = require('./sequelize_models/activity.js')(sequelize, DataTypes);
db.userEvent = sequelize.define('user_event', {});



db.sequelize.sync({ force: dbConfig.OverwriteOnSync })
    .then(() => {
        console.log('Databse synced');
    }).catch((error) => {
        console.log('Error syncing database: ', error);
    });


//  Relations


db.event.hasMany(db.shift_category, {
    onDelete: 'cascade',
    foreignKey: {
        name: 'event_id',
        allowNull: false
    },
    as: 'shift_categories'
});

db.shift_category.belongsTo(db.event, {
    foreignKey: {
        name: 'event_id',
        allowNull: false
    },
    as: 'event'
});

db.shift_category.hasMany(db.shift, {
    onDelete: 'cascade',
    foreignKey: {
        name: 'shift_category_id',
        allowNull: false
    },
    as: 'shifts'
});

db.shift.belongsTo(db.shift_category, {
    foreignKey: {
        name: 'shift_category_id',
        allowNull: false
    },
    as: 'shift_category'
});

// test
db.event.belongsToMany(db.user, { through: db.userEvent });
db.user.belongsToMany(db.event, { through: db.userEvent });

db.shift.hasMany(db.activity, {
    onDelete: 'cascade',
    foreignKey: {
        name: 'shift_id',
        allowNull: false
    },
    as: 'activities'
});

db.activity.belongsTo(db.shift, {
    foreignKey: {
        name: 'shift_id',
        allowNull: false
    },
    as: 'shift'
});

db.user.hasMany(db.activity, {
    onDelete: 'set null',
    foreignKey: {
        name: 'user_id',
        allowNull: true
    },
    as: 'activities'
});

db.activity.belongsTo(db.user, {
    foreignKey: {
        name: 'user_id',
        allowNull: true
    },
    as: 'user'
});


// db.status.hasMany(db.activity, {
//     onDelete: 'restrict',
//     foreignKey: {
//         name: 'status_id',
//         allowNull: false
//     },
//     as: 'activities'
// });

// db.activity.belongsTo(db.status, {
//     foreignKey: {
//         name: 'status_id',
//         allowNull: false
//     },
//     as: 'status'
// });


module.exports = db;