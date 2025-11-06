package com.reely.modules.interaction.repository;

import com.reely.modules.interaction.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByVideo_Id(Long videoId);
    Page<Comment> findByVideo_IdAndRootCommentIsNull(Long videoId, Pageable pageable);
    Page<Comment> findByRootComment_IdOrderByCreatedAtDesc(Long rootCommentId, Pageable pageable);
}
