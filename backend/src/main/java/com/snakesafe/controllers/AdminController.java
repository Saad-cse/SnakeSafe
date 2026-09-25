package com.snakesafe.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snakesafe.repositories.HospitalRepository;
import com.snakesafe.repositories.SnakeBiteCaseRepository;
import com.snakesafe.repositories.UserRepository;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final SnakeBiteCaseRepository caseRepository;
    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;

    public AdminController(
            SnakeBiteCaseRepository caseRepository,
            HospitalRepository hospitalRepository,
            UserRepository userRepository) {
        this.caseRepository = caseRepository;
        this.hospitalRepository = hospitalRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        long totalCases = caseRepository.count();
        long totalHospitals = hospitalRepository.count();
        long totalUsers = userRepository.count();

        Map<String, Object> data = new HashMap<>();
        data.put("totalCases", totalCases);
        data.put("totalHospitals", totalHospitals);
        data.put("totalUsers", totalUsers);
        data.put("avgResponseMinutes", 7.4);
        data.put("doorToNeedleMinutes", 14.2);
        data.put("identificationDistribution", Map.of(
            "Cobra-like", 45,
            "Viper-like", 32,
            "Krait-like", 15,
            "Non-venomous", 8
        ));
        return ResponseEntity.ok(data);
    }
}
