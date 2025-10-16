package com.reely.modules.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    public Notification addNotification(NotificationRequestDTO notificationRequestDTO) {
        User user = userService.getUserById(notificationRequestDTO.getUserId());
        return Notification.builder()
                .user(user)
                .type(notificationRequestDTO.getType())
                .payload(notificationRequestDTO.getPayload())
                .readFlag(0)
                .createdAt(Instant.now())
                .build();
    }

    public Notification updateNotificationById(Long notificationId, NotificationRequestDTO notificationRequestDTO) {
        return notificationRepository.findById(notificationId)
                .map(notificationInDb -> {
                    if (notificationRequestDTO.getPayload() != null) {
                        notificationInDb.setPayload(notificationRequestDTO.getPayload());
                    }
                    if (notificationRequestDTO.getReadFlag() != null) {
                        notificationInDb.setReadFlag(notificationRequestDTO.getReadFlag());
                    }
                    return notificationRepository.save(notificationInDb);
                })
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public Notification getNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public void  deleteNotificationById(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
