package com.reely.modules.upload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoChunkInitRespone {
    private String uploadId;
    private String objectName;
    /** /videos/<objectName> */
    private String fileUrl;
    private Long chunkSize;
}
