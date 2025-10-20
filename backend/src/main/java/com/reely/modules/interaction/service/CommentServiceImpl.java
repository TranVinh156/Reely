package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.CommentRequestDTO;
import com.reely.modules.interaction.dto.CommentResponseDTO;
import com.reely.modules.interaction.dto.PaginationResponse;
import com.reely.modules.interaction.entity.Comment;
import com.reely.modules.interaction.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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

    public Comment addComment(CommentRequestDTO commentRequestDTO) {
        User user = userService.getUserById(commentRequestDTO.getUserId());
        Video video = videoService.getVideobyId(commentRequestDTO.getVideoId());
        Comment rootComment = commentRepository.findById(commentRequestDTO.getRootCommentId()).get();


        return commentRepository.save(
                Comment.builder()
                        .user(user)
                        .video(video)
                        .created_at(Instant.now())
                        .updated_at(Instant.now())
                        .rootCommnent(rootComment)
                        .text(commentRequestDTO.getText())
                        .deleted_flag(0)
                        .build()
        );
    }

    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId).orElseThrow(() -> new RuntimeException("Comment not found!"));
    }

    public PaginationResponse<CommentResponseDTO> getCommentsByVideoId(Long videoId, int page, int size) {
        Page<Comment> commentsPage = commentRepository.findByVideo_IdAndRootCommnentIsNull(videoId, PageRequest.of(page, size));
        List<Comment> comments = commentsPage.getContent();

        return new PaginationResponse<>(
                commentsPage.getNumber(),
                commentsPage.getSize(),
                commentsPage.getTotalPages(),
                commentsPage.getTotalElements(),
                comments.stream().map(comment -> new CommentResponseDTO(comment)).toList()
        );

//        return PaginationResponse.<CommentResponseDTO>builder()
//                .pageSize(size)
//                .pageNumber(page)
//                .totalPages(commentsPage.getTotalPages())
//                .totalElements(commentsPage.getTotalElements())
//                .data(comments.stream().map(comment -> CommentResponseDTO.builder()
//                        .id(comment.getId())
//                        .userName(comment.getUser().getUserName())
//                        .text(comment.getText())
//                        .created_at(comment.getCreated_at())
//                        .updated_at(comment.getUpdated_at())
//                        .replies(commentRepository.findByRootComment_Id(comment.getId())
//                                .stream()
//                                .map(reply -> CommentResponseDTO.builder()
//                                        .id(reply.getId())
//                                        .userName(reply.getUser().getUserName())
//                                        .text(reply.getText())
//                                        .created_at(reply.getCreated_at())
//                                        .updated_at(reply.getUpdated_at())
//                                        .replies(null)
//                                        .build()).toList())
//                        .build()).toList())
//                .build();

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
