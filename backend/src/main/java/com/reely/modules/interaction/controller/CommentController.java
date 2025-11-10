package com.reely.modules.interaction.controller;

import com.reely.modules.interaction.dto.CommentRequestDto;
import com.reely.modules.interaction.dto.CommentResponseDto;
import com.reely.modules.interaction.dto.PaginationResponse;
import com.reely.modules.interaction.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public CommentResponseDto addComment(@RequestBody CommentRequestDto commentRequestDTO) {
        return commentService.addComment(commentRequestDTO);
    }

    @GetMapping("/video")
    public ResponseEntity<PaginationResponse<CommentResponseDto>> getCommentsByVideoId(
            @RequestParam Long videoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PaginationResponse<CommentResponseDto> response = commentService.getCommentsByVideoId(videoId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/replies")
    public ResponseEntity<PaginationResponse<CommentResponseDto>> getRepliesByRootCommentId(
            @RequestParam Long rootCommentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PaginationResponse<CommentResponseDto> response = commentService.getRepliesByRootCommentId(rootCommentId, page, size);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{commentId}")
    public void deleteCommentById(@PathVariable Long commentId) {
        commentService.deleteCommentById(commentId);
    }

}
