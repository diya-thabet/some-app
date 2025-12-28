package com.kawn.hirfa.review.domain;

import com.kawn.hirfa.match.domain.Job;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "job_id")
    private Job job;

    private Integer rating; // 1-5
    private String comment;

    // Photo Support
    private String photoUrl; // S3 or similar URL

    @CreationTimestamp
    private java.time.LocalDateTime createdAt;
}
