package com.reely.modules.interaction.repository;

import com.reely.modules.interaction.dto.ReportResponseDto;
import com.reely.modules.interaction.entity.Report;
import com.reely.modules.interaction.enums.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    Page<Report> findAllByStatus(ReportStatus status, Pageable pageable);
}
