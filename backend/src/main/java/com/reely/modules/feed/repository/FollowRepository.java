package com.reely.modules.feed.repository;

import com.reely.modules.feed.entity.Follow;
import com.reely.modules.feed.entity.FollowId;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface FollowRepository extends JpaRepository<Follow, FollowId> {
    @Query("SELECT f.followeeId FROM Follow f WHERE f.followerId = :userId")
    List<Long> findFolloweeIdsByUserId(Long userId);
}