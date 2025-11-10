package com.reely.modules.user.entity;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.reely.modules.user.entity.enums.RoleName;

import jakarta.persistence.*;
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

    @JsonIgnore
    @OneToMany(mappedBy = "role")
    private List<User> users;

    @PrePersist
    public void handleBeforeCreate() {
        this.createdAt = Instant.now();
    }

    @PreUpdate
    public void handleAfterUpdate() {
        this.updatedAt = Instant.now();
    }
}
