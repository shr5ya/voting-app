"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middleware/auth");
const election_1 = require("../../../types/election");
const electionService_1 = require("../../../services/electionService");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateUser, auth_1.authorizeAdmin);
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const elections = [
            {
                id: '1',
                title: 'Board Election 2025',
                description: 'Election for new board members',
                startDate: new Date('2025-01-15'),
                endDate: new Date('2025-01-20'),
                status: election_1.ElectionStatus.UPCOMING,
                createdBy: req.user?.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPublic: true,
                resultsPublished: false,
                voterCount: 120,
                totalVotes: 0
            }
        ];
        res.json({
            data: elections,
            pagination: {
                total: 1,
                page,
                limit,
                pages: Math.ceil(1 / limit)
            }
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
router.get('/:id', async (req, res) => {
    try {
        const electionId = req.params.id;
        const election = {
            id: electionId,
            title: 'Board Election 2025',
            description: 'Election for new board members',
            startDate: new Date('2025-01-15'),
            endDate: new Date('2025-01-20'),
            status: election_1.ElectionStatus.UPCOMING,
            createdBy: req.user?.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            isPublic: true,
            resultsPublished: false,
            voterCount: 120,
            totalVotes: 0,
            candidates: [
                {
                    id: '1',
                    name: 'John Doe',
                    description: 'Experienced board member',
                    position: 'Chairman',
                    voteCount: 0
                }
            ]
        };
        res.json(election);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/', async (req, res) => {
    try {
        const electionData = req.body;
        const startDate = new Date(electionData.startDate);
        const endDate = new Date(electionData.endDate);
        if (endDate <= startDate) {
            return res.status(400).json({
                message: 'End date must be after start date'
            });
        }
        const newElection = {
            id: Math.random().toString(36).substring(2, 9),
            ...electionData,
            status: election_1.ElectionStatus.DRAFT,
            createdBy: req.user?.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            voterCount: 0,
            totalVotes: 0
        };
        (0, electionService_1.addElection)(newElection);
        res.status(201).json(newElection);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
router.put('/:id', async (req, res) => {
    try {
        const electionId = req.params.id;
        const updateData = req.body;
        const updatedElection = {
            id: electionId,
            title: updateData.title || 'Board Election 2025',
            description: updateData.description || 'Election for new board members',
            startDate: updateData.startDate || new Date('2025-01-15'),
            endDate: updateData.endDate || new Date('2025-01-20'),
            status: updateData.status || election_1.ElectionStatus.UPCOMING,
            createdBy: req.user?.id,
            updatedBy: req.user?.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            isPublic: updateData.isPublic !== undefined ? updateData.isPublic : true,
            resultsPublished: updateData.resultsPublished !== undefined ? updateData.resultsPublished : false,
            voterCount: 120,
            totalVotes: 0
        };
        res.json(updatedElection);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const electionId = req.params.id;
        res.json({ message: `Election ${electionId} deleted successfully` });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/:id/publish', async (req, res) => {
    try {
        const electionId = req.params.id;
        res.json({
            message: `Election ${electionId} results published successfully`,
            resultsPublished: true
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/:id/status', async (req, res) => {
    try {
        const electionId = req.params.id;
        const { status } = req.body;
        if (!Object.values(election_1.ElectionStatus).includes(status)) {
            return res.status(400).json({ message: 'Invalid election status' });
        }
        res.json({
            message: `Election ${electionId} status updated to ${status}`,
            status
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=elections.js.map