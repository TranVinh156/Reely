package com.reely.modules.interaction.entity;

import jakarta.persistence.*;
import lombok.*;
import org.w3c.dom.Text;

import java.time.Instant;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id", referencedColumnName = "id")
    private Video video;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id" , referencedColumnName = "id")
    private Comment parentCommnent;

    private Integer deleted_flag;
    private String text;
    private Instant created_at;
    private Instant updated_at;


    @PrePersist
    public void prePersist() {
        created_at = Instant.now();
        updated_at = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        updated_at = Instant.now();
    }



}
