package com.reely.modules.interaction.entity;

import com.reely.modules.interaction.enums.ReportStatus;
import com.reely.modules.interaction.enums.TargetType;
import com.reely.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Primary;

import java.lang.annotation.Target;
import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", referencedColumnName = "id")
    private User reporter;

    @Enumerated(EnumType.STRING)
    private TargetType targetType;

    private Long targetId;
    private String reason;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }


}
