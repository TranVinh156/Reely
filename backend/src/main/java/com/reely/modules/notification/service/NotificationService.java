package com.reely.modules.notification.service;

import com.reely.modules.notification.dto.NotificationRequestDto;
import com.reely.modules.notification.dto.NotificationResponseDto;
import com.reely.modules.notification.dto.PaginationResponse;
import com.reely.modules.notification.entity.Notification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.List;

public interface NotificationService {
    NotificationResponseDto addNotification(NotificationRequestDto notificationRequestDTO);
    Notification getNotificationById(Long notificationId);
    PaginationResponse<NotificationResponseDto> getNotificationsByUserId(Long userId, int page, int size);
    NotificationResponseDto updateNotificationById(Long notificationId, NotificationRequestDto notificationRequestDTO);
    void deleteNotificationById(Long notificationId);
    void addPollingRequest(Long userId, Long lastNotificationId, DeferredResult<ResponseEntity<List<NotificationResponseDto>>> deferredResult);
}
