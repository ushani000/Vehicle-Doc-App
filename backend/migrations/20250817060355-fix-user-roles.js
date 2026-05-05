// migrations/[timestamp]-fix-user-roles.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Fix admin role
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET role = 'admin'
      WHERE email = 'admin@gmail.com' 
        AND phone = '011 2223338'
    `);

    // Fix officer role
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET role = 'officer'
      WHERE email = 'motortraffic@gmail.com' 
        AND phone = '011 0333666'
    `);

    console.log('✅ Fixed user roles');
  },

  async down(queryInterface, Sequelize) {
    // Revert changes
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET role = 'user'
      WHERE email = 'admin@gmail.com' 
        OR email = 'motortraffic@gmail.com'
    `);
    
    console.log('✅ Reverted role changes');
  }
};