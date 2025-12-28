package com.kawn.hirfa.geo.controller;

import com.kawn.hirfa.auth.domain.User;
import com.kawn.hirfa.geo.domain.ProviderLocation;
import com.kawn.hirfa.geo.service.GeoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/geo")
@RequiredArgsConstructor
public class GeoController {

    private final GeoService geoService;

    @PostMapping("/update")
    public ResponseEntity<Void> updateLocation(
            @AuthenticationPrincipal User user,
            @RequestParam double lat,
            @RequestParam double lon) {
        geoService.updateLocation(user, lat, lon);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ProviderLocation>> getNearby(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "5000") double radius // meters
    ) {
        // In real app, convert ProviderLocation to a DTO to hide internal structure
        return ResponseEntity.ok(geoService.findNearbyProviders(lat, lon, radius));
    }
}
