'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/db'); // custom DB connection
const basename = path.basename(__filename);
const db = {};

// Load all model files
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Manually add Reminder model (if not already loaded by the filesystem)
// If you have a reminder.js file, this is not needed, but added for safety
//if (!db.Reminder) {
  //const Reminder = require('./reminder')(sequelize, Sequelize.DataTypes);
  //db[Reminder.name] = Reminder;
//}

// Run associations defined in each model's associate method
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;