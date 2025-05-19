"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../../types/user");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || 'electra-secret-key';
const TOKEN_EXPIRY = '24h';
const registeredUsers = [
    {
        id: 'admin-user-id',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: user_1.UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
    },
    {
        id: 'voter-user-id',
        name: 'John Voter',
        email: 'voter@example.com',
        password: 'voter123',
        role: user_1.UserRole.VOTER,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        voterId: 'V12345'
    }
];
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = registeredUsers.find(u => u.email === email && u.password === password);
        if (user) {
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
            const { password: _, ...userResponse } = user;
            return res.json({
                token,
                expiresIn: 24 * 60 * 60,
                user: userResponse
            });
        }
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/register', (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        if (registeredUsers.some(user => user.email === email)) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const newUser = {
            id: `user-${Math.random().toString(36).substring(2, 9)}`,
            name,
            email,
            password,
            role: user_1.UserRole.VOTER,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            registrationVerified: false
        };
        registeredUsers.push(newUser);
        const { password: _, ...userResponse } = newUser;
        return res.status(201).json({
            message: 'User registered successfully',
            user: userResponse
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/voter/login', (req, res) => {
    try {
        const { voterId, accessCode } = req.body;
        if (!voterId || !accessCode) {
            return res.status(400).json({ message: 'Voter ID and access code are required' });
        }
        if (voterId === 'V12345' && accessCode === '123456') {
            const token = jsonwebtoken_1.default.sign({ id: 'voter-user-id', email: 'voter@example.com', role: user_1.UserRole.VOTER }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
            return res.json({
                token,
                expiresIn: 24 * 60 * 60,
                user: {
                    id: 'voter-user-id',
                    name: 'John Voter',
                    email: 'voter@example.com',
                    role: user_1.UserRole.VOTER,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true,
                    voterId: 'V12345'
                }
            });
        }
        return res.status(401).json({ message: 'Invalid voter credentials' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/verify/:token', (req, res) => {
    try {
        const { token: _token } = req.params;
        return res.json({
            message: 'Email verified successfully'
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/forgot-password', (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        return res.json({
            message: 'Password reset link sent to your email'
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/reset-password/:token', (req, res) => {
    try {
        const { token: _token } = req.params;
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ message: 'New password is required' });
        }
        return res.json({
            message: 'Password reset successful'
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/debug/users', (_req, res) => {
    const safeUsers = registeredUsers.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
    });
    return res.json({
        message: 'Registered users',
        users: safeUsers
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map