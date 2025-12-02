package com.reely.modules.interaction.controller;

import com.reely.modules.interaction.dto.PaginationResponse;
import com.reely.modules.interaction.dto.ReportRequestDto;
import com.reely.modules.interaction.dto.ReportResponseDto;
import com.reely.modules.interaction.entity.Report;
import com.reely.modules.interaction.enums.ReportStatus;
import com.reely.modules.interaction.repository.CommentRepository;
import com.reely.modules.interaction.service.ReportService;
import com.reely.modules.user.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {
    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ReportResponseDto createReport(@RequestBody ReportRequestDto reportRequestDto) {
        return reportService.addReport(reportRequestDto);
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<ReportResponseDto>> getAllReport(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reportService.getAllReport(page, size));
    }

    @GetMapping("/status")
    public ResponseEntity<PaginationResponse<ReportResponseDto>> getAllReportByStatus(
            @RequestParam ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reportService.getAllReportByStatus(status, page, size));
    }

    @PutMapping
    public ReportResponseDto updateReport(
            @RequestParam Long id,
            @RequestParam ReportStatus reportStatus
    ) {
        return reportService.updateReportStatus(id, reportStatus);
    }

    @DeleteMapping("/{id}")
    public void deleteReport(
            @PathVariable Long id
    ) {
        reportService.deleteReport(id);
    }
}
