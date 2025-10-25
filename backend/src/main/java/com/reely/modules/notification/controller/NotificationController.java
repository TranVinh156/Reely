package com.reely.modules.notification;

import com.reely.modules.notification.dto.NotificationRequestDto;
import com.reely.modules.notification.dto.NotificationResponseDto;
import com.reely.modules.notification.dto.PaginationResponse;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

@Repository
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponseDto> addNotification(@RequestBody NotificationRequestDto notificationRequestDTO) {
        return ResponseEntity.ok(notificationService.addNotification(notificationRequestDTO));
    }

    @GetMapping
    public PaginationResponse<NotificationResponseDto> getNotificationById(
            @RequestParam Long videoId,
            @RequestParam int page,
            @RequestParam int size
    ) {
        return notificationService.getNotificationsByUserId(videoId, page, size);
    }

    @PutMapping
    public ResponseEntity<NotificationResponseDto> updateNotificationById(
            @RequestParam Long notificationId,
            @RequestBody NotificationRequestDto notificationRequestDTO
    ) {
        NotificationResponseDto response = notificationService.updateNotificationById(notificationId, notificationRequestDTO);
        return  ResponseEntity.ok(response);
    }

    @DeleteMapping("/{notificationId}")
    public void deleteNotificationById(@PathVariable Long notificationId) {
        notificationService.deleteNotificationById(notificationId);
    }


}
