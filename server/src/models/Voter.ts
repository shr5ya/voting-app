import mongoose, { Schema, Document } from 'mongoose';

// Voter interface extending Document
export interface IVoter extends Document {
  name: string;
  email: string;
  hasVoted: boolean;
  electionId?: string;
  voteTimestamp?: Date;
  accessCode?: string;
}

// Voter schema
const VoterSchema = new Schema<IVoter>({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  hasVoted: { 
    type: Boolean, 
    default: false 
  },
  electionId: { 
    type: String
  },
  voteTimestamp: { 
    type: Date 
  },
  accessCode: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
VoterSchema.index({ email: 1 }, { unique: true });
VoterSchema.index({ electionId: 1 });
VoterSchema.index({ hasVoted: 1 });

const Voter = mongoose.model<IVoter>('Voter', VoterSchema);

export default Voter; 