package com.reely.modules.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import com.reely.modules.user.entity.User;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Optional<User> findByRefreshToken(String refreshToken);

    List<User> findByUsername(String username);

    /**
     * Search users by username or displayName (accent-insensitive), with a simple relevance ordering.
     */
    @Query(
            value = """
                    SELECT u.*
                    FROM users u
                    WHERE (
                        u.username COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
                        OR u.display_name COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
                    )
                    ORDER BY (
                        (CASE WHEN u.username COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%') THEN 3 ELSE 0 END)
                      + (CASE WHEN u.display_name COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%') THEN 2 ELSE 0 END)
                    ) DESC,
                    u.id DESC
                    """,
            countQuery = """
                    SELECT COUNT(*)
                    FROM users u
                    WHERE (
                        u.username COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
                        OR u.display_name COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
                    )
                    """,
            nativeQuery = true)
    Page<User> searchUsers(@Param("q") String q, Pageable pageable);
}
