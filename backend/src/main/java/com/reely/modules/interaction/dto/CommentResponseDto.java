package com.reely.modules.interaction.dto;

import com.reely.modules.interaction.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDto {
    private String id;
    private String ownerId;
    private String username;
    private String comment;
    private String avatarUrl;
    private String timestamp;
    private Integer replyCount;
    private String usernameReplied;
    private String rootCommentId;

    public CommentResponseDto(Comment comment) {
        this.id = comment.getId().toString();
        this.ownerId = comment.getUser().getId().toString();
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