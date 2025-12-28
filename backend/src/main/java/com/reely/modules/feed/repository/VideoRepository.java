package com.reely.modules.feed.repository;

import com.reely.modules.feed.entity.Video;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
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

       // Feed cá nhân hóa
}