// backend/index.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); //  Import multer
const { sequelize } = require('./models');
const { startReminderWorker } = require('./services/reminderService'); // ADDED: Import work
//const redis = require('redis'); // ADDED: Redis client

// Route imports
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chatRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const ocrRoutes = require('./routes/ocrRoutes');
const chatController = require('./controllers/chatController');
const postRoutes = require('./routes/postRoutes'); // Add this line

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

//  Make io accessible in controllers
app.set('io', io);

// Ensure upload folders exist
const UPLOAD_BASE = path.join(__dirname, 'uploads');
const ORIGINALS = path.join(UPLOAD_BASE, 'originals');
const PROCESSED = path.join(UPLOAD_BASE, 'processed');

[UPLOAD_BASE, ORIGINALS, PROCESSED].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

//  Serve static files for uploaded documents
app.use('/uploads', express.static(UPLOAD_BASE));

//  Test route
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Update CORS configuration
app.use(cors({
  origin: ['http://localhost:8081', 'http://192.168.1.3:8081', 'exp://192.168.1.3:8081'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this line

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/document', ocrRoutes);

//  Socket.IO implementation
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('send_message', async (data) => {
    try {
      console.log('Received message with tempId:', data.tempId);
      const savedMessage = await chatController.saveMessage(data);

      console.log('Emitting message with tempId:', data.tempId);
      socket.broadcast.emit('receive_message', {
        id: savedMessage.id,
        content: savedMessage.content,
        fileUrl: savedMessage.fileUrl,
        senderId: savedMessage.senderId,
        receiverId: savedMessage.receiverId,
        timestamp: savedMessage.createdAt,
        tempId: data.tempId || null,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;

//redis
// ADDED: Redis health check function
//const checkRedis = () => new Promise((resolve) => {
 
    //},

sequelize.sync({ alter: true }) //  Add { alter: true } to automatically update tables
  .then(() => {
    console.log(' Database synced successfully!');

    //
    // ========================  ADDED: REMINDER WORKER SETUP
    // Initialize reminder worker after DB sync
    try {
      const worker = startReminderWorker();
      console.log('Reminder worker started');
      
      worker.on('failed', (job, err) => {
        console.error(`Job ${job.id} failed:`, err);
      });
      
      worker.on('completed', (job) => {
        //console.log( Job ${job.id} completed successfully);
        console.log(`Job ${job.id} completed successfully`);
      });
      
      worker.on('error', (err) => {
        console.error(' Reminder worker error:', err);
      });
    } catch (workerError) {
      console.error(' Failed to start reminder worker:', workerError);
    }
    // ========================  END OF ADDED CODE
    //
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
    console.error('Server startup aborted due to database sync failure');
    process.exit(1);
  });