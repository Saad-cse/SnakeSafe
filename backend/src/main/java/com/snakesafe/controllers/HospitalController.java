package com.snakesafe.controllers;

import com.snakesafe.entities.Hospital;
import com.snakesafe.repositories.HospitalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalRepository hospitalRepository;

    public HospitalController(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    @GetMapping
    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    @GetMapping("/nearby")
    public List<Hospital> getNearbyHospitals(
            @RequestParam(defaultValue = "28.6139") Double lat,
            @RequestParam(defaultValue = "77.2090") Double lng) {
        List<Hospital> list = hospitalRepository.findAll();
        // Calculate distance and sort
        for (Hospital h : list) {
            double dist = calculateDistanceKm(lat, lng, h.getLatitude(), h.getLongitude());
            h.setDistanceKm(Math.round(dist * 10.0) / 10.0);
            h.setEtaMinutes((int) Math.round(dist * 2.5 + 4));
        }
        list.sort((a, b) -> Double.compare(a.getDistanceKm(), b.getDistanceKm()));
        return list;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable Long id) {
        return hospitalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double theta = lon1 - lon2;
        double dist = Math.sin(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2)) +
                      Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.cos(Math.toRadians(theta));
        dist = Math.acos(Math.min(1.0, Math.max(-1.0, dist)));
        dist = Math.toDegrees(dist);
        return dist * 60 * 1.1515 * 1.609344;
    }
}
