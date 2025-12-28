package com.kawn.hirfa.match.service;

import com.kawn.hirfa.auth.domain.User;
import com.kawn.hirfa.match.domain.Bid;
import com.kawn.hirfa.match.domain.Job;
import com.kawn.hirfa.match.domain.JobStatus;
import com.kawn.hirfa.match.repository.BidRepository; // Correct Import
import com.kawn.hirfa.match.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final JobRepository jobRepository;
    private final BidRepository bidRepository;

    public Job createJob(User customer, String title, String description, BigDecimal budget, double lat, double lon) {
        Job job = Job.builder()
                .customer(customer)
                .title(title)
                .description(description)
                .budget(budget)
                .latitude(lat)
                .longitude(lon)
                .status(JobStatus.OPEN)
                .build();
        return jobRepository.save(job);
    }

    public Bid placeBid(User provider, Long jobId, BigDecimal amount, String message) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        if (!JobStatus.OPEN.equals(job.getStatus())) {
            throw new RuntimeException("Job is not open for bidding");
        }

        Bid bid = Bid.builder()
                .job(job)
                .provider(provider)
                .amount(amount)
                .message(message)
                .accepted(false)
                .build();

        return bidRepository.save(bid);
    }

    // The "Fair-Play Algorithm" implementation
    public List<Bid> getJobBidsSortedByFairness(Long jobId) {
        List<Bid> bids = bidRepository.findByJobId(jobId);

        // Sorting Logic:
        // 1. New Workers (Created < 30 days) get a boost
        // 2. High Fairness Score
        // 3. Price (Lower is better, but not strictly dominant)

        return bids.stream().sorted(Comparator.comparing(this::calculateScore).reversed())
                .collect(Collectors.toList());
    }

    private double calculateScore(Bid bid) {
        User p = bid.getProvider();
        double score = p.getFairnessScore();

        // Boost new users
        if (p.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusDays(30))) {
            score += 20;
        }

        return score;
    }
}
