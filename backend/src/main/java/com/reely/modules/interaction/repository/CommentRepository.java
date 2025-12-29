package com.reely.modules.interaction.repository;

import com.reely.modules.interaction.dto.CommentStat;
import com.reely.modules.interaction.dto.LikeStat;
import com.reely.modules.interaction.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByVideo_Id(Long videoId);
    Page<Comment> findByVideo_IdAndRootCommentIsNull(Long videoId, Pageable pageable);
    Page<Comment> findByRootComment_IdOrderByCreatedAtDesc(Long rootCommentId, Pageable pageable);

    @Query(value = "SELECT DATE(c.created_at) as date, COUNT(*) as count " +
            "FROM comment c " +
            "JOIN videos v ON c.video_id = v.id " +
            "WHERE v.user_id = :userId " +
            "AND c.created_at >= :startDate " +
            "GROUP BY DATE(c.created_at) " +
            "ORDER BY date ASC", nativeQuery = true)
    List<CommentStat> countCommentsByUserIdAndDate(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
}
