package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.CommentRequestDTO;
import com.reely.modules.interaction.dto.CommentResponseDTO;
import com.reely.modules.interaction.dto.PaginationResponse;
import com.reely.modules.interaction.entity.Comment;
import com.reely.modules.interaction.repository.CommentRepository;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.service.UserService;
import com.reely.modules.video.VideoService;
import com.reely.modules.video.entity.Video;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final UserService userService;
    private final VideoService videoService;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository, UserService userService, VideoService videoService) {
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.videoService = videoService;
    }

    public CommentResponseDTO addComment(CommentRequestDTO commentRequestDTO) {
        User user = userService.getUserById(commentRequestDTO.getUserId());
        Video video = videoService.getVideoById(commentRequestDTO.getVideoId());
        Comment rootComment = null;
        Comment replyToComment = null;

        if (commentRequestDTO.getRootCommentId() != null) {
            rootComment = getCommentById(commentRequestDTO.getRootCommentId());
            rootComment.setReplyCount(rootComment.getReplyCount() + 1);
        }

        if (commentRequestDTO.getReplyToCommentId() != null) {
            replyToComment = getCommentById(commentRequestDTO.getReplyToCommentId());
        }



        Comment comment =  commentRepository.save(
                Comment.builder()
                        .user(user)
                        .video(video)
                        .created_at(Instant.now())
                        .updated_at(Instant.now())
                        .rootComment(rootComment)
                        .text(commentRequestDTO.getText())
                        .replyToComment(replyToComment)
                        .replyCount(0)
                        .deleted_flag(0)
                        .build()
        );

        return new  CommentResponseDTO(comment);
    }

    public Comment getCommentById(Long commentId) {
        Optional<Comment> comment = commentRepository.findById(commentId);
        if (comment.isPresent()) {
            return comment.get();
        } else {
            throw new RuntimeException("not found comment");
        }

    }

    public PaginationResponse<CommentResponseDTO> getCommentsByVideoId(Long videoId, int page, int size) {
        Page<Comment> commentsPage = commentRepository.findByVideo_IdAndRootCommentIsNull(videoId, PageRequest.of(page, size));
        List<Comment> comments = commentsPage.getContent();


        return new PaginationResponse<>(
                page,
                size,
                commentsPage.getTotalPages(),
                commentsPage.getTotalElements(),
                comments.stream().map(comment -> new CommentResponseDTO(comment)).toList()
        );

    }

    public PaginationResponse<CommentResponseDTO> getRepliesByRootCommentId(Long commentId, int page, int size) {
        Page<Comment> repliesPage = commentRepository.findByRootComment_Id(commentId, PageRequest.of(page, size));
        List<Comment> replies = repliesPage.getContent();

        return new PaginationResponse<>(
                page,
                size,
                repliesPage.getTotalPages(),
                repliesPage.getTotalElements(),
                replies.stream().map(comment -> new CommentResponseDTO(comment)).toList()
        );
    }

    public Comment updateCommentById(Long commentId, CommentRequestDTO commentRequestDTO) {
        return commentRepository.findById(commentId)
                .map(commentInDb -> {
                    if(commentRequestDTO.getText() != null && !commentRequestDTO.getText().isEmpty()) {
                        commentInDb.setText(commentRequestDTO.getText());
                        commentInDb.setUpdated_at(Instant.now());
                    }
                    return  commentRepository.save(commentInDb);
                })
                .orElseThrow(() ->  new RuntimeException("comment not found"));
    }


    public void deleteCommentById(Long commentId) {
        commentRepository.deleteById(commentId);
    }

}
