"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationStatus = exports.NotificationChannel = exports.NotificationType = void 0;
var NotificationType;
(function (NotificationType) {
    NotificationType["REGISTRATION"] = "registration";
    NotificationType["VERIFICATION"] = "verification";
    NotificationType["PASSWORD_RESET"] = "password_reset";
    NotificationType["ELECTION_INVITATION"] = "election_invitation";
    NotificationType["ELECTION_REMINDER"] = "election_reminder";
    NotificationType["ELECTION_STARTED"] = "election_started";
    NotificationType["ELECTION_ENDED"] = "election_ended";
    NotificationType["VOTE_CONFIRMATION"] = "vote_confirmation";
    NotificationType["RESULTS_PUBLISHED"] = "results_published";
    NotificationType["SYSTEM_ANNOUNCEMENT"] = "system_announcement";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["IN_APP"] = "in_app";
    NotificationChannel["BOTH"] = "both";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["PENDING"] = "pending";
    NotificationStatus["SENT"] = "sent";
    NotificationStatus["FAILED"] = "failed";
    NotificationStatus["READ"] = "read";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
//# sourceMappingURL=notification.js.map