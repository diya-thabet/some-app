package com.kawn.hirfa.match.controller;

import com.kawn.hirfa.auth.domain.User;
import com.kawn.hirfa.common.api.ApiResponse;
import com.kawn.hirfa.match.domain.Bid;
import com.kawn.hirfa.match.domain.Job;
import com.kawn.hirfa.match.dto.CreateJobRequest;
import com.kawn.hirfa.match.dto.PlaceBidRequest;
import com.kawn.hirfa.match.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping
    public ApiResponse<Job> createJob(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateJobRequest request) {
        Job job = matchService.createJob(
                user,
                request.title(),
                request.description(),
                request.budget(),
                request.latitude(),
                request.longitude());
        return ApiResponse.success(job, "Job created successfully");
    }

    @PostMapping("/{jobId}/bids")
    public ApiResponse<Bid> placeBid(
            @AuthenticationPrincipal User user,
            @PathVariable Long jobId,
            @Valid @RequestBody PlaceBidRequest request) {
        Bid bid = matchService.placeBid(user, jobId, request.amount(), request.message());
        return ApiResponse.success(bid, "Bid placed successfully");
    }

    @GetMapping("/{jobId}/bids")
    public ApiResponse<List<Bid>> getBids(@PathVariable Long jobId) {
        List<Bid> bids = matchService.getJobBidsSortedByFairness(jobId);
        return ApiResponse.success(bids, "Bids retrieved (Fair-Play sorted)");
    }
}
