package com.kawn.hirfa.geo.repository;

import com.kawn.hirfa.geo.domain.ProviderLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProviderLocationRepository extends JpaRepository<ProviderLocation, Long> {

    @Query(value = "SELECT * FROM provider_locations p WHERE ST_DWithin(p.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :radiusInMeters)", nativeQuery = true)
    List<ProviderLocation> findNearby(@Param("lat") double lat, @Param("lon") double lon,
            @Param("radiusInMeters") double radiusInMeters);
}
