// In-memory store for elections
const elections: any[] = [];

/**
 * Get all elections
 */
export const getElections = () => {
  return [...elections];
};

/**
 * Get a specific election by ID
 */
export const getElection = (id: string) => {
  return elections.find(election => election.id === id);
};

/**
 * Add a new election
 */
export const addElection = (election: any) => {
  elections.push(election);
  return election;
};

/**
 * Update an existing election
 */
export const updateElection = (id: string, updates: any) => {
  const index = elections.findIndex(election => election.id === id);
  if (index === -1) return null;
  
  elections[index] = { ...elections[index], ...updates };
  return elections[index];
};

/**
 * Delete an election
 */
export const deleteElection = (id: string) => {
  const index = elections.findIndex(election => election.id === id);
  if (index === -1) return false;
  
  elections.splice(index, 1);
  return true;
};

/**
 * Clear all elections
 */
export const clearElections = () => {
  elections.length = 0;
  return true;
}; 