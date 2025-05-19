import Election, { IElection } from '../models/Election';

/**
 * Get all elections
 */
export const getElections = async (): Promise<IElection[]> => {
  try {
    return await Election.find();
  } catch (error) {
    console.error('Error fetching elections:', error);
    return [];
  }
};

/**
 * Get a specific election by ID
 */
export const getElection = async (id: string): Promise<IElection | null> => {
  try {
    return await Election.findById(id);
  } catch (error) {
    console.error(`Error fetching election with id ${id}:`, error);
    return null;
  }
};

/**
 * Add a new election
 */
export const addElection = async (election: any): Promise<IElection | null> => {
  try {
    const newElection = new Election(election);
    return await newElection.save();
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
    return await Election.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );
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
    return [];
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
    return [];
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
    return [];
  }
}; 