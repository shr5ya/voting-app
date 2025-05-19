"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateUser);
router.get('/', (req, res) => {
    try {
        const userId = req.user?.id;
        if (req.user?.role === 'admin') {
            return res.json({
                id: userId,
                name: 'Admin User',
                email: req.user.email,
                role: req.user.role,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLogin: new Date(),
                isActive: true
            });
        }
        else {
            return res.json({
                id: userId,
                name: 'John Voter',
                email: req.user?.email,
                role: req.user?.role,
                createdAt: new Date(),
                updatedAt: new Date(),
                lastLogin: new Date(),
                isActive: true,
                voterId: 'V12345',
                elections: {
                    eligible: 3,
                    voted: 1,
                    upcoming: 1
                }
            });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.put('/', (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name && !email) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        return res.json({
            id: req.user?.id,
            name: name || 'Updated User',
            email: email || req.user?.email,
            role: req.user?.role,
            updatedAt: new Date()
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.put('/password', (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }
        return res.json({
            message: 'Password updated successfully'
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/activity', (req, res) => {
    try {
        return res.json({
            activities: [
                {
                    id: '1',
                    type: 'login',
                    description: 'User logged in',
                    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    ipAddress: '192.168.1.1'
                },
                {
                    id: '2',
                    type: 'vote',
                    description: 'Voted in Community Council Election',
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    ipAddress: '192.168.1.1'
                },
                {
                    id: '3',
                    type: 'profile_update',
                    description: 'Updated profile information',
                    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    ipAddress: '192.168.1.2'
                }
            ]
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/notifications', (req, res) => {
    try {
        return res.json({
            notifications: [
                {
                    id: '1',
                    type: 'election_reminder',
                    message: 'Community Council Election is now active',
                    isRead: false,
                    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
                },
                {
                    id: '2',
                    type: 'vote_confirmation',
                    message: 'Your vote was recorded successfully',
                    isRead: true,
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                    id: '3',
                    type: 'new_election',
                    message: 'You are eligible to vote in School Board Members election',
                    isRead: true,
                    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                }
            ]
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.put('/notifications/:id/read', (req, res) => {
    try {
        const { id } = req.params;
        return res.json({
            message: 'Notification marked as read',
            notificationId: id
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = router;
//# sourceMappingURL=profile.js.map