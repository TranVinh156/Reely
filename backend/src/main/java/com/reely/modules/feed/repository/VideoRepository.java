package com.reely.modules.feed.repository;

import com.reely.modules.feed.dto.ViewStat;
import com.reely.modules.feed.entity.Video;
import org.springframework.data.repository.query.Param;
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

  List<Video> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);

  // Feed User cu the
  @Query("SELECT v FROM Video v WHERE v.userId = :userId AND v.visibility = 'PUBLIC' ORDER BY v.createdAt DESC")
  Page<Video> findByUserId(@Param("userId") Long userId, Pageable pageable);

  // Feed cá nhân hóa

  /**
   * Search public videos by query over title/description/tags
   *
   * @param q
   * @param pageable
   * @return
   */
  @Query(value = """
      SELECT v.*
      FROM videos v
      LEFT JOIN video_tags vt ON vt.video_id = v.id
      LEFT JOIN tags t ON t.id = vt.tag_id
      WHERE v.visibility = 'PUBLIC'
        AND (
          v.title COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
          OR v.description COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
          OR t.name COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
        )
      GROUP BY v.id
      ORDER BY (
          MAX(CASE WHEN t.name COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%') THEN 4 ELSE 0 END)
        + MAX(CASE WHEN v.title COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%') THEN 3 ELSE 0 END)
        + MAX(CASE WHEN v.description COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%') THEN 2 ELSE 0 END)
      ) DESC,
      v.created_at DESC
      """, countQuery = """
      SELECT COUNT(DISTINCT v.id)
      FROM videos v
      LEFT JOIN video_tags vt ON vt.video_id = v.id
      LEFT JOIN tags t ON t.id = vt.tag_id
      WHERE v.visibility = 'PUBLIC'
        AND (
          v.title COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
          OR v.description COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
          OR t.name COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
        )
      """, nativeQuery = true)
  Page<Video> searchPublicVideos(@Param("q") String q, Pageable pageable);

  /**
   * List public videos by tag name, ordered by a "relevance" = engagement score.
   * (Useful for TagPage: click hashtag -> list videos)
   */
  @Query(value = """
      SELECT v.*
      FROM videos v
      JOIN video_tags vt ON vt.video_id = v.id
      JOIN tags t ON t.id = vt.tag_id
      WHERE v.visibility = 'PUBLIC'
        AND t.name COLLATE utf8mb4_0900_ai_ci = :tagName
      ORDER BY (COALESCE(v.like_count,0) * 2 + COALESCE(v.view_count,0) * 0.5 + COALESCE(v.comment_count,0)) DESC,
               v.created_at DESC
      """, countQuery = """
      SELECT COUNT(*)
      FROM videos v
      JOIN video_tags vt ON vt.video_id = v.id
      JOIN tags t ON t.id = vt.tag_id
      WHERE v.visibility = 'PUBLIC'
        AND t.name COLLATE utf8mb4_0900_ai_ci = :tagName
      """, nativeQuery = true)
  Page<Video> findPublicVideosByTagName(@Param("tagName") String tagName, Pageable pageable);

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

  @Modifying
  @Query("UPDATE Video v SET v.viewCount = COALESCE(v.viewCount, 0) + 1 WHERE v.id = :videoId")
  int incrementViewCount(@Param("videoId") Long videoId);

}
