package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.CommentRequestDTO;
import com.reely.modules.interaction.dto.CommentResponseDTO;
import com.reely.modules.interaction.dto.PaginationResponse;
import com.reely.modules.interaction.entity.Comment;


import java.util.List;

public interface CommentService {
    Comment addComment(CommentRequestDTO commentRequestDTO);
    Comment getCommentById(Long commentId);
    PaginationResponse<CommentResponseDTO> getCommentsByVideoId(Long videoId, int page, int size);
    PaginationResponse<CommentResponseDTO> getRepliesByRootCommentId(Long userId, int page, int size);
    Comment updateCommentById(Long commentId, CommentRequestDTO commentRequestDTO);
    void deleteCommentById(Long commentId);
}
