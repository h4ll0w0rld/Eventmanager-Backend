module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define('Activity', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.ENUM('free', 'requested', 'confirmed', 'selfReq'),
            allowNull: false,
            defaultValue: 'free'
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
       
    })

    return Activity
}