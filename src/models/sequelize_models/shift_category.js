module.exports = (sequelize, DataTypes) => {
    const Shift_Category = sequelize.define('Shift_Category', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT('medium'),
            allowNull: true
        }
    })

    return Shift_Category
}

