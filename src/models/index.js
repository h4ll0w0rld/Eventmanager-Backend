const dbConfig = require("../../config/dbConfig.js");
const AdminNote = require('../models/sequelize_models/admin_note.js'); // ✅ make sure this exists

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
);

// Connects to the database
sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((error) => console.error('Unable to connect to the database: ', error));

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.event = require('./sequelize_models/event.js')(sequelize, DataTypes);
db.user = require('./sequelize_models/user.js')(sequelize, DataTypes);
db.shift_category = require('./sequelize_models/shift_category.js')(sequelize, DataTypes);
db.shift = require('./sequelize_models/shift.js')(sequelize, DataTypes);
db.activity = require('./sequelize_models/activity.js')(sequelize, DataTypes);
db.adminNote = AdminNote(sequelize, DataTypes); 
db.adminNotification = require('./sequelize_models/admin_notification.js')(sequelize, DataTypes);
db.feedback = require('./sequelize_models/feedback.js')(sequelize, DataTypes);
// InviteToken model
db.inviteToken = require('./sequelize_models/invite_token.js')(sequelize, DataTypes); // <-- new

// UserEvent join table
db.userEvent = sequelize.define('user_event', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    user: { type: DataTypes.BOOLEAN, defaultValue: false },
    guest: { type: DataTypes.BOOLEAN, defaultValue: true }
});
db.event.belongsToMany(db.user, { through: db.userEvent, onDelete: 'cascade' });
db.user.belongsToMany(db.event, { through: db.userEvent, onDelete: 'cascade' });

// ShiftCategoryEditor join table
db.shiftCategoryEditor = sequelize.define('shift_category_editor');
db.userEvent.belongsToMany(db.shift_category, { through: db.shiftCategoryEditor, onDelete: 'cascade' });
db.shift_category.belongsToMany(db.userEvent, { through: db.shiftCategoryEditor, onDelete: 'cascade' });

// Associations
db.event.hasMany(db.shift_category, { onDelete: 'cascade', foreignKey: { name: 'event_id', allowNull: false }, as: 'shift_categories' });
db.shift_category.belongsTo(db.event, { foreignKey: { name: 'event_id', allowNull: false }, as: 'event' });
db.shift_category.hasMany(db.shift, { onDelete: 'cascade', foreignKey: { name: 'shift_category_id', allowNull: false }, as: 'shifts' });
db.shift.belongsTo(db.shift_category, { foreignKey: { name: 'shift_category_id', allowNull: false }, as: 'shift_category' });
db.shift.hasMany(db.activity, { onDelete: 'cascade', foreignKey: { name: 'shift_id', allowNull: false }, as: 'activities' });
db.activity.belongsTo(db.shift, { foreignKey: { name: 'shift_id', allowNull: false }, as: 'shift' });
db.user.hasMany(db.activity, { onDelete: 'set null', foreignKey: { name: 'user_id', allowNull: true }, as: 'activities' });
db.activity.belongsTo(db.user, { foreignKey: { name: 'user_id', allowNull: true }, as: 'user' });
db.user.hasMany(db.adminNote, { foreignKey: "userId" });
db.adminNote.belongsTo(db.user, { as: "user", foreignKey: "userId" });

db.adminNote.belongsTo(db.user, { as: "admin", foreignKey: "adminId" });
// Optional: Associate InviteToken to Event
db.inviteToken.belongsTo(db.event, { foreignKey: 'eventId', as: 'event' });
db.event.hasMany(db.inviteToken, { foreignKey: 'eventId', as: 'inviteTokens' });

// Sync database
db.sequelize.sync({ force: dbConfig.OverwriteOnSync })
    .then(() => console.log('Database synced'))
    .catch((error) => console.log('Error syncing database: ', error));

module.exports = db;
