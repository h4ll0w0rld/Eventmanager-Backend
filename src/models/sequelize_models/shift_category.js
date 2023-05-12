module.exports = (sequelize, DataTypes) => {
    const Shift_Category = sequelize.define('Shift_Category', {
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
            type: DataTypes.STRING,
            allowNull: true
        }
    })

    return Shift_Category
}