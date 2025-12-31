package com.reely.modules.interaction.dto;

import com.reely.modules.interaction.entity.Report;
import com.reely.modules.interaction.enums.ReportStatus;
import com.reely.modules.interaction.enums.TargetType;
import com.reely.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponseDto {
    private Long id;
    private Long reporterId;
    private String reporterName;
    private String targetType;
    private Long targetId;
    private String reason;
    private ReportStatus status;
    private Instant createdAt;
    private Instant updatedAt;

    public ReportResponseDto(Report report) {
        this.id = report.getId();
        this.reporterName = report.getReporter().getUsername();
        this.reporterId = report.getReporter().getId();
        this.targetType = report.getTargetType().toString();
        this.targetId = report.getTargetId();
        this.reason = report.getReason();
        this.status = report.getStatus();
        this.createdAt = report.getCreatedAt();
        this.updatedAt = report.getUpdatedAt();
    }
}
