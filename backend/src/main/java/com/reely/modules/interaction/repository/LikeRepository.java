package com.reely.modules.interaction.repository;

import com.reely.modules.interaction.dto.LikeStat;
import com.reely.modules.interaction.entity.Likes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Likes, Long> {
    List<Likes> findAllByVideoId(Long videoId);
    List<Likes> findAllByUserId(Long userId);
    boolean existsByVideoIdAndUserId(Long videoId, Long userId);
    Optional<Likes> findByVideoIdAndUserId(Long videoId, Long userId);
    void deleteByVideoId(Long videoId);

    @Query(value = "SELECT DATE(l.created_at) as date, COUNT(*) as count " +
           "FROM likes l " +
           "JOIN videos v ON l.video_id = v.id " +
           "WHERE v.user_id = :userId " +
           "AND l.created_at >= :startDate " +
           "GROUP BY DATE(l.created_at) " +
           "ORDER BY date ASC", nativeQuery = true)
    List<LikeStat> countLikesByUserIdAndDate(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);

    @Query("SELECT l FROM Likes l WHERE l.video.userId = :userId")
    List<Likes> findAllLikesByVideoOwnerId(@Param("userId") Long userId);
}
