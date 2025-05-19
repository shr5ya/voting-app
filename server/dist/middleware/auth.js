"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVoterEligibility = exports.authorizeAdmin = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../types/user");
const JWT_SECRET = process.env.JWT_SECRET || 'electra-secret-key';
const DISABLE_AUTH_FOR_DEV = true;
const authenticateUser = (req, res, next) => {
    if (DISABLE_AUTH_FOR_DEV) {
        console.log('⚠️ Authentication disabled for development');
        req.user = {
            id: 'admin-user-id',
            email: 'admin@example.com',
            role: user_1.UserRole.ADMIN
        };
        next();
        return;
    }
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
        return;
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateUser = authenticateUser;
const authorizeAdmin = (req, res, next) => {
    if (DISABLE_AUTH_FOR_DEV) {
        next();
        return;
    }
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== user_1.UserRole.ADMIN) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
    return;
};
exports.authorizeAdmin = authorizeAdmin;
const checkVoterEligibility = (req, res, next) => {
    if (DISABLE_AUTH_FOR_DEV) {
        next();
        return;
    }
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    if (req.user.role !== user_1.UserRole.VOTER) {
        return res.status(403).json({ message: 'Voter access required' });
    }
    next();
    return;
};
exports.checkVoterEligibility = checkVoterEligibility;
//# sourceMappingURL=auth.js.map