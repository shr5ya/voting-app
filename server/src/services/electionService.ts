import fs from 'fs';
import path from 'path';

// File path for persistent storage
const dataDir = path.join(__dirname, '../../../data');
const electionsFilePath = path.join(dataDir, 'elections.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-memory store for elections
let elections: any[] = [];

// Load elections from file if it exists
try {
  if (fs.existsSync(electionsFilePath)) {
    const data = fs.readFileSync(electionsFilePath, 'utf8');
    const parsedElections = JSON.parse(data);
    
    // Convert string dates back to Date objects
    elections = parsedElections.map((election: any) => ({
      ...election,
      startDate: new Date(election.startDate),
      endDate: new Date(election.endDate),
      createdAt: new Date(election.createdAt),
      updatedAt: new Date(election.updatedAt)
    }));
    
    console.log(`Loaded ${elections.length} elections from storage`);
  } else {
    // Create initial empty file
    saveElections();
    console.log('Created initial elections file');
  }
} catch (error) {
  console.error('Error loading elections from file:', error);
  // Continue with empty elections array
}

// Function to save elections to file
function saveElections() {
  try {
    fs.writeFileSync(electionsFilePath, JSON.stringify(elections, null, 2));
  } catch (error) {
    console.error('Error saving elections to file:', error);
  }
}

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
  saveElections(); // Save to file after adding
  return election;
};

/**
 * Update an existing election
 */
export const updateElection = (id: string, updates: any) => {
  const index = elections.findIndex(election => election.id === id);
  if (index === -1) return null;
  
  elections[index] = { ...elections[index], ...updates };
  saveElections(); // Save to file after updating
  return elections[index];
};

/**
 * Delete an election
 */
export const deleteElection = (id: string) => {
  const index = elections.findIndex(election => election.id === id);
  if (index === -1) return false;
  
  elections.splice(index, 1);
  saveElections(); // Save to file after deleting
  return true;
};

/**
 * Clear all elections
 */
export const clearElections = () => {
  elections.length = 0;
  saveElections(); // Save to file after clearing
  return true;
}; 