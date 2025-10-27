package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.CommentRequestDto;
import com.reely.modules.interaction.dto.CommentResponseDto;
import com.reely.modules.interaction.dto.PaginationResponse;
import com.reely.modules.interaction.entity.Comment;

public interface CommentService {
    CommentResponseDto addComment(CommentRequestDto commentRequestDTO);
    Comment getCommentById(Long commentId);
    PaginationResponse<CommentResponseDto> getCommentsByVideoId(Long videoId, int page, int size);
    PaginationResponse<CommentResponseDto> getRepliesByRootCommentId(Long userId, int page, int size);
    Comment updateCommentById(Long commentId, CommentRequestDto commentRequestDTO);
    void deleteCommentById(Long commentId);
}
