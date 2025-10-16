package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.CommentRequestDTO;
import com.reely.modules.interaction.entity.Comment;

public interface CommentService {
    Comment addComment(CommentRequestDTO commentRequestDTO);
    Comment getCommentById(Long commentId);
    Comment updateComment(CommentRequestDTO commentRequestDTO);
    void deleteComment(CommentRequestDTO commentRequestDTO);
}
