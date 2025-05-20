import Election, { IElection } from '../models/Election';
import fs from 'fs';
import path from 'path';

// Path to the elections.json file
const ELECTIONS_FILE_PATH = path.join(__dirname, '../../../data/elections.json');

// Helper function to save elections to JSON file
const saveElectionsToFile = async (elections: IElection[]) => {
  try {
    // Convert to plain objects for JSON serialization
    const plainElections = elections.map(election => election.toObject ? election.toObject() : election);
    await fs.promises.writeFile(ELECTIONS_FILE_PATH, JSON.stringify(plainElections, null, 2));
    console.log('Elections saved to file successfully');
  } catch (error) {
    console.error('Error saving elections to file:', error);
  }
};

// Helper function to read elections from JSON file
const readElectionsFromFile = async (): Promise<any[]> => {
  try {
    if (!fs.existsSync(ELECTIONS_FILE_PATH)) {
      console.log('Elections file does not exist, creating empty file');
      await fs.promises.writeFile(ELECTIONS_FILE_PATH, JSON.stringify([], null, 2));
      return [];
    }
    
    const data = await fs.promises.readFile(ELECTIONS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading elections from file:', error);
    return [];
  }
};

/**
 * Get all elections
 */
export const getElections = async (): Promise<IElection[]> => {
  try {
    const dbElections = await Election.find();
    
    // Also save to file for backup
    await saveElectionsToFile(dbElections);
    
    return dbElections;
  } catch (error) {
    console.error('Error fetching elections from DB:', error);
    
    // Try to get from file as fallback
    console.log('Attempting to read elections from file as fallback');
    const fileElections = await readElectionsFromFile();
    return fileElections;
  }
};

/**
 * Get a specific election by ID
 */
export const getElection = async (id: string): Promise<IElection | null> => {
  try {
    const election = await Election.findById(id);
    
    if (!election) {
      // Try to find in file if not in DB
      const fileElections = await readElectionsFromFile();
      const fileElection = fileElections.find(e => e.id === id || e._id === id);
      return fileElection || null;
    }
    
    return election;
  } catch (error) {
    console.error(`Error fetching election with id ${id}:`, error);
    
    // Try to find in file as fallback
    const fileElections = await readElectionsFromFile();
    const fileElection = fileElections.find(e => e.id === id || e._id === id);
    return fileElection || null;
  }
};

/**
 * Add a new election
 */
export const addElection = async (election: any): Promise<IElection | null> => {
  try {
    // Add createdBy if not provided
    if (!election.createdBy) {
      election.createdBy = 'system';
    }
    
    const newElection = new Election(election);
    const savedElection = await newElection.save();
    
    // Update the file after adding to DB
    const allElections = await Election.find();
    await saveElectionsToFile(allElections);
    
    return savedElection;
  } catch (error) {
    console.error('Error adding election:', error);
    return null;
  }
};

/**
 * Update an existing election
 */
export const updateElection = async (id: string, updates: any): Promise<IElection | null> => {
  try {
    const updatedElection = await Election.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );
    
    // Update the file after updating in DB
    const allElections = await Election.find();
    await saveElectionsToFile(allElections);
    
    return updatedElection;
  } catch (error) {
    console.error(`Error updating election with id ${id}:`, error);
    return null;
  }
};

/**
 * Delete an election
 */
export const deleteElection = async (id: string): Promise<boolean> => {
  try {
    const result = await Election.findByIdAndDelete(id);
    
    // Update the file after deleting from DB
    const allElections = await Election.find();
    await saveElectionsToFile(allElections);
    
    return !!result;
  } catch (error) {
    console.error(`Error deleting election with id ${id}:`, error);
    return false;
  }
};

/**
 * Clear all elections
 */
export const clearElections = async (): Promise<boolean> => {
  try {
    await Election.deleteMany({});
    
    // Clear the file too
    await saveElectionsToFile([]);
    
    return true;
  } catch (error) {
    console.error('Error clearing elections:', error);
    return false;
  }
};

/**
 * Update election statuses based on current date
 */
export const updateElectionStatuses = async (): Promise<void> => {
  try {
    const now = new Date();
    
    // Update upcoming elections to active
    await Election.updateMany(
      { status: 'upcoming', startDate: { $lte: now } },
      { $set: { status: 'active' } }
    );
    
    // Update active elections to completed
    await Election.updateMany(
      { status: 'active', endDate: { $lte: now } },
      { $set: { status: 'completed' } }
    );
    
    // Update the file after updating statuses
    const allElections = await Election.find();
    await saveElectionsToFile(allElections);
  } catch (error) {
    console.error('Error updating election statuses:', error);
  }
};

/**
 * Get active elections
 */
export const getActiveElections = async (): Promise<IElection[]> => {
  try {
    return await Election.find({ status: 'active' });
  } catch (error) {
    console.error('Error fetching active elections:', error);
    
    // Try to get from file as fallback
    const fileElections = await readElectionsFromFile();
    return fileElections.filter(e => e.status === 'active');
  }
};

/**
 * Get upcoming elections
 */
export const getUpcomingElections = async (): Promise<IElection[]> => {
  try {
    return await Election.find({ status: 'upcoming' });
  } catch (error) {
    console.error('Error fetching upcoming elections:', error);
    
    // Try to get from file as fallback
    const fileElections = await readElectionsFromFile();
    return fileElections.filter(e => e.status === 'upcoming');
  }
};

/**
 * Get completed elections
 */
export const getCompletedElections = async (): Promise<IElection[]> => {
  try {
    return await Election.find({ status: 'completed' });
  } catch (error) {
    console.error('Error fetching completed elections:', error);
    
    // Try to get from file as fallback
    const fileElections = await readElectionsFromFile();
    return fileElections.filter(e => e.status === 'completed');
  }
}; 