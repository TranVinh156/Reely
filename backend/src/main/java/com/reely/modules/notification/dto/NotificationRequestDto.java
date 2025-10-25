package com.reely.modules.notification;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class NotificationRequestDto {
    private Long userId;
    private NotificationType type;
    private String payload;
    private Integer readFlag = 0;
}
