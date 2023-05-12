module.exports = (sequelize, DataTypes) => {
    const Status = sequelize.define('Status', {
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
    })

    return Status
}