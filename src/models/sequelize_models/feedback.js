module.exports = (sequelize, DataTypes) => {
    const feedback = sequelize.define('Feedback', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },  note: {
            type: DataTypes.TEXT('medium'),
            allowNull: false
        },
       
    })

    return feedback
}