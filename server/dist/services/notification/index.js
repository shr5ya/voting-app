"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendElectionReminders = exports.sendBroadcastNotification = exports.scheduleNotification = exports.sendNotification = exports.initializeNotificationService = void 0;
const socket_io_1 = require("socket.io");
const nodemailer_1 = __importDefault(require("nodemailer"));
const notification_1 = require("../../types/notification");
let io;
const emailTransporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || 'user@example.com',
        pass: process.env.SMTP_PASSWORD || 'password'
    }
});
const initializeNotificationService = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on('authenticate', (userId) => {
            socket.join(`user:${userId}`);
            console.log(`User ${userId} authenticated`);
        });
        socket.on('join-election', (electionId) => {
            socket.join(`election:${electionId}`);
            console.log(`Socket ${socket.id} joined election ${electionId}`);
        });
        socket.on('leave-election', (electionId) => {
            socket.leave(`election:${electionId}`);
            console.log(`Socket ${socket.id} left election ${electionId}`);
        });
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
    console.log('Notification service initialized');
};
exports.initializeNotificationService = initializeNotificationService;
const sendNotification = async (notification) => {
    try {
        const { type, recipientId, channel, title, content, metadata } = notification;
        const notificationRecord = {
            id: Math.random().toString(36).substring(2, 9),
            type,
            userId: recipientId,
            title: title || getDefaultTitle(type),
            content: content || getDefaultContent(type),
            channel: channel || notification_1.NotificationChannel.BOTH,
            status: 'pending',
            createdAt: new Date(),
            metadata: metadata || {}
        };
        if (channel === notification_1.NotificationChannel.EMAIL ||
            channel === notification_1.NotificationChannel.BOTH) {
            await sendEmailNotification(recipientId, notificationRecord);
        }
        if (channel === notification_1.NotificationChannel.IN_APP ||
            channel === notification_1.NotificationChannel.BOTH) {
            await sendInAppNotification(recipientId, notificationRecord);
        }
        return notificationRecord;
    }
    catch (error) {
        console.error('Failed to send notification:', error);
        throw error;
    }
};
exports.sendNotification = sendNotification;
const sendEmailNotification = async (userId, notification) => {
    try {
        const userEmail = `user${userId}@example.com`;
        const emailTemplate = getEmailTemplate(notification.type);
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
    }
    catch (error) {
        console.error('Failed to send email notification:', error);
        throw error;
    }
};
const sendInAppNotification = async (userId, notification) => {
    try {
        io.to(`user:${userId}`).emit('notification', {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            content: notification.content,
            timestamp: new Date(),
            isRead: false,
            metadata: notification.metadata
        });
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
    }
    catch (error) {
        console.error('Failed to send in-app notification:', error);
        throw error;
    }
};
const scheduleNotification = async (notification, scheduledFor) => {
    try {
        const scheduledNotification = {
            id: Math.random().toString(36).substring(2, 9),
            ...notification,
            scheduledFor,
            status: 'scheduled',
            createdAt: new Date()
        };
        const delay = scheduledFor.getTime() - Date.now();
        if (delay > 0) {
            setTimeout(() => {
                (0, exports.sendNotification)(notification)
                    .then(() => {
                    console.log(`Scheduled notification ${scheduledNotification.id} sent`);
                })
                    .catch((error) => {
                    console.error(`Failed to send scheduled notification ${scheduledNotification.id}:`, error);
                });
            }, delay);
        }
        else {
            await (0, exports.sendNotification)(notification);
        }
        return scheduledNotification;
    }
    catch (error) {
        console.error('Failed to schedule notification:', error);
        throw error;
    }
};
exports.scheduleNotification = scheduleNotification;
const sendBroadcastNotification = async (notification, userIds) => {
    try {
        const results = await Promise.allSettled(userIds.map(userId => (0, exports.sendNotification)({
            ...notification,
            recipientId: userId
        })));
        return {
            total: userIds.length,
            sent: results.filter(r => r.status === 'fulfilled').length,
            failed: results.filter(r => r.status === 'rejected').length
        };
    }
    catch (error) {
        console.error('Failed to send broadcast notification:', error);
        throw error;
    }
};
exports.sendBroadcastNotification = sendBroadcastNotification;
const sendElectionReminders = async (electionId, message) => {
    try {
        const eligibleVoters = ['user1', 'user2', 'user3'];
        const electionTitle = 'Community Council Election';
        const results = await (0, exports.sendBroadcastNotification)({
            type: notification_1.NotificationType.ELECTION_REMINDER,
            channel: notification_1.NotificationChannel.BOTH,
            title: `Reminder: Vote in ${electionTitle}`,
            content: message || `Don't forget to cast your vote in the ${electionTitle}. Voting closes soon!`,
            metadata: {
                electionId,
                electionTitle
            }
        }, eligibleVoters);
        return results;
    }
    catch (error) {
        console.error('Failed to send election reminders:', error);
        throw error;
    }
};
exports.sendElectionReminders = sendElectionReminders;
const getDefaultTitle = (type) => {
    switch (type) {
        case notification_1.NotificationType.REGISTRATION:
            return 'Welcome to Electra';
        case notification_1.NotificationType.VERIFICATION:
            return 'Verify Your Email';
        case notification_1.NotificationType.PASSWORD_RESET:
            return 'Password Reset Request';
        case notification_1.NotificationType.ELECTION_INVITATION:
            return 'You\'re Invited to Vote';
        case notification_1.NotificationType.ELECTION_REMINDER:
            return 'Reminder: Don\'t Forget to Vote';
        case notification_1.NotificationType.ELECTION_STARTED:
            return 'An Election Has Started';
        case notification_1.NotificationType.ELECTION_ENDED:
            return 'Election Results Available';
        case notification_1.NotificationType.VOTE_CONFIRMATION:
            return 'Vote Confirmation';
        case notification_1.NotificationType.RESULTS_PUBLISHED:
            return 'Election Results Published';
        case notification_1.NotificationType.SYSTEM_ANNOUNCEMENT:
            return 'Important Announcement';
        default:
            return 'Electra Notification';
    }
};
const getDefaultContent = (type) => {
    switch (type) {
        case notification_1.NotificationType.REGISTRATION:
            return 'Thank you for registering with Electra. Please verify your email to start voting.';
        case notification_1.NotificationType.VERIFICATION:
            return 'Please verify your email address to complete your registration.';
        case notification_1.NotificationType.PASSWORD_RESET:
            return 'A password reset has been requested for your account.';
        case notification_1.NotificationType.ELECTION_INVITATION:
            return 'You\'ve been invited to participate in an election. Click to view details.';
        case notification_1.NotificationType.ELECTION_REMINDER:
            return 'Don\'t forget to cast your vote in the upcoming election.';
        case notification_1.NotificationType.ELECTION_STARTED:
            return 'An election you\'re eligible to vote in has started.';
        case notification_1.NotificationType.ELECTION_ENDED:
            return 'An election you participated in has ended. Results are now available.';
        case notification_1.NotificationType.VOTE_CONFIRMATION:
            return 'Your vote has been successfully recorded. Thank you for participating.';
        case notification_1.NotificationType.RESULTS_PUBLISHED:
            return 'The results of an election you participated in have been published.';
        case notification_1.NotificationType.SYSTEM_ANNOUNCEMENT:
            return 'Important announcement from the Electra system.';
        default:
            return 'You have a new notification from Electra.';
    }
};
const getEmailTemplate = (_type) => {
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
const renderEmailTemplate = (template, data) => {
    let rendered = template;
    Object.entries(data).forEach(([key, value]) => {
        rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    const conditionalRegex = /{{#if ([^}]+)}}([\s\S]*?){{\/if}}/g;
    rendered = rendered.replace(conditionalRegex, (_match, condition, content) => {
        return data[condition] ? content : '';
    });
    return rendered;
};
exports.default = {
    initializeNotificationService: exports.initializeNotificationService,
    sendNotification: exports.sendNotification,
    scheduleNotification: exports.scheduleNotification,
    sendBroadcastNotification: exports.sendBroadcastNotification,
    sendElectionReminders: exports.sendElectionReminders
};
//# sourceMappingURL=index.js.map