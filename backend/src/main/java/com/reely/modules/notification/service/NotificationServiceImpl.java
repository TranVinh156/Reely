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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.async.DeferredResult;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final Map<Long, List<PendingRequest>> pendingRequests = new ConcurrentHashMap<>();

    private static class PendingRequest {
        final Long lastNotificationId;
        final DeferredResult<ResponseEntity<List<NotificationResponseDto>>> deferredResult;
        final Instant timestamp;

        PendingRequest(Long lastNotificationId,
                       DeferredResult<ResponseEntity<List<NotificationResponseDto>>> deferredResult) {
            this.lastNotificationId = lastNotificationId;
            this.deferredResult = deferredResult;
            this.timestamp = Instant.now();
        }
    }

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
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
            NotificationResponseDto response = addNotification(notificationRequestDto);
            notifyPendingRequests(notificationRequestDto.getUserId(), response);
        } catch (Exception e) {
            System.out.println("Error in handle comment notification");
        }
    }

    @RabbitListener(queues = RabbitMQConfig.LIKE_QUEUE)
    @Transactional
    public void handleLikeNotification(NotificationRequestDto notificationRequestDto) {
        try {
            NotificationResponseDto response = addNotification(notificationRequestDto);
            notifyPendingRequests(notificationRequestDto.getUserId(), response);
        } catch (Exception e) {
            System.out.println("Error in handle like notification");
        }
    }

    @Transactional
    public void addPollingRequest(Long userId, Long lastNotificationId, DeferredResult<ResponseEntity<List<NotificationResponseDto>>> deferredResult) {
        List<Notification> newNotifications = getNewNotifications(userId, lastNotificationId);

        if (!newNotifications.isEmpty()) {
            List<NotificationResponseDto> dtos = newNotifications.stream().map(notification -> new NotificationResponseDto(notification)).toList();
            deferredResult.setResult(ResponseEntity.ok(dtos));
        } else {
            PendingRequest pendingRequest = new PendingRequest(lastNotificationId, deferredResult);

            List<PendingRequest> userPendingRequests = pendingRequests.get(userId);
            if (userPendingRequests == null) {
                userPendingRequests = new CopyOnWriteArrayList<>();
                pendingRequests.put(userId, userPendingRequests);
            }
            userPendingRequests.add(pendingRequest);

            deferredResult.onCompletion(() -> {
                removePendingRequest(userId, pendingRequest);
            });
        }
    }



    private List<Notification> getNewNotifications(Long userId, Long lastNotificationId) {
        if (lastNotificationId != null) {
            return notificationRepository.findByUser_IdAndIdGreaterThanOrderByCreatedAtDesc(
                    userId, lastNotificationId
            );
        }

        return List.of();
    }

    @Async
    public void notifyPendingRequests(Long userId, NotificationResponseDto notificationResponseDto) {
        List<PendingRequest> requests = pendingRequests.get(userId);

        if (requests == null || requests.isEmpty()) {
            return;
        }

        requests.forEach(pendingRequest -> {
            if (pendingRequest.lastNotificationId == null ||
                Long.parseLong(notificationResponseDto.getId()) > pendingRequest.lastNotificationId) {

                pendingRequest.deferredResult.setResult(
                        ResponseEntity.ok(List.of(notificationResponseDto)));
            }
        });
        pendingRequests.remove(userId);
    }

    private void removePendingRequest(Long userId, PendingRequest pendingRequest) {
        List<PendingRequest> requests = pendingRequests.get(userId);
        if (requests != null) {
            requests.remove(pendingRequest);
            if (requests.isEmpty()) {
                pendingRequests.remove(userId);
            }
        }
    }

    private NotificationResponseDto mapToDto(Notification notification) {
        return new NotificationResponseDto(notification);
    }



}
