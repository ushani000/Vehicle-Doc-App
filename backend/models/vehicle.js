// backend/models/vehicle.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Define associations here
     */
    static associate(models) {
  Vehicle.belongsTo(models.User, { foreignKey: 'userId' });
  Vehicle.hasMany(models.Document, { foreignKey: 'vehicleNumber', sourceKey: 'vehicleNumber' });
}
}

  Vehicle.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ownerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleBrand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
  }, {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicle_details',     // ✅ Use exact table name
    timestamps: false                 // ✅ (optional) Disable createdAt/updatedAt
  });

  return Vehicle;
};
