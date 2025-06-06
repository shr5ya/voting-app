import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import path from 'path';
import apiRoutes from './api/routes';
import notificationService from './services/notification';
import connectDB from './config/database';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5002;

// Connect to MongoDB
connectDB()
  .then(() => console.log('Database connection established'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "localhost:5002", "localhost:8080", "localhost:3000"],
    }
  }
}));

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Log all requests for debugging
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Utility middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting for production
if (process.env.NODE_ENV === 'production') {
  const rateLimit = require('express-rate-limit');
  
  // Apply rate limiting to all requests
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per window
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      message: 'Too many requests from this IP, please try again later.'
    })
  );

  // Additional rate limiting for auth endpoints
  app.use('/api/v1/auth', 
    rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10, // 10 requests per hour
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many authentication attempts from this IP, please try again later.'
    })
  );
}

// API routes
app.use('/api', apiRoutes);

// Serve the API tester page at the root URL
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io for real-time notifications
notificationService.initializeNotificationService(server);

// Start server
server.listen(PORT, () => {
  console.log(`✨ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🔗 API available at http://localhost:${PORT}/api/v1`);
  console.log(`🌐 API Tester available at http://localhost:${PORT}/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  // In production, you might want to gracefully shutdown
  if (process.env.NODE_ENV === 'production') {
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
  }
});

export default server; 