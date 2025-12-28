package com.kawn.hirfa.match.repository;

import com.kawn.hirfa.match.domain.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(String status);
}
