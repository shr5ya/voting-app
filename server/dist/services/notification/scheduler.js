"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleElectionReminder = exports.initializeNotificationScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const notification_1 = require("../../types/notification");
const index_1 = __importDefault(require("./index"));
const election_1 = require("../../types/election");
const initializeNotificationScheduler = () => {
    console.log('Initializing notification scheduler');
    node_cron_1.default.schedule('0 9 * * *', () => {
        console.log('Running scheduled task: election reminders');
        sendUpcomingElectionReminders();
    });
    node_cron_1.default.schedule('0 8 * * *', () => {
        console.log('Running scheduled task: elections starting today');
        sendElectionStartingNotifications();
    });
    node_cron_1.default.schedule('0 20 * * *', () => {
        console.log('Running scheduled task: elections ending today');
        sendElectionEndingNotifications();
    });
    node_cron_1.default.schedule('0 1 * * 0', () => {
        console.log('Running scheduled task: notification cleanup');
        cleanupOldNotifications();
    });
};
exports.initializeNotificationScheduler = initializeNotificationScheduler;
const sendUpcomingElectionReminders = async () => {
    try {
        const elections = [
            {
                id: '1',
                title: 'Community Council Election',
                status: election_1.ElectionStatus.ACTIVE,
                startDate: new Date(),
                endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                eligibleVoters: ['user1', 'user2', 'user3']
            }
        ];
        for (const election of elections) {
            console.log(`Sending reminders for election: ${election.title}`);
            const votersToRemind = election.eligibleVoters;
            if (votersToRemind.length > 0) {
                await index_1.default.sendBroadcastNotification({
                    type: notification_1.NotificationType.ELECTION_REMINDER,
                    channel: notification_1.NotificationChannel.BOTH,
                    title: `Last Chance to Vote: ${election.title}`,
                    content: `The ${election.title} election is ending soon. Please cast your vote before it closes.`,
                    metadata: {
                        electionId: election.id,
                        electionTitle: election.title,
                        endDate: election.endDate
                    }
                }, votersToRemind);
                console.log(`Sent reminders to ${votersToRemind.length} voters for election ${election.id}`);
            }
            else {
                console.log(`No voters to remind for election ${election.id}`);
            }
        }
    }
    catch (error) {
        console.error('Error sending election reminders:', error);
    }
};
const sendElectionStartingNotifications = async () => {
    try {
        const electionsStartingToday = [
            {
                id: '2',
                title: 'School Board Election',
                status: election_1.ElectionStatus.UPCOMING,
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                eligibleVoters: ['user1', 'user3', 'user5']
            }
        ];
        for (const election of electionsStartingToday) {
            console.log(`Sending starting notifications for election: ${election.title}`);
            await index_1.default.sendBroadcastNotification({
                type: notification_1.NotificationType.ELECTION_STARTED,
                channel: notification_1.NotificationChannel.BOTH,
                title: `Election Started: ${election.title}`,
                content: `The ${election.title} election has started. You can now cast your vote.`,
                metadata: {
                    electionId: election.id,
                    electionTitle: election.title,
                    startDate: election.startDate,
                    endDate: election.endDate
                }
            }, election.eligibleVoters);
            console.log(`Sent starting notifications to ${election.eligibleVoters.length} voters for election ${election.id}`);
        }
    }
    catch (error) {
        console.error('Error sending election starting notifications:', error);
    }
};
const sendElectionEndingNotifications = async () => {
    try {
        const electionsEndingToday = [
            {
                id: '3',
                title: 'Budget Committee Election',
                status: election_1.ElectionStatus.ACTIVE,
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                endDate: new Date(Date.now() + 3 * 60 * 60 * 1000),
                eligibleVoters: ['user2', 'user4', 'user6'],
                nonVotedVoters: ['user6']
            }
        ];
        for (const election of electionsEndingToday) {
            console.log(`Sending ending notifications for election: ${election.title}`);
            await index_1.default.sendBroadcastNotification({
                type: notification_1.NotificationType.ELECTION_ENDED,
                channel: notification_1.NotificationChannel.BOTH,
                title: `Election Ending Today: ${election.title}`,
                content: `The ${election.title} election is ending today. Results will be available soon.`,
                metadata: {
                    electionId: election.id,
                    electionTitle: election.title,
                    endDate: election.endDate
                }
            }, election.eligibleVoters);
            if (election.nonVotedVoters && election.nonVotedVoters.length > 0) {
                await index_1.default.sendBroadcastNotification({
                    type: notification_1.NotificationType.ELECTION_REMINDER,
                    channel: notification_1.NotificationChannel.BOTH,
                    title: `Urgent: Last Chance to Vote in ${election.title}`,
                    content: `The ${election.title} election is ending today and you haven't cast your vote yet. This is your last chance to participate.`,
                    metadata: {
                        electionId: election.id,
                        electionTitle: election.title,
                        endDate: election.endDate,
                        urgent: true
                    }
                }, election.nonVotedVoters);
            }
            console.log(`Sent ending notifications for election ${election.id}`);
        }
    }
    catch (error) {
        console.error('Error sending election ending notifications:', error);
    }
};
const cleanupOldNotifications = async () => {
    try {
        console.log('Cleaned up old notifications');
    }
    catch (error) {
        console.error('Error cleaning up old notifications:', error);
    }
};
const scheduleElectionReminder = async (electionId, reminderDate) => {
    try {
        const electionTitle = 'Demo Election';
        const eligibleVoters = ['user1', 'user2', 'user3'];
        const delay = reminderDate.getTime() - Date.now();
        if (delay <= 0) {
            console.log(`Reminder date for election ${electionId} is in the past, sending immediately`);
            await index_1.default.sendBroadcastNotification({
                type: notification_1.NotificationType.ELECTION_REMINDER,
                channel: notification_1.NotificationChannel.BOTH,
                title: `Reminder: Vote in ${electionTitle}`,
                content: `Don't forget to cast your vote in the ${electionTitle} election.`,
                metadata: {
                    electionId,
                    electionTitle,
                    scheduled: true
                }
            }, eligibleVoters);
        }
        else {
            console.log(`Scheduling reminder for election ${electionId} on ${reminderDate.toISOString()}`);
            setTimeout(() => {
                index_1.default.sendBroadcastNotification({
                    type: notification_1.NotificationType.ELECTION_REMINDER,
                    channel: notification_1.NotificationChannel.BOTH,
                    title: `Reminder: Vote in ${electionTitle}`,
                    content: `Don't forget to cast your vote in the ${electionTitle} election.`,
                    metadata: {
                        electionId,
                        electionTitle,
                        scheduled: true
                    }
                }, eligibleVoters).then(() => {
                    console.log(`Sent scheduled reminder for election ${electionId}`);
                }).catch(error => {
                    console.error(`Error sending scheduled reminder for election ${electionId}:`, error);
                });
            }, delay);
        }
        return {
            electionId,
            scheduledFor: reminderDate,
            recipientCount: eligibleVoters.length
        };
    }
    catch (error) {
        console.error(`Error scheduling reminder for election ${electionId}:`, error);
        throw error;
    }
};
exports.scheduleElectionReminder = scheduleElectionReminder;
exports.default = {
    initializeNotificationScheduler: exports.initializeNotificationScheduler,
    scheduleElectionReminder: exports.scheduleElectionReminder
};
//# sourceMappingURL=scheduler.js.map