package com.reely.modules.upload.dto;

import lombok.Data;

@Data
public class PresignedUrlRequest {
    private String bucketName;

    private String fileName;
}
