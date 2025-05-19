import Voter, { IVoter } from '../models/Voter';
import { generateRandomCode } from '../utils/helpers';

/**
 * Get all voters
 */
export const getVoters = async (): Promise<IVoter[]> => {
  try {
    return await Voter.find();
  } catch (error) {
    console.error('Error fetching voters:', error);
    return [];
  }
};

/**
 * Get a specific voter by ID
 */
export const getVoter = async (id: string): Promise<IVoter | null> => {
  try {
    return await Voter.findById(id);
  } catch (error) {
    console.error(`Error fetching voter with id ${id}:`, error);
    return null;
  }
};

/**
 * Get a voter by email
 */
export const getVoterByEmail = async (email: string): Promise<IVoter | null> => {
  try {
    return await Voter.findOne({ email: email.toLowerCase() });
  } catch (error) {
    console.error(`Error fetching voter with email ${email}:`, error);
    return null;
  }
};

/**
 * Add a new voter
 */
export const addVoter = async (voter: any): Promise<IVoter | null> => {
  try {
    // Check if voter already exists
    const existingVoter = await Voter.findOne({ email: voter.email.toLowerCase() });
    if (existingVoter) {
      return existingVoter;
    }
    
    // Generate access code if not provided
    if (!voter.accessCode) {
      voter.accessCode = generateRandomCode(6);
    }
    
    const newVoter = new Voter({
      ...voter,
      email: voter.email.toLowerCase(),
      hasVoted: false
    });
    
    return await newVoter.save();
  } catch (error) {
    console.error('Error adding voter:', error);
    return null;
  }
};

/**
 * Update an existing voter
 */
export const updateVoter = async (id: string, updates: any): Promise<IVoter | null> => {
  try {
    return await Voter.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );
  } catch (error) {
    console.error(`Error updating voter with id ${id}:`, error);
    return null;
  }
};

/**
 * Delete a voter
 */
export const deleteVoter = async (id: string): Promise<boolean> => {
  try {
    const result = await Voter.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error(`Error deleting voter with id ${id}:`, error);
    return false;
  }
};

/**
 * Record a vote for a voter
 */
export const recordVote = async (voterId: string, electionId: string): Promise<boolean> => {
  try {
    const voter = await Voter.findById(voterId);
    if (!voter) {
      return false;
    }
    
    // Check if voter has already voted in this election
    if (voter.hasVoted && voter.electionId === electionId) {
      return false;
    }
    
    voter.hasVoted = true;
    voter.electionId = electionId;
    voter.voteTimestamp = new Date();
    
    await voter.save();
    return true;
  } catch (error) {
    console.error(`Error recording vote for voter ${voterId}:`, error);
    return false;
  }
};

/**
 * Get voters for a specific election
 */
export const getVotersForElection = async (electionId: string): Promise<IVoter[]> => {
  try {
    return await Voter.find({ electionId });
  } catch (error) {
    console.error(`Error fetching voters for election ${electionId}:`, error);
    return [];
  }
};

/**
 * Check if a voter has voted in an election
 */
export const hasVoted = async (voterId: string, electionId: string): Promise<boolean> => {
  try {
    const voter = await Voter.findOne({ _id: voterId, electionId, hasVoted: true });
    return !!voter;
  } catch (error) {
    console.error(`Error checking if voter ${voterId} has voted in election ${electionId}:`, error);
    return false;
  }
}; 