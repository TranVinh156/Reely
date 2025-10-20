package com.reely.modules.interaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class CommentRequestDTO {
    private Long videoId;
    private Long rootCommentId;
    private Long userId;
    private String text;
}
