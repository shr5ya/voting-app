import http from 'http';
import { NotificationType, NotificationChannel, SendNotificationRequest } from '../../types/notification';
export declare const initializeNotificationService: (server: http.Server) => void;
export declare const sendNotification: (notification: SendNotificationRequest) => Promise<{
    id: string;
    type: NotificationType;
    userId: string;
    title: string;
    content: string;
    channel: NotificationChannel;
    status: string;
    createdAt: Date;
    metadata: Record<string, any>;
}>;
export declare const scheduleNotification: (notification: SendNotificationRequest, scheduledFor: Date) => Promise<{
    scheduledFor: Date;
    status: string;
    createdAt: Date;
    type: NotificationType;
    recipientId: string;
    channel: NotificationChannel;
    templateId?: string;
    templateData?: Record<string, any>;
    title?: string;
    content?: string;
    metadata?: Record<string, any>;
    id: string;
}>;
export declare const sendBroadcastNotification: (notification: Omit<SendNotificationRequest, "recipientId">, userIds: string[]) => Promise<{
    total: number;
    sent: number;
    failed: number;
}>;
export declare const sendElectionReminders: (electionId: string, message?: string) => Promise<{
    total: number;
    sent: number;
    failed: number;
}>;
declare const _default: {
    initializeNotificationService: (server: http.Server) => void;
    sendNotification: (notification: SendNotificationRequest) => Promise<{
        id: string;
        type: NotificationType;
        userId: string;
        title: string;
        content: string;
        channel: NotificationChannel;
        status: string;
        createdAt: Date;
        metadata: Record<string, any>;
    }>;
    scheduleNotification: (notification: SendNotificationRequest, scheduledFor: Date) => Promise<{
        scheduledFor: Date;
        status: string;
        createdAt: Date;
        type: NotificationType;
        recipientId: string;
        channel: NotificationChannel;
        templateId?: string;
        templateData?: Record<string, any>;
        title?: string;
        content?: string;
        metadata?: Record<string, any>;
        id: string;
    }>;
    sendBroadcastNotification: (notification: Omit<SendNotificationRequest, "recipientId">, userIds: string[]) => Promise<{
        total: number;
        sent: number;
        failed: number;
    }>;
    sendElectionReminders: (electionId: string, message?: string) => Promise<{
        total: number;
        sent: number;
        failed: number;
    }>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map