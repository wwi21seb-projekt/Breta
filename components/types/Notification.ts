export interface Notification {
    notificationId: string,
    timestamp: string,
    notificationType: string,
    user: {
        username: string,
        nickname: string,
        profilePictureUrl: string
    }
}
