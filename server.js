require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const pool = require('./config/db');
const kioskRoutes = require('./routes/kioskRoutes');
const frameTemplateRoutes = require('./routes/frameTemplateRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const filterRoutes = require('./routes/filterRoutes');
const gestureRoutes = require('./routes/gestureRoutes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// ==========================================
// Middleware Configuration
// ==========================================

// JSON Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use(morgan('dev'));

// CORS Configuration (Allow specific origins: Admin & Kiosk)
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) or from allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Static File Serving for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// Routes Registration
// ==========================================
app.use('/api/kiosks', kioskRoutes);
app.use('/api/frame_templates', frameTemplateRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/filters', filterRoutes);
app.use('/api/gestures', gestureRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Uni-Smiles Photobooth Backend API Server is running.',
    version: '1.0.0'
  });
});

// ==========================================
// Error Handling Middlewares
// ==========================================
app.use(notFoundHandler);
app.use(errorHandler);

// ==========================================
// Server Initialization & Database Verification
// ==========================================
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Test database connection on startup
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully via connection pool.');
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
      console.log(`🔗 Admin CORS Allowed: http://localhost:3000`);
      console.log(`🔗 Kiosk CORS Allowed: http://localhost:3001`);
      console.log(`📡 API endpoint available at: http://localhost:${PORT}/api/kiosks`);
      console.log(`📡 API endpoint available at: http://localhost:${PORT}/api/frame_templates`);
      console.log(`📡 API endpoint available at: http://localhost:${PORT}/api/sessions`);
      console.log(`📡 API endpoint available at: http://localhost:${PORT}/api/auth`);
      console.log(`📡 API endpoint available at: http://localhost:${PORT}/api/photos`);
      console.log(`📡 API endpoint available at: http://localhost:${PORT}/api/filters`);
      console.log(`📡 API endpoint available at: http://localhost:${PORT}/api/gestures`);
      console.log(`📁 Static files served at: http://localhost:${PORT}/uploads`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error.message);
    console.log('⚠️ Server starts anyway, but database queries will fail until MySQL is accessible.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT} without active DB connection.`);
    });
  }
};

startServer();
