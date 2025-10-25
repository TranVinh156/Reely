package com.reely.modules.notification;

import com.reely.modules.notification.dto.NotificationRequestDto;
import com.reely.modules.notification.dto.NotificationResponseDto;
import com.reely.modules.notification.dto.PaginationResponse;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserService userService;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }

    @Transactional
    public NotificationResponseDto addNotification(NotificationRequestDto notificationRequestDTO) {
        User user = userService.getUserById(notificationRequestDTO.getUserId());
        Notification notification = Notification.builder()
                .user(user)
                .type(notificationRequestDTO.getType())
                .payload(notificationRequestDTO.getPayload())
                .build();
        notificationRepository.save(notification);

        return new NotificationResponseDto(notification);
    }

    @Transactional
    public NotificationResponseDto updateNotificationById(Long notificationId, NotificationRequestDto notificationRequestDTO) {

        Notification updatedNotification =  notificationRepository.findById(notificationId)
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

        return new NotificationResponseDto(updatedNotification);
    }

    public Notification getNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public PaginationResponse<NotificationResponseDto> getNotificationsByUserId(Long userId, int page, int size) {
        Page<Notification> notificationPage = notificationRepository.findByUser_Id(userId, PageRequest.of(page, size));
        List<Notification> notifications = notificationPage.getContent();

        List<NotificationResponseDto> notificationResponseDtos = notifications
                .stream()
                .map((notification) -> new NotificationResponseDto(notification))
                .toList();

        return new PaginationResponse<NotificationResponseDto>(
                page,
                size,
                notificationPage.getTotalPages(),
                notificationPage.getTotalElements(),
                notificationResponseDtos
        );

    }

    @Transactional
    public void  deleteNotificationById(Long notificationId) {
        try {
            notificationRepository.deleteById(notificationId);
        } catch (RuntimeException e) {
            throw new RuntimeException("Delete notification failed");
        }
    }
}
