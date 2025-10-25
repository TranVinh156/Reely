package com.reely.modules.interaction.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentRequestDto {
    private Long videoId;
    private Long rootCommentId;
    private Long userId;
    private String text ;
    private Long replyToCommentId;
}
