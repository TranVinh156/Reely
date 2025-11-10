package com.reely.modules.notification.controller;

import com.reely.modules.notification.service.NotificationService;
import com.reely.modules.notification.dto.NotificationRequestDto;
import com.reely.modules.notification.dto.NotificationResponseDto;
import com.reely.modules.notification.dto.PaginationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.async.DeferredResult;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponseDto> addNotification(@RequestBody NotificationRequestDto notificationRequestDTO) {
        return ResponseEntity.ok(notificationService.addNotification(notificationRequestDTO));
    }

    @GetMapping("/polling")
    public DeferredResult<ResponseEntity<List<NotificationResponseDto>>> getPolling(@RequestParam Long userId, @RequestParam Long lastNotificationId) {
        DeferredResult<ResponseEntity<List<NotificationResponseDto>>> deferredResult = new DeferredResult<>(30000L, "No data yet");

        deferredResult.onTimeout(() -> {
            deferredResult.setResult(ResponseEntity.ok(List.of()));
        });

        deferredResult.onCompletion(() -> {
        });

        notificationService.addPollingRequest(userId, lastNotificationId, deferredResult);

        return deferredResult;
    }

    @GetMapping
    public PaginationResponse<NotificationResponseDto> getNotificationByUserId(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return notificationService.getNotificationsByUserId(userId, page, size);
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
