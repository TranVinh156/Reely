package com.reely.modules.feed.repository;

import com.reely.modules.feed.entity.Tag;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;
import java.util.Collection;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
    List<Tag> findByNameIn(Collection<String> names);
}
