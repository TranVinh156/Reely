package com.reely.modules.notification.dto;

import com.reely.modules.notification.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponseDto {
    private String id;
    private String username;
    private String payload;
    private String timestamp;
    private String type;
    private String avatarUrl;


    public NotificationResponseDto(Notification notification) {
        this.id = notification.getId().toString();
        this.username = notification.getUser().getUsername();
        this.payload = notification.getPayload();
        this.avatarUrl = notification.getUser().getAvatarUrl();
        this.timestamp = notification.getCreatedAt().toString();
        this.type = notification.getType().toString().toLowerCase();
    }

}
