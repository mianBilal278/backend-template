// server.js
const express = require('express');
const connectDB = require('./src/config/db');
const dotenv = require('dotenv');
const authRoutes = require('./src/routes/auth');
const cors = require('cors');
const socket = require('socket.io');
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware for JSON parsing
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = 3000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`),
);
const io = socket(server);
io.on('connection', function (socket) {
  console.log('Made socket connection', socket?.handshake?.query?.id);
  socket.emit('hello', 'world');
  socket.on('hello', arg => {
    console.log(arg); // 'world'
  });
});
