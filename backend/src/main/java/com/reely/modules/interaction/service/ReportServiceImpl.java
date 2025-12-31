package com.reely.modules.interaction.service;

import com.reely.modules.feed.entity.Video;
import com.reely.modules.feed.repository.VideoRepository;
import com.reely.modules.interaction.dto.PaginationResponse;
import com.reely.modules.interaction.dto.ReportRequestDto;
import com.reely.modules.interaction.dto.ReportResponseDto;
import com.reely.modules.interaction.entity.Comment;
import com.reely.modules.interaction.entity.Report;
import com.reely.modules.interaction.enums.ReportStatus;
import com.reely.modules.interaction.enums.TargetType;
import com.reely.modules.interaction.repository.CommentRepository;
import com.reely.modules.interaction.repository.ReportRepository;
import com.reely.modules.user.entity.User;
import com.reely.modules.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Service
public class ReportServiceImpl implements ReportService {
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final VideoRepository videoRepository;

    public ReportServiceImpl(ReportRepository reportRepository, UserRepository userRepository, VideoRepository videoRepository, CommentRepository commentRepository, RestClient.Builder builder) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.videoRepository = videoRepository;
        this.commentRepository = commentRepository;
    }


    @Transactional
    public ReportResponseDto addReport(ReportRequestDto reportRequestDto) {
        Optional<User> user = userRepository.findById(reportRequestDto.getReporterId());

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        if (reportRequestDto.getTargetType() == TargetType.VIDEO) {
            Optional<Video> target = videoRepository.findById(reportRequestDto.getTargetId());
            if (target.isEmpty()) {
                throw new RuntimeException("Video not found");
            }
        } else if (reportRequestDto.getTargetType() == TargetType.COMMENT) {
            Optional<Comment> target = commentRepository.findById(reportRequestDto.getTargetId());
            if (target.isEmpty()) {
                throw new RuntimeException("Comment not found");
            }
        } else {
            throw new RuntimeException("Invalid target type");
        }

        Report report = Report.builder()
                .reporter(user.get())
                .targetType(reportRequestDto.getTargetType())
                .targetId(reportRequestDto.getTargetId())
                .status(ReportStatus.PENDING)
                .reason(reportRequestDto.getReason())
                .build();

        reportRepository.save(report);

        return new ReportResponseDto(report);
    }

    public Report getReportById(Long id) {
        Optional<Report> report = reportRepository.findById(id);
        if (report.isEmpty()) {
            throw new RuntimeException("Report not found");
        }
        return report.get();
    }


    public PaginationResponse<ReportResponseDto> getAllReport(int page, int size) {
        Page<Report> reports = reportRepository.findAll(PageRequest.of(page, size));

        return new PaginationResponse<>(
                page,
                size,
                reports.getTotalPages(),
                reports.getTotalElements(),
                reports.stream().map(report -> new ReportResponseDto(report)).toList()
        );
    }

    public PaginationResponse<ReportResponseDto> getAllReportByStatus(ReportStatus status, int page, int size) {
        Page<Report> reports = reportRepository.findAllByStatus(status, PageRequest.of(page, size));

        return  new PaginationResponse<>(
                page,
                size,
                reports.getTotalPages(),
                reports.getTotalElements(),
                reports.stream().map(report -> new ReportResponseDto(report)).toList()
        );
    }

    @Transactional
    public void deleteReport(Long id) {
        Report report = getReportById(id);
        reportRepository.delete(report);
    }

    @Transactional
    public ReportResponseDto updateReportStatus(Long id, ReportStatus reportStatus) {
        Report report = getReportById(id);
        report.setStatus(reportStatus);
        reportRepository.save(report);

        return new ReportResponseDto(report);
    }




}
