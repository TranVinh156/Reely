package com.reely.modules.feed.repository;

import com.reely.modules.feed.entity.Tag;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;
import java.util.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
    List<Tag> findByNameIn(Collection<String> names);

    /**
     * Search tags by keyword.
     */
    @Query(
            value = """
                    SELECT t.id AS id,
                           t.name AS name,
                           COUNT(vt.video_id) AS videoCount
                    FROM tags t
                    LEFT JOIN video_tags vt ON vt.tag_id = t.id
                    WHERE t.name COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
                    GROUP BY t.id, t.name
                    ORDER BY videoCount DESC, t.name ASC
                    """,
            countQuery = """
                    SELECT COUNT(*)
                    FROM (
                        SELECT t.id
                        FROM tags t
                        WHERE t.name COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%')
                        GROUP BY t.id
                    ) x
                    """,
            nativeQuery = true)
    Page<TagSearchProjection> searchTags(@Param("q") String q, Pageable pageable);

    interface TagSearchProjection {
        Long getId();
        String getName();
        Long getVideoCount();
    }
}
