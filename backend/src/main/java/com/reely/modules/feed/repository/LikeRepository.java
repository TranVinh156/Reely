package com.reely.modules.feed.repository;

import com.reely.modules.feed.entity.Like;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByVideoIdAndUserId(Long videoId, Long userId);
}
