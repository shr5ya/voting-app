"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middleware/auth");
const user_1 = require("../../../types/user");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateUser, auth_1.authorizeAdmin);
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const role = req.query.role;
        const searchTerm = req.query.search;
        const isActive = req.query.isActive === 'true';
        const users = [
            {
                id: '1',
                name: 'Admin User',
                email: 'admin@example.com',
                role: user_1.UserRole.ADMIN,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLogin: new Date(),
                isActive: true,
            },
            {
                id: '2',
                name: 'Voter One',
                email: 'voter1@example.com',
                role: user_1.UserRole.VOTER,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLogin: null,
                isActive: true,
                voterId: 'V001',
            }
        ];
        let filteredUsers = [...users];
        if (role) {
            filteredUsers = filteredUsers.filter(user => user.role === role);
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredUsers = filteredUsers.filter(user => user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term));
        }
        if (req.query.isActive !== undefined) {
            filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
        }
        res.json({
            data: filteredUsers,
            pagination: {
                total: filteredUsers.length,
                page,
                limit,
                pages: Math.ceil(filteredUsers.length / limit)
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = {
            id: userId,
            name: 'Voter One',
            email: 'voter1@example.com',
            role: user_1.UserRole.VOTER,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: null,
            isActive: true,
            voterId: 'V001',
            elections: [
                {
                    id: '1',
                    title: 'Board Election 2025',
                    hasVoted: false
                }
            ]
        };
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/', async (req, res) => {
    try {
        const { name, email, role, password } = req.body;
        if (!name || !email || !role || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (![user_1.UserRole.ADMIN, user_1.UserRole.VOTER].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }
        const newUser = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            email,
            role,
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            registrationVerified: false,
            voterId: role === user_1.UserRole.VOTER ? `V${Math.floor(1000 + Math.random() * 9000)}` : undefined
        };
        res.status(201).json(newUser);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
router.put('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email, isActive, role } = req.body;
        const updatedUser = {
            id: userId,
            name: name || 'Voter One',
            email: email || 'voter1@example.com',
            role: role || user_1.UserRole.VOTER,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLogin: null,
            isActive: isActive !== undefined ? isActive : true,
            voterId: role === user_1.UserRole.VOTER ? 'V001' : undefined
        };
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        res.json({ message: `User ${userId} deleted successfully` });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.patch('/:id/activate', async (req, res) => {
    try {
        const userId = req.params.id;
        res.json({
            message: `User ${userId} activated successfully`,
            isActive: true
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.patch('/:id/deactivate', async (req, res) => {
    try {
        const userId = req.params.id;
        res.json({
            message: `User ${userId} deactivated successfully`,
            isActive: false
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/:id/reset-password', async (req, res) => {
    try {
        const userId = req.params.id;
        res.json({
            message: `Password reset initiated for user ${userId}. An email has been sent to the user.`
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/stats/summary', async (_req, res) => {
    try {
        const stats = {
            totalUsers: 125,
            activeUsers: 110,
            adminUsers: 5,
            voterUsers: 120,
            usersRegisteredToday: 3,
            usersRegisteredThisWeek: 12,
            usersRegisteredThisMonth: 28,
            usersLoggedInToday: 45
        };
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map