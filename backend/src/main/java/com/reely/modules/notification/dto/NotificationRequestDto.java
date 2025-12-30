package com.reely.modules.notification.dto;

import com.reely.modules.notification.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequestDto {
    private Long userId;
    private NotificationType type;
    private String payload;
    private Integer readFlag = 0;
}
