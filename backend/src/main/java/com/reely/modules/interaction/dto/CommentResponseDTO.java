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
    private Long id;
    private String text;
    private String userName;
    private Instant created_at;
    private Instant updated_at;

    public CommentResponseDTO(Comment comment) {
        this.id = comment.getId();
        this.text = comment.getText();
        this.userName = comment.getUser().getUsername();
        this.created_at = comment.getCreated_at();
        this.updated_at = comment.getUpdated_at();
    }
}