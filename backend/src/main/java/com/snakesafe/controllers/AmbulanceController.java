package com.snakesafe.controllers;

import com.snakesafe.entities.Ambulance;
import com.snakesafe.repositories.AmbulanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ambulances")
public class AmbulanceController {

    private final AmbulanceRepository ambulanceRepository;

    public AmbulanceController(AmbulanceRepository ambulanceRepository) {
        this.ambulanceRepository = ambulanceRepository;
    }

    @GetMapping
    public List<Ambulance> getAllAmbulances() {
        return ambulanceRepository.findAll();
    }

    @GetMapping("/nearby")
    public List<Ambulance> getNearbyAmbulances() {
        return ambulanceRepository.findByStatus("AVAILABLE");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Ambulance> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        return ambulanceRepository.findById(id).map(amb -> {
            if (payload.containsKey("status")) {
                amb.setStatus((String) payload.get("status"));
            }
            if (payload.containsKey("currentLatitude")) {
                amb.setCurrentLatitude(((Number) payload.get("currentLatitude")).doubleValue());
            }
            if (payload.containsKey("currentLongitude")) {
                amb.setCurrentLongitude(((Number) payload.get("currentLongitude")).doubleValue());
            }
            return ResponseEntity.ok(ambulanceRepository.save(amb));
        }).orElse(ResponseEntity.notFound().build());
    }
}
