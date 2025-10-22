package com.reely.modules.interaction.controller;

import com.reely.modules.interaction.dto.CommentRequestDTO;
import com.reely.modules.interaction.dto.CommentResponseDTO;
import com.reely.modules.interaction.dto.PaginationResponse;
import com.reely.modules.interaction.entity.Comment;
import com.reely.modules.interaction.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/comments")
public class CommentController {
    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public Comment addComment(@RequestBody CommentRequestDTO commentRequestDTO) {
        return commentService.addComment(commentRequestDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponseDTO> getCommentById(@PathVariable Long id) {
        CommentResponseDTO comment = commentService.getCommentById(id);
        return ResponseEntity.ok(comment);
    }


    @GetMapping("/video")
    public ResponseEntity<PaginationResponse<CommentResponseDTO>> getRootCommentByVideoId(
            @RequestParam Long videoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PaginationResponse<CommentResponseDTO> response = commentService.getCommentsByVideoId(videoId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rootcomment")
    public ResponseEntity<PaginationResponse<CommentResponseDTO>> getRepliesByRootCommentId(
            @RequestParam Long rootCommentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PaginationResponse<CommentResponseDTO> response = commentService.getRepliesByRootCommentId(rootCommentId, page, size);
        return ResponseEntity.ok(response);
    }
}
