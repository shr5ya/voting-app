import { Router } from 'express';
import adminElectionsRouter from './admin/elections';
import adminUsersRouter from './admin/users';
import adminCandidatesRouter from './admin/candidates';
import adminStatsRouter from './admin/stats';
import adminConfigRouter from './admin/config';
import voterElectionsRouter from './voter/elections';
import authRouter from './auth';

// Initialize the main router
const router = Router();

// API version
const API_VERSION = 'v1';

// Auth routes
router.use(`/${API_VERSION}/auth`, authRouter);

// Admin routes
router.use(`/${API_VERSION}/admin/elections`, adminElectionsRouter);
router.use(`/${API_VERSION}/admin/users`, adminUsersRouter);
router.use(`/${API_VERSION}/admin/candidates`, adminCandidatesRouter);
router.use(`/${API_VERSION}/admin/stats`, adminStatsRouter);
router.use(`/${API_VERSION}/admin/config`, adminConfigRouter);

// Voter routes
router.use(`/${API_VERSION}/voter/elections`, voterElectionsRouter);

// API Documentation route
router.get(`/${API_VERSION}`, (_req, res) => {
  res.status(200).json({
    message: 'Electra Voting API',
    version: process.env.npm_package_version || '1.0.0',
    documentation: '/api/v1/docs',
    endpoints: [
      { path: '/api/v1/auth', description: 'Authentication endpoints' },
      { path: '/api/v1/admin', description: 'Admin endpoints' },
      { path: '/api/v1/voter', description: 'Voter endpoints' },
      { path: '/api/v1/healthcheck', description: 'API health check' }
    ]
  });
});

// Public API routes
router.get(`/${API_VERSION}/healthcheck`, (_req, res) => {
  res.status(200).json({ 
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString() 
  });
});

// Handle 404 for API routes
router.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    status: 404
  });
});

export default router; 