const moment = require('moment-timezone');
module.exports = (sequelize, DataTypes) => {
    const Shift = sequelize.define('Shift', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
            get() {
                return moment(this.getDataValue('startTime')).tz('Europe/Berlin').format('YYYY-MM-DD HH:mm');
            }
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
            get() {
                return moment(this.getDataValue('endTime')).tz('Europe/Berlin').format('YYYY-MM-DD HH:mm');
            }
        },
        // isActive: {
        //     type: DataTypes.BOOLEAN,
        //     allowNull: false,
        //     defaultValue: true
        // }
    })

    return Shift
}