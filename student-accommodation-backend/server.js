const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Load Swagger document
const swaggerDocument = require('./swagger.json');

// Routes
const studentRoutes = require('./routes/studentRoutes');
const roomRoutes = require('./routes/roomRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analytics');
const messageRoutes = require('./routes/messageRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

// CORS configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,      // Production frontend
    process.env.LOCAL_FRONTEND_URL, // Local development
    'http://localhost:3000',        // Backup local development
    'https://student-accommodation-backend.onrender.com' // Swagger UI access
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log('\nIncoming request:');
  console.log('  Method:', req.method);
  console.log('  URL:', req.url);
  console.log('  Path:', req.path);
  console.log('  Body:', req.body);
  console.log('  Headers:', req.headers);
  next();
});

// Connect to MongoDB with additional options
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  console.log('Database connection state:', mongoose.connection.readyState);
  // Log some connection details
  const db = mongoose.connection;
  console.log('Database name:', db.name);
  console.log('Host:', db.host);
  console.log('Port:', db.port);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: err.code,
    codeName: err.codeName
  });
  process.exit(1); // Exit if we can't connect to the database
});

// Debug middleware for auth routes
app.use('/api/auth', (req, res, next) => {
  console.log('\nAuth route hit:');
  console.log('  Method:', req.method);
  console.log('  URL:', req.url);
  console.log('  Path:', req.path);
  console.log('  Body:', req.body);
  next();
}, authRoutes);

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads/proofs');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files - place this BEFORE your routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/proofs', express.static(path.join(__dirname, 'uploads/proofs')));

// Add a route to test file access
app.get('/test-file/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads/proofs', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

// Add this middleware to log file requests
app.use('/uploads', (req, res, next) => {
  console.log('Static file request:', {
    url: req.url,
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl
  });
  next();
});

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    persistAuthorization: true
  },
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Student Accommodation API Documentation"
}));

// Mount other routes
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/announcements', announcementRoutes);

// Test route to verify base routing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Debug route to show all registered routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  
  // Log auth routes specifically
  console.log('\nAuth Routes:');
  authRoutes.stack.forEach(r => {
    if (r.route) {
      console.log('  Path:', r.route.path);
      console.log('  Methods:', Object.keys(r.route.methods));
      routes.push({
        path: '/api/auth' + r.route.path,
        methods: Object.keys(r.route.methods)
      });
    }
  });

  // Log all middleware stack
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });

  res.json({
    routes,
    authRoutesStack: authRoutes.stack.map(r => ({
      path: r.route?.path,
      methods: r.route ? Object.keys(r.route.methods) : []
    }))
  });
});

// Add this BEFORE your error handling middleware
app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Student Accommodation API",
    status: "Online",
    documentation: "Available endpoints:",
    availableRoutes: {
      auth: {
        register: "/api/auth/register [POST]",
        login: "/api/auth/login [POST]",
        profile: "/api/auth/me [GET]"
      },
      resources: {
        students: "/api/students [GET, POST]",
        rooms: "/api/rooms [GET, POST]",
        applications: "/api/applications [GET, POST]"
      }
    }
  });
});

// Modify your 404 handler to be more informative
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
    suggestion: "Visit the root path '/' for API documentation",
    availableRoutes: [
      "/api/auth/register",
      "/api/auth/login",
      "/api/auth/me",
      "/api/students",
      "/api/rooms",
      "/api/applications"
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\nError:', err);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\nServer running on http://localhost:${PORT}`);
  console.log('\nAvailable routes:');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/auth/me');
  console.log('  GET  /api/test');
  console.log('  GET  /api/debug/routes');
  
  // Log registered auth routes
  console.log('\nRegistered auth routes:');
  authRoutes.stack.forEach(r => {
    if (r.route) {
      console.log(`  ${Object.keys(r.route.methods)[0].toUpperCase()} /api/auth${r.route.path}`);
    }
  });
});