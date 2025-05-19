import mongoose, { Schema, Document } from 'mongoose';

// Candidate interface and schema
export interface ICandidate {
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  votes: number;
}

const CandidateSchema = new Schema<ICandidate>({
  name: { type: String, required: true },
  position: { type: String, required: true },
  bio: { type: String, required: false },
  imageUrl: { type: String, required: false },
  votes: { type: Number, default: 0 }
});

// Election interface extending Document
export interface IElection extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  candidates: ICandidate[];
  totalVotes: number;
  voterCount: number;
  voters: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  resultsPublished: boolean;
  determineStatus(): string;
}

// Election schema
const ElectionSchema = new Schema<IElection>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'upcoming', 'active', 'completed', 'cancelled'],
    default: 'draft' 
  },
  candidates: [CandidateSchema],
  totalVotes: { type: Number, default: 0 },
  voterCount: { type: Number, default: 0 },
  voters: [{ type: String }], // Array of voter IDs who have voted
  createdBy: { type: String, required: true },
  isPublic: { type: Boolean, default: true },
  resultsPublished: { type: Boolean, default: false }
}, {
  timestamps: true, // Automatically add createdAt and updatedAt
});

// Index for faster queries
ElectionSchema.index({ status: 1 });
ElectionSchema.index({ createdBy: 1 });
ElectionSchema.index({ startDate: 1, endDate: 1 });

// Helper methods
ElectionSchema.methods.determineStatus = function(): string {
  const now = new Date();
  if (now < this.startDate) return 'upcoming';
  if (now > this.endDate) return 'completed';
  return 'active';
};

// Virtual property for duration
ElectionSchema.virtual('durationInDays').get(function() {
  return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24));
});

// Pre-save hook to update status based on dates
ElectionSchema.pre('save', function(next) {
  if (this.isModified('startDate') || this.isModified('endDate') || this.isNew) {
    this.status = this.determineStatus();
  }
  next();
});

const Election = mongoose.model<IElection>('Election', ElectionSchema);

export default Election; 