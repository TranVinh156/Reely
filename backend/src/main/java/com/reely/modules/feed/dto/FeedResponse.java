package com.reely.modules.feed.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @Builder
@NoArgsConstructor @AllArgsConstructor
public class FeedResponse {
    private int page;
    private int size;
    private long totalElements;
    private List<FeedVideoDTO> content;
}
