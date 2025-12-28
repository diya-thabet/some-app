package com.kawn.hirfa.match.repository;

import com.kawn.hirfa.match.domain.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByJobId(Long jobId);
}
