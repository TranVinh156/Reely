package com.reely.modules.notification;

public interface NotificationService {
    Notification addNotification(NotificationRequestDTO notificationRequestDTO);
    Notification getNotificationById(Long notificationId);
    Notification updateNotificationById(Long notificationId, NotificationRequestDTO notificationRequestDTO);
    void deleteNotificationById(Long notificationId);

}
