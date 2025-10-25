package com.reely.modules.notification;

import com.reely.modules.notification.dto.NotificationRequestDto;
import com.reely.modules.notification.dto.NotificationResponseDto;
import com.reely.modules.notification.dto.PaginationResponse;

public interface NotificationService {
    NotificationResponseDto addNotification(NotificationRequestDto notificationRequestDTO);
    Notification getNotificationById(Long notificationId);
    PaginationResponse<NotificationResponseDto> getNotificationsByUserId(Long userId, int page, int size);
    NotificationResponseDto updateNotificationById(Long notificationId, NotificationRequestDto notificationRequestDTO);
    void deleteNotificationById(Long notificationId);
}
