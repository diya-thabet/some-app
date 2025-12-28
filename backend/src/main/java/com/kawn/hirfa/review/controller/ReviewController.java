package com.kawn.hirfa.review.controller;

import com.kawn.hirfa.common.api.ApiResponse;
import com.kawn.hirfa.review.domain.Review;
import com.kawn.hirfa.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;

    @PostMapping
    public ApiResponse<Review> createReview(@RequestBody ReviewRequest request) {
        // Simplified Logic
        Review review = Review.builder()
                .rating(request.rating())
                .comment(request.comment())
                .photoUrl(request.photoUrl())
                // Job linking logic would go here ideally
                .build();
        return ApiResponse.success(reviewRepository.save(review), "Review created");
    }

    // Record class for DTO
    public record ReviewRequest(Long jobId, Integer rating, String comment, String photoUrl) {
    }
}
