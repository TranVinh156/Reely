package com.reely.modules.user.entity;

import java.time.Instant;
import java.util.List;

import com.reely.modules.user.entity.enums.RoleName;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PostUpdate;
import jakarta.persistence.PrePersist;
import lombok.Data;

@Entity
@Data
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoleName name;

    private String description;

    private Instant createdAt;

    private Instant updatedAt;

    @OneToMany(mappedBy = "role")
    private List<User> users;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdAt = Instant.now();
    }

    @PostUpdate
    public void handleAfterUpdate() {
        this.updatedAt = Instant.now();
    }
}
