package com.kawn.hirfa.match.service;

import com.kawn.hirfa.auth.domain.User;
import com.kawn.hirfa.common.exception.InvalidOperationException;
import com.kawn.hirfa.common.exception.ResourceNotFoundException;
import com.kawn.hirfa.match.domain.Bid;
import com.kawn.hirfa.match.domain.Job;
import com.kawn.hirfa.match.domain.JobStatus;
import com.kawn.hirfa.match.repository.BidRepository;
import com.kawn.hirfa.match.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final JobRepository jobRepository;
    private final BidRepository bidRepository;

    @Transactional
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

    @Transactional
    public Bid placeBid(User provider, Long jobId, BigDecimal amount, String message) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!JobStatus.OPEN.equals(job.getStatus())) {
            throw new InvalidOperationException("Job is not open for bidding");
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

    @Transactional
    public void acceptBid(Long bidId, User customer) {
        Bid bid = bidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id: " + bidId));

        Job job = bid.getJob();
        if (!job.getCustomer().getId().equals(customer.getId())) {
            throw new InvalidOperationException("Only the job owner can accept bids");
        }

        bid.setAccepted(true);
        job.setStatus(JobStatus.IN_PROGRESS);

        bidRepository.save(bid);
        jobRepository.save(job);
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
