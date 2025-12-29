package com.reely.modules.feed.repository;

import com.reely.modules.feed.dto.ViewStat;
import com.reely.modules.feed.entity.Video;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {

       // Feed public
       @Query("SELECT v FROM Video v WHERE v.visibility = 'PUBLIC' ORDER BY v.createdAt DESC")
       Page<Video> findPublicFeed(Pageable pageable);

       // Feed follower
       @Query("""
                     SELECT v FROM Video v
                     WHERE v.userId IN :followeeIds
                     AND (v.visibility = 'PUBLIC' OR v.visibility = 'FOLLOWERS')
                     ORDER BY v.createdAt DESC
                     """)
       Page<Video> findFeedForUser(@Param("followeeIds") List<Long> followeeIds, Pageable pageable);

       @Query("""
                     SELECT v FROM Video v
                     WHERE v.visibility = 'PUBLIC'
                        OR (v.visibility = 'FOLLOWERS' AND v.userId IN :followeeIds)
                     ORDER BY
                       CASE WHEN v.userId IN :followeeIds THEN 0 ELSE 1 END,
                       v.createdAt DESC
                     """)
       Page<Video> findPersonalizedFeed(@Param("followeeIds") List<Long> followeeIds, Pageable pageable);

       Page<Video> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

       // Feed Trending
       @Query("""
                     SELECT v FROM Video v
                     WHERE v.visibility = 'PUBLIC'
                     ORDER BY (v.likeCount * 2 + v.viewCount * 0.5 + v.commentCount) DESC
                     """)
       Page<Video> findTrendingFeed(Pageable pageable);

       // Feed User cu the
       @Query("SELECT v FROM Video v WHERE v.userId = :userId AND v.visibility = 'PUBLIC' ORDER BY v.createdAt DESC")
       Page<Video> findByUserId(@Param("userId") Long userId, Pageable pageable);

       @Query("SELECT SUM(v.viewCount) FROM Video v WHERE v.userId = :userId")
       Long getTotalViewsByUserId(@Param("userId") Long userId);

       @Query("SELECT SUM(v.commentCount) FROM Video v WHERE v.userId = :userId")
       Long getTotalCommentsByUserId(@Param("userId") Long userId);

        @Query("SELECT SUM(v.likeCount) FROM Video v WHERE v.userId = :userId")
        Long getTotalLikesByUserId(@Param("userId") Long userId);

       // Feed cá nhân hóa

       @Query(value = "SELECT DATE(v.created_at) as date, SUM(v.view_count) as count " +
               "FROM videos v " +
               "WHERE v.user_id = :userId " +
               "AND v.created_at >= :startDate " +
               "GROUP BY DATE(v.created_at) " +
               "ORDER BY date ASC", nativeQuery = true)
       List<ViewStat> getViewsByUserIdAndDate(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
}