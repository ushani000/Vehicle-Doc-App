// backend/models/user.js
module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
}, {
  timestamps: false // 👈 Add this line to disable createdAt and updatedAt
});


  // ✅ Add association inside associate method
  User.associate = (models) => {
    User.hasMany(models.Message, { as: 'sentMessages', foreignKey: 'senderId' });
    User.hasMany(models.LoginHistory, {foreignKey: 'userId',as: 'loginHistory',});

  };

  return User;
};
