package com.snakesafe.controllers;

import com.snakesafe.entities.SnakeBiteCase;
import com.snakesafe.enums.CaseStatus;
import com.snakesafe.repositories.SnakeBiteCaseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cases")
public class CaseController {

    private final SnakeBiteCaseRepository caseRepository;

    public CaseController(SnakeBiteCaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    @GetMapping
    public List<SnakeBiteCase> getAllCases() {
        return caseRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SnakeBiteCase> getCaseById(@PathVariable String id) {
        try {
            Long numericId = Long.parseLong(id);
            Optional<SnakeBiteCase> byId = caseRepository.findById(numericId);
            if (byId.isPresent()) return ResponseEntity.ok(byId.get());
        } catch (NumberFormatException ignored) {}

        return caseRepository.findByCaseNumber(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SnakeBiteCase> createCase(@RequestBody SnakeBiteCase biteCase) {
        if (biteCase.getCaseNumber() == null || biteCase.getCaseNumber().isEmpty()) {
            biteCase.setCaseNumber("SS" + (1000 + (int)(Math.random() * 9000)));
        }
        biteCase.setCreatedAt(LocalDateTime.now());
        biteCase.setUpdatedAt(LocalDateTime.now());
        SnakeBiteCase saved = caseRepository.save(biteCase);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SnakeBiteCase> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        
        Optional<SnakeBiteCase> caseOpt = caseRepository.findByCaseNumber(id);
        if (caseOpt.isEmpty()) {
            try {
                caseOpt = caseRepository.findById(Long.parseLong(id));
            } catch (Exception ignored) {}
        }

        if (caseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        SnakeBiteCase c = caseOpt.get();
        if (payload.containsKey("status")) {
            c.setStatus(CaseStatus.valueOf(payload.get("status")));
        }
        c.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(caseRepository.save(c));
    }
}
