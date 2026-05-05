
const { Vehicle, Document } = require('../models');
const path = require('path');

exports.addVehicle = async (req, res) => {

  try {
    const { userId, ownerName, vehicleType, vehicleBrand, vehicleNumber, province } = req.body;

    // ✅ UPDATED: Prevent duplicate vehicleNumber entries
    const existingVehicle = await Vehicle.findOne({ where: { vehicleNumber } });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle number already exists' });
    }

    const vehicle = await Vehicle.create({
      userId,
      ownerName,
      vehicleType,
      vehicleBrand,
      vehicleNumber,
      province
    });

    res.status(201).json({ message: 'Vehicle details saved', vehicle });
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({ message: 'Failed to save vehicle details', error });
  }
};

//const { Document } = ('../models');
//const { Vehicle, Document } = require('../models');
//const path = require('path');
//-new
exports.uploadDocument = async (req, res) => {
  try {
    console.log('--- Upload request received ---');
    console.log('File:', req.file);
    console.log('Body:', req.body);

    if (!req.file) return res.status(400).json({ message: 'No file uploaded or invalid type' });

    const { vehicleNumber, docType } = req.body;
    const vehicle = await Vehicle.findOne({ where: { vehicleNumber } });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const docUrl = `/uploads/${req.file.filename}`;
    const document = await Document.create({ vehicleNumber, docType, docUrl });

    res.status(200).json({ message: 'Document uploaded successfully', document, docUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error });
  }
};
//-new
// ✅ NEW FUNCTION: Get all vehicles for a specific user
exports.getVehiclesByUser = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from URL params
    const vehicles = await Vehicle.findAll({ where: { userId } }); // Fetch all vehicles for that user
    res.status(200).json(vehicles); // Return as JSON
  } catch (error) {
    console.error('Fetch vehicles error:', error);
    res.status(500).json({ message: 'Failed to fetch vehicles', error });
  }
};


//exports.uploadDocument = async (req, res) => {
  //try {
    //const { vehicleNumber, docType } = req.body;

    //if (!req.file) {
      //return res.status(400).json({ message: 'No file uploaded' });
    //}

    //const imagePath = `/uploads/${req.file.filename}`;
    //const imagePath = `/uploads/${req.file.filename}`;


    //const document = await Document.create({
      //vehicleNumber,
      //docType,
      //docUrl: imagePath,
   // });

    //res.status(200).json({ message: 'Document uploaded successfully', docUrl: imagePath });
  //} catch (error) {
    //console.error('Upload error:', error);
    //res.status(500).json({ message: 'Upload failed', error });
  //}
//};

