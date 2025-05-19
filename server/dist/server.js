"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./api/routes"));
const notification_1 = __importDefault(require("./services/notification"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5002;
app.use((0, helmet_1.default)({
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
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
if (process.env.NODE_ENV === 'production') {
    const rateLimit = require('express-rate-limit');
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many requests from this IP, please try again later.'
    }));
    app.use('/api/v1/auth', rateLimit({
        windowMs: 60 * 60 * 1000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many authentication attempts from this IP, please try again later.'
    }));
}
app.use('/api', routes_1.default);
app.get('/', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
const server = (0, http_1.createServer)(app);
notification_1.default.initializeNotificationService(server);
server.listen(PORT, () => {
    console.log(`✨ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`🔗 API available at http://localhost:${PORT}/api/v1`);
    console.log(`🌐 API Tester available at http://localhost:${PORT}/`);
});
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    if (process.env.NODE_ENV === 'production') {
        console.log('Shutting down due to uncaught exception');
        process.exit(1);
    }
});
exports.default = server;
//# sourceMappingURL=server.js.map