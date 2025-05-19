"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const voters = [
    {
        id: "voter-1",
        name: "John Smith",
        email: "john@example.com",
        hasVoted: false
    },
    {
        id: "voter-2",
        name: "Jane Doe",
        email: "jane@example.com",
        hasVoted: true,
        electionId: "election-1"
    }
];
router.get('/', (_req, res) => {
    return res.json(voters);
});
router.get('/:id', (req, res) => {
    const voter = voters.find(v => v.id === req.params.id);
    if (!voter) {
        return res.status(404).json({ message: 'Voter not found' });
    }
    return res.json(voter);
});
router.post('/', (req, res) => {
    try {
        console.log('POST /admin/voters request body:', req.body);
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                message: 'Name and email are required',
                received: { name, email },
                body: req.body
            });
        }
        const existingVoter = voters.find(v => v.email === email);
        if (existingVoter) {
            return res.json(existingVoter);
        }
        const newVoter = {
            id: `voter-${Math.random().toString(36).substring(2, 9)}`,
            name,
            email,
            hasVoted: false
        };
        voters.push(newVoter);
        return res.status(201).json(newVoter);
    }
    catch (error) {
        console.error('Error in POST /admin/voters:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
});
router.put('/:id', (req, res) => {
    const { name, email, hasVoted, electionId } = req.body;
    const voterIndex = voters.findIndex(v => v.id === req.params.id);
    if (voterIndex === -1) {
        return res.status(404).json({ message: 'Voter not found' });
    }
    voters[voterIndex] = {
        ...voters[voterIndex],
        name: name || voters[voterIndex].name,
        email: email || voters[voterIndex].email,
        hasVoted: hasVoted !== undefined ? hasVoted : voters[voterIndex].hasVoted,
        electionId: electionId || voters[voterIndex].electionId
    };
    return res.json(voters[voterIndex]);
});
router.delete('/:id', (req, res) => {
    const voterIndex = voters.findIndex(v => v.id === req.params.id);
    if (voterIndex === -1) {
        return res.status(404).json({ message: 'Voter not found' });
    }
    voters.splice(voterIndex, 1);
    return res.json({ message: 'Voter deleted successfully' });
});
exports.default = router;
//# sourceMappingURL=voters.js.map