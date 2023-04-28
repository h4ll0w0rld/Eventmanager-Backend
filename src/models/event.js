module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Event', {
        idEvent: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        eventName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        eventDescription: {
            type: DataTypes.STRING,
            allowNull: true
        },
        eventStartDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        eventEndDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        eventLocation: {
            type: DataTypes.STRING,
            allowNull: true
        },
    })
}