//vehcileRoutes.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const upload = require('../middlewares/upload');

// Add a vehicle
router.post('/add', vehicleController.addVehicle);

// Upload document (Revenue License)
router.post(
  '/upload',
  upload.single('document'), // Must match FormData key
  vehicleController.uploadDocument
);

// Get vehicles by user
router.get('/user/:userId', vehicleController.getVehiclesByUser);

module.exports = router;