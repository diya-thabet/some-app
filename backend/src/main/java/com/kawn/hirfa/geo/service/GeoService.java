package com.kawn.hirfa.geo.service;

import com.kawn.hirfa.auth.domain.User;
import com.kawn.hirfa.geo.domain.ProviderLocation;
import com.kawn.hirfa.geo.repository.ProviderLocationRepository;
import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GeoService {

    private final ProviderLocationRepository repository;
    private final GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);

    public void updateLocation(User user, double lat, double lon) {
        Point point = geometryFactory.createPoint(new Coordinate(lon, lat));
        ProviderLocation location = repository.findById(user.getId())
                .orElse(ProviderLocation.builder().user(user).build());

        location.setLocation(point);
        location.setLastUpdated(LocalDateTime.now());
        repository.save(location);
    }

    public List<ProviderLocation> findNearbyProviders(double lat, double lon, double radiusInMeters) {
        return repository.findNearby(lat, lon, radiusInMeters);
    }
}
