module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define('Activity', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
    })

    return Activity
}