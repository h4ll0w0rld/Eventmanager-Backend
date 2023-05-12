module.exports = (sequelize, DataTypes) => {
    const Shift = sequelize.define('Shift', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        startTime: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        endTime: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    return Shift
}