package com.kawn.hirfa.match.service;

import com.kawn.hirfa.auth.domain.User;
import com.kawn.hirfa.match.domain.Bid;
import com.kawn.hirfa.match.domain.Job;
import com.kawn.hirfa.match.domain.JobStatus;
import com.kawn.hirfa.match.repository.BidRepository;
import com.kawn.hirfa.match.repository.JobRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MatchServiceTest {

    @Mock
    private JobRepository jobRepository;
    @Mock
    private BidRepository bidRepository;

    @InjectMocks
    private MatchService matchService;

    @Test
    void shouldCreateJob() {
        User customer = User.builder().id(1L).build();
        when(jobRepository.save(any(Job.class))).thenAnswer(i -> i.getArguments()[0]);

        Job job = matchService.createJob(customer, "Fix Sink", "Leaking", BigDecimal.TEN, 10.0, 10.0);

        assertNotNull(job);
        assertEquals(JobStatus.OPEN, job.getStatus());
        assertEquals("Fix Sink", job.getTitle());
    }

    @Test
    void shouldSortBidsByFairPlay_NewUserGetsBoost() {
        // Setup Users
        User veteranUser = User.builder().id(2L).fairnessScore(100)
                .createdAt(LocalDateTime.now().minusMonths(6)).build();

        User newUser = User.builder().id(3L).fairnessScore(100)
                .createdAt(LocalDateTime.now().minusDays(2)).build(); // Very new!

        // Setup Bids
        Bid veteranBid = Bid.builder().id(1L).provider(veteranUser).amount(BigDecimal.valueOf(50)).build();
        Bid newBid = Bid.builder().id(2L).provider(newUser).amount(BigDecimal.valueOf(50)).build();

        // New User should logically have a higher calculated score due to the boost
        // We need to verify the list order returned by
        // matchService.getJobBidsSortedByFairness

        when(bidRepository.findByJobId(1L)).thenReturn(Arrays.asList(veteranBid, newBid));

        List<Bid> sortedBids = matchService.getJobBidsSortedByFairness(1L);

        // Expected: New User (Boosted) comes first
        assertEquals(newUser.getId(), sortedBids.get(0).getProvider().getId());
        assertEquals(veteranUser.getId(), sortedBids.get(1).getProvider().getId());
    }
}
