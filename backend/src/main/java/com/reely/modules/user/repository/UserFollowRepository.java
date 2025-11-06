package com.reely.modules.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reely.modules.user.entity.UserFollow;
import java.util.List;

@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, Long> {
    void deleteByFollowerIdAndFollowingId(long followerId, long followingId);

    List<UserFollow> findByFollowerId(long followerId);

    List<UserFollow> findByFollowingId(long followingId);

    long countByFollowingId(long followingId);

    long countByFollowerId(long followerId);
}
