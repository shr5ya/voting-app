"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middleware/auth");
const election_1 = require("../../../types/election");
const electionService_1 = require("../../../services/electionService");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateUser);
router.get('/', async (_req, res) => {
    try {
        const dynamicElections = (0, electionService_1.getElections)();
        const mockElections = [
            {
                id: '1',
                title: 'Community Council Election',
                description: 'Election for new community council members',
                startDate: new Date(Date.now() - 86400000),
                endDate: new Date(Date.now() + 4 * 86400000),
                status: election_1.ElectionStatus.ACTIVE,
                hasVoted: false,
                candidates: [
                    {
                        id: '1',
                        name: 'John Doe',
                        description: 'Community activist',
                        position: 'President'
                    },
                    {
                        id: '2',
                        name: 'Jane Smith',
                        description: 'Local business owner',
                        position: 'Secretary'
                    }
                ]
            },
            {
                id: '2',
                title: 'School Board Members',
                description: 'Election for new school board members',
                startDate: new Date(Date.now() + 10 * 86400000),
                endDate: new Date(Date.now() + 17 * 86400000),
                status: election_1.ElectionStatus.UPCOMING,
                hasVoted: false,
                candidates: []
            },
            {
                id: '3',
                title: 'Budget Committee',
                description: 'Election for budget committee members',
                startDate: new Date(Date.now() - 20 * 86400000),
                endDate: new Date(Date.now() - 13 * 86400000),
                status: election_1.ElectionStatus.COMPLETED,
                hasVoted: true,
                resultsAvailable: true
            }
        ];
        const allElections = [...mockElections, ...dynamicElections];
        res.json(allElections);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const electionId = req.params.id;
        const election = {
            id: electionId,
            title: 'Community Council Election',
            description: 'Election for new community council members',
            startDate: new Date(Date.now() - 86400000),
            endDate: new Date(Date.now() + 4 * 86400000),
            status: election_1.ElectionStatus.ACTIVE,
            hasVoted: false,
            candidates: [
                {
                    id: '1',
                    name: 'John Doe',
                    description: 'Community activist with 10 years of experience',
                    position: 'President',
                    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
                },
                {
                    id: '2',
                    name: 'Jane Smith',
                    description: 'Local business owner focused on community development',
                    position: 'Secretary',
                    imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
                },
                {
                    id: '3',
                    name: 'Bob Johnson',
                    description: 'Retired teacher passionate about education',
                    position: 'Treasurer',
                    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
                }
            ]
        };
        res.json(election);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.post('/:id/vote', auth_1.checkVoterEligibility, async (req, res) => {
    try {
        const electionId = req.params.id;
        const { candidateId } = req.body;
        if (!candidateId) {
            return res.status(400).json({ message: 'Candidate ID is required' });
        }
        const hasVoted = false;
        if (hasVoted) {
            return res.status(400).json({ message: 'You have already voted in this election' });
        }
        res.status(201).json({
            message: 'Vote cast successfully',
            vote: {
                electionId,
                candidateId,
                timestamp: new Date()
            }
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
router.get('/:id/receipt', async (req, res) => {
    try {
        const electionId = req.params.id;
        const hasVoted = true;
        if (!hasVoted) {
            return res.status(400).json({ message: 'You have not voted in this election' });
        }
        const receipt = {
            electionId,
            electionTitle: 'Community Council Election',
            timestamp: new Date(Date.now() - 3600000),
            receiptId: `VOTE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            confirmed: true
        };
        res.json(receipt);
        return;
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
router.get('/:id/results', async (req, res) => {
    try {
        const electionId = req.params.id;
        const results = {
            electionId,
            electionTitle: 'Community Council Election',
            status: election_1.ElectionStatus.COMPLETED,
            totalVotes: 128,
            participationRate: 78.5,
            candidates: [
                {
                    id: '1',
                    name: 'John Doe',
                    position: 'President',
                    votes: 42,
                    percentage: 32.8
                },
                {
                    id: '2',
                    name: 'Jane Smith',
                    position: 'Secretary',
                    votes: 38,
                    percentage: 29.7
                },
                {
                    id: '3',
                    name: 'Bob Johnson',
                    position: 'Treasurer',
                    votes: 48,
                    percentage: 37.5
                }
            ],
            winner: {
                id: '3',
                name: 'Bob Johnson',
                position: 'Treasurer',
                votes: 48,
                percentage: 37.5
            }
        };
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/history/votes', async (_req, res) => {
    try {
        const history = [
            {
                electionId: '3',
                electionTitle: 'Budget Committee',
                votedAt: new Date(Date.now() - 15 * 86400000),
                status: election_1.ElectionStatus.COMPLETED,
                receiptId: 'VOTE-ABC123XYZ',
                resultsAvailable: true
            },
            {
                electionId: '4',
                electionTitle: 'Library Board',
                votedAt: new Date(Date.now() - 45 * 86400000),
                status: election_1.ElectionStatus.COMPLETED,
                receiptId: 'VOTE-DEF456UVW',
                resultsAvailable: true
            }
        ];
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/status/eligible', async (_req, res) => {
    try {
        const stats = {
            activeElections: 1,
            upcomingElections: 1,
            pendingVotes: 1,
            completedElections: 2,
            totalVotesCast: 2
        };
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = router;
//# sourceMappingURL=elections.js.map