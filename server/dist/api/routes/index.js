"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const elections_1 = __importDefault(require("./admin/elections"));
const users_1 = __importDefault(require("./admin/users"));
const candidates_1 = __importDefault(require("./admin/candidates"));
const stats_1 = __importDefault(require("./admin/stats"));
const config_1 = __importDefault(require("./admin/config"));
const voters_1 = __importDefault(require("./admin/voters"));
const elections_2 = __importDefault(require("./voter/elections"));
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
const API_VERSION = 'v1';
router.use(`/${API_VERSION}/auth`, auth_1.default);
router.use(`/${API_VERSION}/admin/elections`, elections_1.default);
router.use(`/${API_VERSION}/admin/users`, users_1.default);
router.use(`/${API_VERSION}/admin/candidates`, candidates_1.default);
router.use(`/${API_VERSION}/admin/stats`, stats_1.default);
router.use(`/${API_VERSION}/admin/config`, config_1.default);
router.use(`/${API_VERSION}/admin/voters`, voters_1.default);
router.use(`/${API_VERSION}/voter/elections`, elections_2.default);
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
router.get(`/${API_VERSION}/healthcheck`, (_req, res) => {
    res.status(200).json({
        status: 'ok',
        version: process.env.npm_package_version || '1.0.0',
        timestamp: new Date().toISOString()
    });
});
router.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`,
        status: 404
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map