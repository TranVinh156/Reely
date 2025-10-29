package com.reely.modules.interaction.repository;

import com.reely.modules.interaction.entity.Likes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Likes, Long> {
    List<Likes> findAllByVideoId(Long videoId);
    List<Likes> findAllByUserId(Long userId);
    Optional<Likes> findByVideoIdAndUserId(Long videoId, Long userId);
}
