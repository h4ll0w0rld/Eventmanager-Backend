const moment = require('moment-timezone');
module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT('medium'),
            allowNull: true
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            get() {
                return moment(this.getDataValue('startDate')).tz('Europe/Berlin').format('YYYY-MM-DD HH:mm');
            }
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
            get() {
                return moment(this.getDataValue('endDate')).tz('Europe/Berlin').format('YYYY-MM-DD HH:mm');
            }
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
    })

    return Event
}