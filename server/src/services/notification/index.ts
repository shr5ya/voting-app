import { Server as SocketServer } from 'socket.io';
import http from 'http';
import nodemailer from 'nodemailer';
import { 
  NotificationType,
  NotificationChannel, 
  SendNotificationRequest,
  EmailNotification,
  InAppNotification
} from '../../types/notification';

// Socket.io instance
let io: SocketServer;

// Transporter for sending emails
const emailTransporter = nodemailer.createTransport({
  // In a real implementation, use environment variables for configuration
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASSWORD || 'password'
  }
});

/**
 * Initialize the notification service with the HTTP server
 * @param server HTTP server instance
 */
export const initializeNotificationService = (server: http.Server) => {
  io = new SocketServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Authenticate user and join their room
    socket.on('authenticate', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} authenticated`);
    });

    // Join election room for real-time updates
    socket.on('join-election', (electionId: string) => {
      socket.join(`election:${electionId}`);
      console.log(`Socket ${socket.id} joined election ${electionId}`);
    });

    // Leave election room
    socket.on('leave-election', (electionId: string) => {
      socket.leave(`election:${electionId}`);
      console.log(`Socket ${socket.id} left election ${electionId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  console.log('Notification service initialized');
};

/**
 * Send a notification to a user
 * @param notification Notification data
 */
export const sendNotification = async (notification: SendNotificationRequest) => {
  try {
    const { type, recipientId, channel, title, content, metadata } = notification;
    
    // Create notification record (in a real implementation, save to database)
    const notificationRecord = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      userId: recipientId,
      title: title || getDefaultTitle(type),
      content: content || getDefaultContent(type),
      channel: channel || NotificationChannel.BOTH,
      status: 'pending',
      createdAt: new Date(),
      metadata: metadata || {}
    };
    
    // Send notification based on channel
    if (
      channel === NotificationChannel.EMAIL ||
      channel === NotificationChannel.BOTH
    ) {
      await sendEmailNotification(recipientId, notificationRecord as EmailNotification);
    }
    
    if (
      channel === NotificationChannel.IN_APP ||
      channel === NotificationChannel.BOTH
    ) {
      await sendInAppNotification(recipientId, notificationRecord as InAppNotification);
    }
    
    return notificationRecord;
  } catch (error) {
    console.error('Failed to send notification:', error);
    throw error;
  }
};

/**
 * Send an email notification
 * @param userId User ID
 * @param notification Email notification data
 */
const sendEmailNotification = async (userId: string, notification: EmailNotification) => {
  try {
    // In a real implementation, get user email from database
    const userEmail = `user${userId}@example.com`;
    
    // Get email template and populate with data
    const emailTemplate = getEmailTemplate(notification.type);
    
    // Send email
    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@electra.com',
      to: userEmail,
      subject: notification.title,
      text: notification.content,
      html: renderEmailTemplate(emailTemplate, {
        ...notification.metadata,
        title: notification.title,
        content: notification.content
      })
    });
    
    console.log(`Email notification sent to ${userEmail}:`, info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error;
  }
};

/**
 * Send an in-app notification via Socket.io
 * @param userId User ID
 * @param notification In-app notification data
 */
const sendInAppNotification = async (userId: string, notification: InAppNotification) => {
  try {
    // Emit notification to user's room
    io.to(`user:${userId}`).emit('notification', {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      content: notification.content,
      timestamp: new Date(),
      isRead: false,
      metadata: notification.metadata
    });
    
    // If notification is election-related, emit to election room
    if (notification.metadata && notification.metadata.electionId) {
      io.to(`election:${notification.metadata.electionId}`).emit('election-update', {
        type: notification.type,
        electionId: notification.metadata.electionId,
        timestamp: new Date(),
        data: notification.metadata
      });
    }
    
    console.log(`In-app notification sent to user ${userId}`);
    return true;
  } catch (error) {
    console.error('Failed to send in-app notification:', error);
    throw error;
  }
};

/**
 * Schedule a notification for future delivery
 * @param notification Notification data
 * @param scheduledFor Date to send notification
 */
export const scheduleNotification = async (
  notification: SendNotificationRequest,
  scheduledFor: Date
) => {
  try {
    // In a real implementation, save scheduled notification to database
    const scheduledNotification = {
      id: Math.random().toString(36).substring(2, 9),
      ...notification,
      scheduledFor,
      status: 'scheduled',
      createdAt: new Date()
    };
    
    // Calculate delay in milliseconds
    const delay = scheduledFor.getTime() - Date.now();
    
    // Set timeout to send notification at scheduled time
    if (delay > 0) {
      setTimeout(() => {
        sendNotification(notification)
          .then(() => {
            console.log(`Scheduled notification ${scheduledNotification.id} sent`);
          })
          .catch((error) => {
            console.error(`Failed to send scheduled notification ${scheduledNotification.id}:`, error);
          });
      }, delay);
    } else {
      // If scheduled time is in the past, send immediately
      await sendNotification(notification);
    }
    
    return scheduledNotification;
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    throw error;
  }
};

/**
 * Send a broadcast notification to multiple users
 * @param notification Notification data
 * @param userIds Array of user IDs to notify
 */
