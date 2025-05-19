import cron from 'node-cron';
import { NotificationType, NotificationChannel } from '../../types/notification';
import notificationService from './index';
import { ElectionStatus } from '../../types/election';

/**
 * Initialize the notification scheduler
 */
export const initializeNotificationScheduler = () => {
  console.log('Initializing notification scheduler');
  
  // Schedule election reminders - run every day at 9:00 AM
  cron.schedule('0 9 * * *', () => {
    console.log('Running scheduled task: election reminders');
    sendUpcomingElectionReminders();
  });
  
  // Schedule notifications for elections starting today - run every day at 8:00 AM
  cron.schedule('0 8 * * *', () => {
    console.log('Running scheduled task: elections starting today');
    sendElectionStartingNotifications();
  });
  
  // Schedule notifications for elections ending today - run every day at 8:00 PM
  cron.schedule('0 20 * * *', () => {
    console.log('Running scheduled task: elections ending today');
    sendElectionEndingNotifications();
  });
  
  // Schedule cleanup for old notifications - run every Sunday at 1:00 AM
  cron.schedule('0 1 * * 0', () => {
    console.log('Running scheduled task: notification cleanup');
    cleanupOldNotifications();
  });
};

/**
 * Send reminders for upcoming elections that are about to start
 */
const sendUpcomingElectionReminders = async () => {
  try {
    // In a real implementation, fetch from database
    // 1. Find all active elections that will end in the next 24 hours
    // 2. For each election, find all eligible voters who haven't voted
    // 3. Send reminders to those voters
    
    // Mock data
    const elections = [
      {
        id: '1',
        title: 'Community Council Election',
        status: ElectionStatus.ACTIVE,
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        eligibleVoters: ['user1', 'user2', 'user3']
      }
    ];
    
    for (const election of elections) {
      console.log(`Sending reminders for election: ${election.title}`);
      
      // In a real implementation, filter voters who haven't voted yet
      const votersToRemind = election.eligibleVoters;
      
      if (votersToRemind.length > 0) {
        await notificationService.sendBroadcastNotification(
          {
            type: NotificationType.ELECTION_REMINDER,
            channel: NotificationChannel.BOTH,
            title: `Last Chance to Vote: ${election.title}`,
            content: `The ${election.title} election is ending soon. Please cast your vote before it closes.`,
            metadata: {
              electionId: election.id,
              electionTitle: election.title,
              endDate: election.endDate
            }
          },
          votersToRemind
        );
        
        console.log(`Sent reminders to ${votersToRemind.length} voters for election ${election.id}`);
      } else {
        console.log(`No voters to remind for election ${election.id}`);
      }
    }
  } catch (error) {
    console.error('Error sending election reminders:', error);
  }
};

/**
 * Send notifications for elections that are starting today
 */
const sendElectionStartingNotifications = async () => {
  try {
    // In a real implementation, fetch from database
    // 1. Find all elections that are starting today
    // 2. For each election, find all eligible voters
    // 3. Send notifications to those voters
    
    // Mock data
    const electionsStartingToday = [
      {
        id: '2',
        title: 'School Board Election',
        status: ElectionStatus.UPCOMING,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        eligibleVoters: ['user1', 'user3', 'user5']
      }
    ];
    
    for (const election of electionsStartingToday) {
      console.log(`Sending starting notifications for election: ${election.title}`);
      
      await notificationService.sendBroadcastNotification(
        {
          type: NotificationType.ELECTION_STARTED,
          channel: NotificationChannel.BOTH,
          title: `Election Started: ${election.title}`,
          content: `The ${election.title} election has started. You can now cast your vote.`,
          metadata: {
            electionId: election.id,
            electionTitle: election.title,
            startDate: election.startDate,
            endDate: election.endDate
          }
        },
        election.eligibleVoters
      );
      
      console.log(`Sent starting notifications to ${election.eligibleVoters.length} voters for election ${election.id}`);
    }
  } catch (error) {
    console.error('Error sending election starting notifications:', error);
  }
};

/**
 * Send notifications for elections that are ending today
 */
