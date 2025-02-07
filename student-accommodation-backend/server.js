const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Routes
const studentRoutes = require('./routes/studentRoutes');
const roomRoutes = require('./routes/roomRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const analyticsRoutes = require('./routes/analytics');
const messageRoutes = require('./routes/messageRoutes');
const announcementRoutes = require('./routes/announcementRoutes');

// Middleware
app.use(cors());
app.use(express.json());

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

// Mount other routes
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/maintenance', maintenanceRoutes);
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\nError:', err);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// Handle 404 routes - this should be last
app.use((req, res) => {
  console.log('\n404 Not Found:');
  console.log('  Method:', req.method);
  console.log('  URL:', req.url);
  console.log('  Path:', req.path);
  console.log('  Stack trace:', new Error().stack);
  res.status(404).json({ 
    error: `Cannot ${req.method} ${req.url}`,
    availableRoutes: [
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/me',
      '/api/students',
      '/api/rooms',
      '/api/applications'
    ]
  });
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