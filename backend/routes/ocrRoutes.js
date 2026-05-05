// routes/ocrRoutes.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const { createWorker } = require('tesseract.js');
const { Document } = require('../models'); // Sequelize model

const router = express.Router();

// ===== 1. Create uploads folder if not exists =====
const uploadFolder = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// ===== 2. Multer setup =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ===== 3. Tesseract Worker =====
const worker = createWorker();

// ===== 4. Helper: OCR process =====
async function processImage(filePath) {
  // Convert to PNG for better OCR
  const processedPath = filePath.replace(path.extname(filePath), '.png');
  await sharp(filePath).png().toFile(processedPath);

  // Run OCR
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(processedPath);
  await worker.terminate();

  return text;
}

// ===== 5. Upload & OCR endpoint =====
router.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    const ocrText = await processImage(req.file.path);

    // Save in DB
    const document = await Document.create({
      filename: req.file.filename,
      filepath: req.file.path,
      ocrText
    });

    res.json({
      success: true,
      message: 'File uploaded & processed successfully',
      document
    });
  } catch (err) {
    console.error('OCR Error:', err);
    res.status(500).json({ success: false, message: 'OCR processing failed' });
  }
});

// ===== 6. List documents endpoint =====
router.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.json({ success: true, documents });
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch documents' });
  }
});

module.exports = router;
