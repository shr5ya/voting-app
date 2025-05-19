export enum NotificationType {
  REGISTRATION = 'registration',
  VERIFICATION = 'verification',
  PASSWORD_RESET = 'password_reset',
  ELECTION_INVITATION = 'election_invitation',
  ELECTION_REMINDER = 'election_reminder',
  ELECTION_STARTED = 'election_started',
  ELECTION_ENDED = 'election_ended',
  VOTE_CONFIRMATION = 'vote_confirmation',
  RESULTS_PUBLISHED = 'results_published',
  SYSTEM_ANNOUNCEMENT = 'system_announcement'
}

export enum NotificationChannel {
  EMAIL = 'email',
  IN_APP = 'in_app',
  BOTH = 'both'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
  READ = 'read'
}

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  title: string;
  content: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  createdAt: Date;
  sentAt?: Date;
  readAt?: Date;
  metadata?: Record<string, any>;
  relatedId?: string; // e.g., electionId, voteId
}

export interface EmailNotification extends Notification {
  to: string;
  from: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}

export interface InAppNotification extends Notification {
  isImportant: boolean;
  actionUrl?: string;
  expiresAt?: Date;
}

export interface ScheduledNotification {
  id: string;
  notificationType: NotificationType;
  recipientId: string;
  channel: NotificationChannel;
  scheduledFor: Date;
  templateId: string;
  templateData: Record<string, any>;
  status: 'scheduled' | 'processed' | 'cancelled';
  createdAt: Date;
  processedAt?: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  subject: string;
  htmlTemplate: string;
  textTemplate: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendNotificationRequest {
  type: NotificationType;
  recipientId: string;
  channel: NotificationChannel;
  templateId?: string;
  templateData?: Record<string, any>;
  title?: string;
  content?: string;
  metadata?: Record<string, any>;
  scheduledFor?: Date;
} 