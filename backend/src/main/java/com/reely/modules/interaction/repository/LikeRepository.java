package com.reely.modules.interaction.repository;

import com.reely.modules.interaction.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findAllByVideoId(Long videoId);
    List<Like> findAllByUserId(Long userId);
    Optional<Like> findByVideoIdAndUserId(Long videoId, Long userId);
}
