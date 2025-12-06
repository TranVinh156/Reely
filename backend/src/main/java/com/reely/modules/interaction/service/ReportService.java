package com.reely.modules.interaction.service;

import com.reely.modules.interaction.dto.PaginationResponse;
import com.reely.modules.interaction.dto.ReportRequestDto;
import com.reely.modules.interaction.dto.ReportResponseDto;
import com.reely.modules.interaction.entity.Report;
import com.reely.modules.interaction.enums.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportService {
    ReportResponseDto addReport(ReportRequestDto reportRequestDto);
    Report getReportById(Long id);
    PaginationResponse<ReportResponseDto> getAllReport(int page, int size);
    PaginationResponse<ReportResponseDto> getAllReportByStatus(ReportStatus status, int page, int size);
    ReportResponseDto updateReportStatus(Long id, ReportStatus reportStatus);
    void deleteReport(Long id);
}
