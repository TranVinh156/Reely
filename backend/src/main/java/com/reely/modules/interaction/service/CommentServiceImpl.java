package com.reely.modules.interaction.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.reely.config.RabbitMQConfig;
import com.reely.modules.interaction.dto.CommentRequestDto;
import com.reely.modules.interaction.dto.CommentResponseDto;
import com.reely.modules.interaction.dto.PaginationResponse;
import com.reely.modules.interaction.entity.Comment;
import com.reely.modules.interaction.repository.CommentRepository;
import com.reely.modules.notification.dto.NotificationRequestDto;
import com.reely.modules.notification.enums.NotificationType;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.repository.UserRepository;
import com.reely.modules.video.VideoRepository;
import com.reely.modules.video.entity.Video;
import jakarta.transaction.Transactional;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;
    private final RabbitTemplate rabbitTemplate;

    public CommentServiceImpl(CommentRepository commentRepository, UserRepository userRepository, VideoRepository videoRepository, RabbitTemplate rabbitTemplate) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    @Transactional
    public CommentResponseDto addComment(CommentRequestDto commentRequestDTO) {
        Optional<User> user = userRepository.findById(commentRequestDTO.getUserId());
        Optional<Video> video = videoRepository.findById(commentRequestDTO.getVideoId());
        Comment rootComment = null;
        Comment replyToComment = null;

        if (commentRequestDTO.getRootCommentId() != null) {
            rootComment = getCommentById(commentRequestDTO.getRootCommentId());
            rootComment.setReplyCount(rootComment.getReplyCount() + 1);
        }

        if (commentRequestDTO.getReplyToCommentId() != null) {
            replyToComment = getCommentById(commentRequestDTO.getReplyToCommentId());
        }

        if (user.isPresent() && video.isPresent()) {
            Comment comment =  commentRepository.save(
                    Comment.builder()
                            .user(user.get())
                            .video(video.get())
                            .createdAt(Instant.now())
                            .updatedAt(Instant.now())
                            .rootComment(rootComment)
                            .text(commentRequestDTO.getText())
                            .replyToComment(replyToComment)
                            .replyCount(0)
                            .deletedFlag(0)
                            .build()

            );

            if (!user.get().getId().equals(video.get().getUserId())) {
                publishCommentNotification(comment, user.get(), video.get());
            }
            return new CommentResponseDto(comment);
        } else {
            throw new RuntimeException("Invalid request");
        }
    }

    public Comment getCommentById(Long commentId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isPresent()) {
            return comment.get();
        } else {
            throw new RuntimeException("not found comment");
        }

    }

    public PaginationResponse<CommentResponseDto> getCommentsByVideoId(Long videoId, int page, int size) {
        Page<Comment> commentsPage = commentRepository.findByVideo_IdAndRootCommentIsNull(videoId, PageRequest.of(page, size));
        List<Comment> comments = commentsPage.getContent();

        return new PaginationResponse<>(
                page,
                size,
                commentsPage.getTotalPages(),
                commentsPage.getTotalElements(),
                comments.stream().map(comment -> new CommentResponseDto(comment)).toList()
        );

    }

    public PaginationResponse<CommentResponseDto> getRepliesByRootCommentId(Long commentId, int page, int size) {
        Page<Comment> repliesPage = commentRepository.findByRootComment_IdOrderByCreatedAtDesc(commentId, PageRequest.of(page, size));
        List<Comment> replies = repliesPage.getContent();

        return new PaginationResponse<>(
                page,
                size,
                repliesPage.getTotalPages(),
                repliesPage.getTotalElements(),
                replies.stream().map(comment -> new CommentResponseDto(comment)).toList()
        );
    }

    @Transactional
    public Comment updateCommentById(Long commentId, CommentRequestDto commentRequestDTO) {
        return commentRepository.findById(commentId)
                .map(commentInDb -> {
                    if(commentRequestDTO.getText() != null && !commentRequestDTO.getText().isEmpty()) {
                        commentInDb.setText(commentRequestDTO.getText());
                        commentInDb.setUpdatedAt(Instant.now());
                    }
                    return  commentRepository.save(commentInDb);
                })
                .orElseThrow(() ->  new RuntimeException("comment not found"));
    }

    @Transactional
    public void deleteCommentById(Long commentId) {
        Comment comment = getCommentById(commentId);
        if (comment.getRootComment() != null) {
            Comment rootComment = comment.getRootComment();
            rootComment.setReplyCount(rootComment.getReplyCount() - 1);
            commentRepository.save(rootComment);
        } else {
            List<Comment> childComments = commentRepository.findByRootComment_IdOrderByCreatedAtDesc(commentId, PageRequest.of(0, 10)).getContent();
            childComments.forEach((childComment) -> {
                commentRepository.delete(childComment);
            }) ;
        }

        commentRepository.deleteById(commentId);
    }

    private void publishCommentNotification(Comment comment, User user, Video video) {
        try {
            String content = "";
            Comment replyComment= comment.getReplyToComment();
            if (comment.getReplyToComment() != null) {
                content = "đã trả lời bình luận của bạn: " + comment.getText();
            } else {
                content = "đã bình luận: " + comment.getText();
            }
            ObjectMapper mapper = new ObjectMapper();

            Map<String, Object> payloadMap = Map.of(
                    "actorId", user.getId(),
                    "actorUsername", user.getUsername(),
                    "actorAvatar", user.getAvatarUrl(),
                    "message", content,
                    "videoId", video.getId(),
                    "commentId", comment.getId(),
                    "replyCommentId", replyComment != null ? replyComment.getId() : -1
            );

            String payload = mapper.writeValueAsString(payloadMap);

            NotificationRequestDto notificationRequestDto = NotificationRequestDto.builder()
                    .type(NotificationType.COMMENT)
                    .userId(video.getUserId())
                    .readFlag(0)
                    .payload(payload)
                    .build();
            this.rabbitTemplate.convertAndSend(
                    RabbitMQConfig.COMMENT_EXCHANGE,
                    RabbitMQConfig.COMMENT_ROUTING_KEY,
                    notificationRequestDto);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

}
