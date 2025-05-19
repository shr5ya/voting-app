"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateUser, auth_1.authorizeAdmin);
router.get('/:electionId/candidates', async (req, res) => {
    try {
        const electionId = req.params.electionId;
        const candidates = [
            {
                id: '1',
                electionId,
                name: 'John Doe',
                description: 'Experienced board member',
                position: 'Chairman',
                imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
                voteCount: 12,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2',
                electionId,
                name: 'Jane Smith',
                description: 'Financial expert with 10 years experience',
                position: 'Treasurer',
                imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
                voteCount: 8,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        res.json(candidates);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/:electionId/candidates/:id', async (req, res) => {
    try {
        const electionId = req.params.electionId;
        const candidateId = req.params.id;
        const candidate = {
            id: candidateId,
            electionId,
            name: 'John Doe',
            description: 'Experienced board member',
            position: 'Chairman',
            imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
            voteCount: 12,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        res.json(candidate);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/:electionId/candidates', async (req, res) => {
    try {
        const electionId = req.params.electionId;
        const { name, description, position, imageUrl } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const newCandidate = {
            id: Math.random().toString(36).substring(2, 9),
            electionId,
            name,
            description,
            position,
            imageUrl,
            voteCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        res.status(201).json(newCandidate);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
router.put('/:electionId/candidates/:id', async (req, res) => {
    try {
        const electionId = req.params.electionId;
        const candidateId = req.params.id;
        const { name, description, position, imageUrl } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const updatedCandidate = {
            id: candidateId,
            electionId,
            name,
            description,
            position,
            imageUrl,
            voteCount: 12,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        res.json(updatedCandidate);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
router.delete('/:electionId/candidates/:id', async (req, res) => {
    try {
        const electionId = req.params.electionId;
        const candidateId = req.params.id;
        res.json({
            message: `Candidate ${candidateId} deleted successfully from election ${electionId}`
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/:electionId/candidates/reorder', async (req, res) => {
    try {
        const electionId = req.params.electionId;
        const { candidateOrder } = req.body;
        if (!Array.isArray(candidateOrder)) {
            return res.status(400).json({ message: 'candidateOrder must be an array of candidate IDs' });
        }
        res.json({
            message: `Candidates for election ${electionId} reordered successfully`,
            order: candidateOrder
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
router.post('/:electionId/candidates/bulk', async (req, res) => {
    try {
        const electionId = req.params.electionId;
        const { candidates } = req.body;
        if (!Array.isArray(candidates)) {
            return res.status(400).json({ message: 'candidates must be an array' });
        }
        for (const candidate of candidates) {
            if (!candidate.name) {
                return res.status(400).json({ message: 'Each candidate must have a name' });
            }
        }
        const createdCandidates = candidates.map(candidate => ({
            id: Math.random().toString(36).substring(2, 9),
            electionId,
            name: candidate.name,
            description: candidate.description || '',
            position: candidate.position || '',
            imageUrl: candidate.imageUrl || '',
            voteCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        res.status(201).json(createdCandidates);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=candidates.js.map