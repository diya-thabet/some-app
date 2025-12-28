package com.kawn.hirfa.review.repository;

import com.kawn.hirfa.review.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