export const sendBroadcastNotification = async (
  notification: Omit<SendNotificationRequest, 'recipientId'>,
  userIds: string[]
) => {
  try {
    const results = await Promise.allSettled(
      userIds.map(userId => 
        sendNotification({
          ...notification,
          recipientId: userId
        })
      )
    );
    
    return {
      total: userIds.length,
      sent: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length
    };
  } catch (error) {
    console.error('Failed to send broadcast notification:', error);
    throw error;
  }
};

/**
 * Send election reminders to voters who haven't voted yet
 * @param electionId Election ID
 * @param message Custom reminder message
 */
export const sendElectionReminders = async (electionId: string, message?: string) => {
  try {
    // In a real implementation, fetch eligible voters who haven't voted yet
    const eligibleVoters = ['user1', 'user2', 'user3'];
    
    // Mock election data
    const electionTitle = 'Community Council Election';
    
    const results = await sendBroadcastNotification(
      {
        type: NotificationType.ELECTION_REMINDER,
        channel: NotificationChannel.BOTH,
        title: `Reminder: Vote in ${electionTitle}`,
        content: message || `Don't forget to cast your vote in the ${electionTitle}. Voting closes soon!`,
        metadata: {
          electionId,
          electionTitle
        }
      },
      eligibleVoters
    );
    
    return results;
  } catch (error) {
    console.error('Failed to send election reminders:', error);
    throw error;
  }
};

// Helper functions

/**
 * Get default notification title based on type
 * @param type Notification type
 */
const getDefaultTitle = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.REGISTRATION:
      return 'Welcome to Electra';
    case NotificationType.VERIFICATION:
      return 'Verify Your Email';
    case NotificationType.PASSWORD_RESET:
      return 'Password Reset Request';
    case NotificationType.ELECTION_INVITATION:
      return 'You\'re Invited to Vote';
    case NotificationType.ELECTION_REMINDER:
      return 'Reminder: Don\'t Forget to Vote';
    case NotificationType.ELECTION_STARTED:
      return 'An Election Has Started';
    case NotificationType.ELECTION_ENDED:
      return 'Election Results Available';
    case NotificationType.VOTE_CONFIRMATION:
      return 'Vote Confirmation';
    case NotificationType.RESULTS_PUBLISHED:
      return 'Election Results Published';
    case NotificationType.SYSTEM_ANNOUNCEMENT:
      return 'Important Announcement';
    default:
      return 'Electra Notification';
  }
};

/**
 * Get default notification content based on type
 * @param type Notification type
 */
const getDefaultContent = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.REGISTRATION:
      return 'Thank you for registering with Electra. Please verify your email to start voting.';
    case NotificationType.VERIFICATION:
      return 'Please verify your email address to complete your registration.';
    case NotificationType.PASSWORD_RESET:
      return 'A password reset has been requested for your account.';
    case NotificationType.ELECTION_INVITATION:
      return 'You\'ve been invited to participate in an election. Click to view details.';
    case NotificationType.ELECTION_REMINDER:
      return 'Don\'t forget to cast your vote in the upcoming election.';
    case NotificationType.ELECTION_STARTED:
      return 'An election you\'re eligible to vote in has started.';
    case NotificationType.ELECTION_ENDED:
      return 'An election you participated in has ended. Results are now available.';
    case NotificationType.VOTE_CONFIRMATION:
      return 'Your vote has been successfully recorded. Thank you for participating.';
    case NotificationType.RESULTS_PUBLISHED:
      return 'The results of an election you participated in have been published.';
    case NotificationType.SYSTEM_ANNOUNCEMENT:
      return 'Important announcement from the Electra system.';
    default:
      return 'You have a new notification from Electra.';
  }
};

/**
 * Get email template for notification type
 * @param type Notification type
 */
const getEmailTemplate = (type: NotificationType): string => {
  // In a real implementation, fetch templates from database or files
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0284c7; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>{{title}}</h2>
        </div>
        <div class="content">
          {{content}}
          
          {{#if actionUrl}}
          <p style="margin-top: 20px;">
            <a href="{{actionUrl}}" style="display: inline-block; padding: 10px 20px; background-color: #0284c7; color: white; text-decoration: none; border-radius: 5px;">
              {{actionText}}
            </a>
          </p>
          {{/if}}
        </div>
        <div class="footer">
          <p>This is an automated message from Electra Voting System. Please do not reply to this email.</p>
          <p>&copy; 2025 Electra. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Render email template with data
 * @param template Email template
 * @param data Template data
 */
const renderEmailTemplate = (template: string, data: Record<string, any>): string => {
  // Simple template rendering
  let rendered = template;
  
  // Replace placeholders with data
  Object.entries(data).forEach(([key, value]) => {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  });
  
  // Handle conditionals (very basic implementation)
  const conditionalRegex = /{{#if ([^}]+)}}([\s\S]*?){{\/if}}/g;
  rendered = rendered.replace(conditionalRegex, (match, condition, content) => {
    return data[condition] ? content : '';
  });
  
  return rendered;
};

// Export default object for easier importing
export default {
  initializeNotificationService,
  sendNotification,
  scheduleNotification,
  sendBroadcastNotification,
  sendElectionReminders
}; 