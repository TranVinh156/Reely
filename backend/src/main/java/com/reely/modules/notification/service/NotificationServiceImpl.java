package com.reely.modules.notification.service;

import com.reely.config.RabbitMQConfig;
import com.reely.modules.notification.dto.NotificationRequestDto;
import com.reely.modules.notification.dto.NotificationResponseDto;
import com.reely.modules.notification.dto.PaginationResponse;
import com.reely.modules.notification.entity.Notification;
import com.reely.modules.notification.repository.NotificationRepository;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.repository.UserRepository;
import com.reely.modules.user.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.endpoint.invoke.ParameterValueMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ParameterValueMapper parameterValueMapper;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository, ParameterValueMapper parameterValueMapper) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.parameterValueMapper = parameterValueMapper;
    }

    @Transactional
    public NotificationResponseDto addNotification(NotificationRequestDto notificationRequestDTO) {
        Optional<User> user = userRepository.findById(notificationRequestDTO.getUserId());
        if(user.isPresent()) {
            Notification notification = Notification.builder()
                    .user(user.get())
                    .type(notificationRequestDTO.getType())
                    .payload(notificationRequestDTO.getPayload())
                    .build();
            notificationRepository.save(notification);

            return new NotificationResponseDto(notification);
        } else {
            throw new RuntimeException("Invalid request");
        }

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

    @RabbitListener(queues = RabbitMQConfig.COMMENT_QUEUE)
    @Transactional
    public void handleCommentNotification(NotificationRequestDto notificationRequestDto) {
        try {
            addNotification(notificationRequestDto);
        } catch (Exception e) {
            System.out.println("Error in handle comment notification");
        }
    }

    @RabbitListener(queues = RabbitMQConfig.LIKE_QUEUE)
    @Transactional
    public void handleLikeNotification(NotificationRequestDto notificationRequestDto) {
        try {
            addNotification(notificationRequestDto);
        } catch (Exception e) {
            System.out.println("Error in handle like notification");
        }
    }
}
