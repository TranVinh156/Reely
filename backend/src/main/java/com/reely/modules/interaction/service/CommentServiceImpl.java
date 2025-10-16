package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.CommentRequestDTO;
import com.reely.modules.interaction.entity.Comment;
import com.reely.modules.interaction.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;

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
        Comment parentComment = commentRepository.findById(commentRequestDTO.getParentCommentId()).get();


        return commentRepository.save(
                Comment.builder()
                        .user(user)
                        .video(video)
                        .created_at(Instant.now())
                        .updated_at(Instant.now())
                        .parentCommnent(parentComment)
                        .text(commentRequestDTO.getText())
                        .deleted_flag(0)
                        .build()
        );
    }

    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId).orElseThrow(() -> new RuntimeException("Comment not found!"));
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
