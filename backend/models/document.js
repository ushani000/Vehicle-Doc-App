'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {
      Document.belongsTo(models.Vehicle, {
        foreignKey: 'vehicleNumber',
        targetKey: 'vehicleNumber',
        onDelete: 'CASCADE' // ✅ If a vehicle is deleted, delete its docs too
      });
    }
  }

  Document.init({
    vehicleNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    docType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    docUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    sequelize,
    modelName: 'Document',
    tableName: 'vehicle_documents',
    timestamps: true,
  });

  return Document;
};