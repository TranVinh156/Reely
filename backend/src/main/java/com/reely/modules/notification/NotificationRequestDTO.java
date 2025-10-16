package com.reely.modules.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
public class NotificationRequestDTO {
    private Long userId;
    private NotificationType type;
    private String payload;
    private Integer readFlag;
}
