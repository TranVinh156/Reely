package com.reely.modules.interaction.dto;

import com.reely.modules.interaction.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDTO {
    private String id;
    private String username;
    private String comment;
    private String avatarUrl;
    private String timestamp;
    private Integer replyCount;
    private String usernameReplied;
    private String rootCommentId;

    public CommentResponseDTO(Comment comment) {
        this.id = comment.getId().toString();
        this.username = comment.getUser().getUsername();
        this.comment = comment.getText();
        this.avatarUrl = comment.getUser().getAvatarUrl();
        this.timestamp = comment.getCreated_at().toString();
        this.replyCount = comment.getReplyCount();
        if (comment.getReplyToComment() != null) {
            this.usernameReplied = comment.getReplyToComment().getUser().getUsername();
        }
        if (comment.getRootComment() != null) {
            this.rootCommentId = comment.getRootComment().getId().toString();
        }
    }
}