package com.reely.modules.upload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoChunkCompleteRequest {
    private String uploadId;
    private String objectName;
    private int totalParts;
}
