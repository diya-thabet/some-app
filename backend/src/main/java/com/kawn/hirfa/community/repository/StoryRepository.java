package com.kawn.hirfa.community.repository;

import com.kawn.hirfa.community.domain.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {

    @Query("SELECT s FROM Story s WHERE s.createdAt > :cutoff ORDER BY s.createdAt DESC")
    List<Story> findAllActive(@Param("cutoff") LocalDateTime cutoff);
}
