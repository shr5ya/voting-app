export declare const initializeNotificationScheduler: () => void;
export declare const scheduleElectionReminder: (electionId: string, reminderDate: Date) => Promise<{
    electionId: string;
    scheduledFor: Date;
    recipientCount: number;
}>;
declare const _default: {
    initializeNotificationScheduler: () => void;
    scheduleElectionReminder: (electionId: string, reminderDate: Date) => Promise<{
        electionId: string;
        scheduledFor: Date;
        recipientCount: number;
    }>;
};
export default _default;
//# sourceMappingURL=scheduler.d.ts.map