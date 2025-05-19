export enum ElectionStatus {
  DRAFT = 'draft',
  UPCOMING = 'upcoming',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: ElectionStatus;
  createdBy: string; // User ID
  updatedBy?: string; // User ID
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  resultsPublished: boolean;
  voterCount: number;
  totalVotes: number;
}

export interface Candidate {
  id: string;
  electionId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  position?: string;
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  id: string;
  electionId: string;
  voterId: string;
  candidateId: string;
  timestamp: Date;
  ipAddress?: string;
  deviceInfo?: string;
  verified: boolean;
}

export interface ElectionVoter {
  id: string;
  electionId: string;
  voterId: string;
  email: string;
  hasVoted: boolean;
  inviteSent: boolean;
  inviteSentAt?: Date;
  reminderSent: boolean;
  reminderSentAt?: Date;
  votedAt?: Date;
}

export interface ElectionResult {
  electionId: string;
  title: string;
  status: ElectionStatus;
  startDate: Date;
  endDate: Date;
  totalVoters: number;
  totalVotesCast: number;
  participationRate: number;
  candidates: {
    id: string;
    name: string;
    voteCount: number;
    percentage: number;
  }[];
  createdAt: Date;
}

export interface ElectionStatistics {
  totalElections: number;
  activeElections: number;
  upcomingElections: number;
  completedElections: number;
  totalVoters: number;
  totalVotes: number;
  averageParticipation: number;
}

export interface CreateElectionRequest {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isPublic: boolean;
}

export interface UpdateElectionRequest {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: ElectionStatus;
  isPublic?: boolean;
  resultsPublished?: boolean;
}

export interface CastVoteRequest {
  electionId: string;
  candidateId: string;
} 