const sendElectionEndingNotifications = async () => {
  try {
    // In a real implementation, fetch from database
    // 1. Find all elections that are ending today
    // 2. For each election, find all eligible voters who haven't voted
    // 3. Send notifications to those voters
    
    // Mock data
    const electionsEndingToday = [
      {
        id: '3',
        title: 'Budget Committee Election',
        status: ElectionStatus.ACTIVE,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        endDate: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
        eligibleVoters: ['user2', 'user4', 'user6'],
        nonVotedVoters: ['user6']
      }
    ];
    
    for (const election of electionsEndingToday) {
      console.log(`Sending ending notifications for election: ${election.title}`);
      
      // Send to all eligible voters
      await notificationService.sendBroadcastNotification(
        {
          type: NotificationType.ELECTION_ENDED,
          channel: NotificationChannel.BOTH,
          title: `Election Ending Today: ${election.title}`,
          content: `The ${election.title} election is ending today. Results will be available soon.`,
          metadata: {
            electionId: election.id,
            electionTitle: election.title,
            endDate: election.endDate
          }
        },
        election.eligibleVoters
      );
      
      // Send urgent reminder to voters who haven't voted yet
      if (election.nonVotedVoters && election.nonVotedVoters.length > 0) {
        await notificationService.sendBroadcastNotification(
          {
            type: NotificationType.ELECTION_REMINDER,
            channel: NotificationChannel.BOTH,
            title: `Urgent: Last Chance to Vote in ${election.title}`,
            content: `The ${election.title} election is ending today and you haven't cast your vote yet. This is your last chance to participate.`,
            metadata: {
              electionId: election.id,
              electionTitle: election.title,
              endDate: election.endDate,
              urgent: true
            }
          },
          election.nonVotedVoters
        );
      }
      
      console.log(`Sent ending notifications for election ${election.id}`);
    }
  } catch (error) {
    console.error('Error sending election ending notifications:', error);
  }
};

/**
 * Clean up old notifications
 */
const cleanupOldNotifications = async () => {
  try {
    // In a real implementation, delete or archive old notifications from database
    console.log('Cleaned up old notifications');
  } catch (error) {
    console.error('Error cleaning up old notifications:', error);
  }
};

/**
 * Schedule a specific election reminder
 * @param electionId Election ID
 * @param reminderDate Date to send reminder
 */
export const scheduleElectionReminder = async (electionId: string, reminderDate: Date) => {
  try {
    // In a real implementation, fetch election details from database
    const electionTitle = 'Demo Election';
    const eligibleVoters = ['user1', 'user2', 'user3'];
    
    // Calculate delay in milliseconds
    const delay = reminderDate.getTime() - Date.now();
    
    if (delay <= 0) {
      console.log(`Reminder date for election ${electionId} is in the past, sending immediately`);
      
      // Send immediate reminder
      await notificationService.sendBroadcastNotification(
        {
          type: NotificationType.ELECTION_REMINDER,
          channel: NotificationChannel.BOTH,
          title: `Reminder: Vote in ${electionTitle}`,
          content: `Don't forget to cast your vote in the ${electionTitle} election.`,
          metadata: {
            electionId,
            electionTitle,
            scheduled: true
          }
        },
        eligibleVoters
      );
    } else {
      console.log(`Scheduling reminder for election ${electionId} on ${reminderDate.toISOString()}`);
      
      // In a real implementation, save to database and use a more robust scheduling mechanism
      setTimeout(() => {
        notificationService.sendBroadcastNotification(
          {
            type: NotificationType.ELECTION_REMINDER,
            channel: NotificationChannel.BOTH,
            title: `Reminder: Vote in ${electionTitle}`,
            content: `Don't forget to cast your vote in the ${electionTitle} election.`,
            metadata: {
              electionId,
              electionTitle,
              scheduled: true
            }
          },
          eligibleVoters
        ).then(() => {
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
  } catch (error) {
    console.error(`Error scheduling reminder for election ${electionId}:`, error);
    throw error;
  }
};

export default {
  initializeNotificationScheduler,
  scheduleElectionReminder
}; 