"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../../middleware/auth");
const election_1 = require("../../../types/election");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateUser, auth_1.authorizeAdmin);
router.get('/dashboard', async (_req, res) => {
    try {
        const stats = {
            elections: {
                total: 24,
                active: 5,
                upcoming: 8,
                completed: 11,
                draft: 0
            },
            users: {
                total: 523,
                admins: 5,
                voters: 518,
                activeToday: 42
            },
            votes: {
                total: 1845,
                lastWeek: 124,
                today: 28
            },
            participation: {
                average: 78.4,
                highest: {
                    rate: 94.2,
                    electionId: '12345',
                    electionTitle: 'Board of Directors 2024'
                },
                lowest: {
                    rate: 52.6,
                    electionId: '54321',
                    electionTitle: 'Budget Committee Members'
                }
            },
            recentActivity: [
                {
                    type: 'election_created',
                    timestamp: new Date(Date.now() - 3600000),
                    data: {
                        electionId: '1',
                        title: 'Community Council Election'
                    }
                },
                {
                    type: 'election_completed',
                    timestamp: new Date(Date.now() - 86400000),
                    data: {
                        electionId: '2',
                        title: 'School Board Members'
                    }
                },
                {
                    type: 'user_registered',
                    timestamp: new Date(Date.now() - 129600000),
                    data: {
                        userId: '3',
                        name: 'John Smith'
                    }
                }
            ]
        };
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/elections', async (_req, res) => {
    try {
        const stats = {
            totalElections: 24,
            electionsByStatus: {
                [election_1.ElectionStatus.DRAFT]: 0,
                [election_1.ElectionStatus.UPCOMING]: 8,
                [election_1.ElectionStatus.ACTIVE]: 5,
                [election_1.ElectionStatus.COMPLETED]: 11,
                [election_1.ElectionStatus.CANCELLED]: 0
            },
            electionsByMonth: [
                { month: 'Jan', count: 2 },
                { month: 'Feb', count: 3 },
                { month: 'Mar', count: 1 },
                { month: 'Apr', count: 4 },
                { month: 'May', count: 2 },
                { month: 'Jun', count: 0 },
                { month: 'Jul', count: 3 },
                { month: 'Aug', count: 1 },
                { month: 'Sep', count: 2 },
                { month: 'Oct', count: 2 },
                { month: 'Nov', count: 3 },
                { month: 'Dec', count: 1 }
            ],
            averageDuration: 5.2,
            averageParticipationRate: 78.4,
            electionWithMostVotes: {
                id: '12345',
                title: 'Board of Directors 2024',
                votes: 342
            },
            mostRecentElection: {
                id: '1',
                title: 'Community Council Election',
                status: election_1.ElectionStatus.ACTIVE,
                startDate: new Date(Date.now() - 86400000),
                endDate: new Date(Date.now() + 4 * 86400000)
            }
        };
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/voters', async (_req, res) => {
    try {
        const stats = {
            totalVoters: 518,
            activeVoters: 483,
            averageVotesPerVoter: 3.56,
            participationByElection: [
                {
                    electionId: '1',
                    title: 'Community Council Election',
                    eligibleVoters: 215,
                    votes: 198,
                    participationRate: 92.1
                },
                {
                    electionId: '2',
                    title: 'School Board Members',
                    eligibleVoters: 342,
                    votes: 301,
                    participationRate: 88.0
                },
                {
                    electionId: '3',
                    title: 'Budget Committee Members',
                    eligibleVoters: 120,
                    votes: 63,
                    participationRate: 52.5
                }
            ],
            voterRegistrationByMonth: [
                { month: 'Jan', count: 12 },
                { month: 'Feb', count: 18 },
                { month: 'Mar', count: 22 },
                { month: 'Apr', count: 15 },
                { month: 'May', count: 25 },
                { month: 'Jun', count: 30 },
                { month: 'Jul', count: 28 },
                { month: 'Aug', count: 45 },
                { month: 'Sep', count: 50 },
                { month: 'Oct', count: 48 },
                { month: 'Nov', count: 38 },
                { month: 'Dec', count: 20 }
            ],
            votingTimeDistribution: [
                { hour: '00:00-04:00', percentage: 5 },
                { hour: '04:00-08:00', percentage: 10 },
                { hour: '08:00-12:00', percentage: 25 },
                { hour: '12:00-16:00', percentage: 30 },
                { hour: '16:00-20:00', percentage: 20 },
                { hour: '20:00-24:00', percentage: 10 }
            ]
        };
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/elections/:id', async (req, res) => {
    try {
        const electionId = req.params.id;
        const stats = {
            election: {
                id: electionId,
                title: 'Community Council Election',
                status: election_1.ElectionStatus.ACTIVE,
                startDate: new Date(Date.now() - 86400000),
                endDate: new Date(Date.now() + 4 * 86400000),
                duration: 5
            },
            participation: {
                eligibleVoters: 215,
                votes: 128,
                participationRate: 59.5,
                remainingVoters: 87
            },
            candidates: [
                {
                    id: '1',
                    name: 'John Doe',
                    votes: 42,
                    percentage: 32.8
                },
                {
                    id: '2',
                    name: 'Jane Smith',
                    votes: 38,
                    percentage: 29.7
                },
                {
                    id: '3',
                    name: 'Bob Johnson',
                    votes: 48,
                    percentage: 37.5
                }
            ],
            votingActivity: [
                { day: 'Day 1', votes: 102 },
                { day: 'Day 2', votes: 26 }
            ],
            hourlyDistribution: [
                { hour: '00:00-02:00', votes: 5 },
                { hour: '02:00-04:00', votes: 3 },
                { hour: '04:00-06:00', votes: 2 },
                { hour: '06:00-08:00', votes: 7 },
                { hour: '08:00-10:00', votes: 12 },
                { hour: '10:00-12:00', votes: 18 },
                { hour: '12:00-14:00', votes: 22 },
                { hour: '14:00-16:00', votes: 19 },
                { hour: '16:00-18:00', votes: 15 },
                { hour: '18:00-20:00', votes: 10 },
                { hour: '20:00-22:00', votes: 8 },
                { hour: '22:00-24:00', votes: 7 }
            ]
        };
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/export', async (req, res) => {
    try {
        const format = req.query.format || 'json';
        const dataType = req.query.type || 'elections';
        if (format === 'json') {
            return res.json({
                exported: true,
                dataType,
                timestamp: new Date(),
                data: {
                    elections: [
                        {
                            id: '1',
                            title: 'Community Council Election',
                            status: election_1.ElectionStatus.ACTIVE,
                            votes: 128
                        },
                        {
                            id: '2',
                            title: 'School Board Members',
                            status: election_1.ElectionStatus.COMPLETED,
                            votes: 301
                        }
                    ]
                }
            });
        }
        else if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=electra-stats-${dataType}-${new Date().toISOString().slice(0, 10)}.csv`);
            return res.send('id,title,status,votes\n1,Community Council Election,active,128\n2,School Board Members,completed,301');
        }
        else {
            return res.status(400).json({ message: 'Unsupported format' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
        return;
    }
});
exports.default = router;
//# sourceMappingURL=stats.js.map