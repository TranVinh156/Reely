package com.reely.modules.interaction.dto;

import com.reely.modules.interaction.enums.ReportStatus;
import com.reely.modules.interaction.enums.TargetType;
import lombok.Builder;
import lombok.Data;

import java.lang.annotation.Target;

@Data
@Builder
public class ReportRequestDto {
    private Long reporterId;
    private TargetType targetType;
    private ReportStatus status;
    private Long targetId;
    private String reason;
}
