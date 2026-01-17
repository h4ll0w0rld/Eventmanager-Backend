// models/invite_token.js
module.exports = (sequelize, DataTypes) => {
  const InviteToken = sequelize.define('InviteToken', {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'invite_tokens'
  });

  InviteToken.associate = function(models) {
    // if you want, you can define associations
    InviteToken.belongsTo(models.Event, { foreignKey: 'eventId' });
  };

  return InviteToken;
};
