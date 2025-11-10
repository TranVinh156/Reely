package com.reely.modules.feed.repository;

import com.reely.modules.feed.entity.Comment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByVideoIdOrderByCreatedAtAsc(Long videoId);
}
