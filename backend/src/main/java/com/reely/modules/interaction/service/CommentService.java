package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.CommentRequestDto;
import com.reely.modules.interaction.dto.CommentResponseDto;
import com.reely.modules.interaction.dto.CommentStat;
import com.reely.modules.interaction.dto.PaginationResponse;
import com.reely.modules.interaction.entity.Comment;

import java.time.LocalDate;
import java.util.List;

public interface CommentService {
    CommentResponseDto addComment(CommentRequestDto commentRequestDTO);
    Comment getCommentById(Long commentId);
    PaginationResponse<CommentResponseDto> getCommentsByVideoId(Long videoId, int page, int size);
    PaginationResponse<CommentResponseDto> getRepliesByRootCommentId(Long userId, int page, int size);
    Comment updateCommentById(Long commentId, CommentRequestDto commentRequestDTO);
    List<CommentStat> countCommentsByUserIdAndDate(Long userId, Long days);
    void deleteCommentById(Long commentId);
}
