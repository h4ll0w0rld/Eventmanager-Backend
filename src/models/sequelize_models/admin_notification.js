module.exports = (sequelize, DataTypes) => {
  const AdminNotification = sequelize.define('AdminNotification', {
    userId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER,
    activityId: DataTypes.INTEGER,
    message: DataTypes.STRING,
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
   {  timestamps: true // ✅ adds createdAt and updatedAt columns automatically
});

  AdminNotification.associate = function(models) {
    // This is the key part
    AdminNotification.belongsTo(models.user, { as: 'user', foreignKey: 'userId' });
    AdminNotification.belongsTo(models.event, { as: 'event', foreignKey: 'eventId' });
  };

  return AdminNotification;
};
