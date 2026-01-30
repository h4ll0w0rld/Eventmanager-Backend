const moment = require('moment-timezone');

module.exports = (sequelize, DataTypes) => {
    const AdminNote = sequelize.define('AdminNote', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        note: {
            type: DataTypes.TEXT('medium'),
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            get() {
                return moment(this.getDataValue('createdAt')).tz('Europe/Berlin').format('YYYY-MM-DD HH:mm');
            }
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            get() {
                return moment(this.getDataValue('updatedAt')).tz('Europe/Berlin').format('YYYY-MM-DD HH:mm');
            }
        }
    });

    

    return AdminNote;
};
