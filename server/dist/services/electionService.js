"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteElection = exports.updateElection = exports.addElection = exports.getElection = exports.getElections = void 0;
const elections = [];
const getElections = () => {
    return elections;
};
exports.getElections = getElections;
const getElection = (id) => {
    return elections.find(election => election.id === id);
};
exports.getElection = getElection;
const addElection = (election) => {
    elections.push(election);
    return election;
};
exports.addElection = addElection;
const updateElection = (id, updates) => {
    const index = elections.findIndex(election => election.id === id);
    if (index === -1)
        return null;
    elections[index] = { ...elections[index], ...updates };
    return elections[index];
};
exports.updateElection = updateElection;
const deleteElection = (id) => {
    const index = elections.findIndex(election => election.id === id);
    if (index === -1)
        return false;
    elections.splice(index, 1);
    return true;
};
exports.deleteElection = deleteElection;
//# sourceMappingURL=electionService.js.map