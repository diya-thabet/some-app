package com.kawn.hirfa.geo.domain;

import com.kawn.hirfa.auth.domain.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Point;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "provider_locations")
public class ProviderLocation {

    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    // SRID 4326 is standard GPS
    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point location;

    // Optional: Last updated timestamp
    private java.time.LocalDateTime lastUpdated;
}
