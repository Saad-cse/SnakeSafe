package com.snakesafe.repositories;

import com.snakesafe.entities.SnakeBiteCase;
import com.snakesafe.enums.CaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SnakeBiteCaseRepository extends JpaRepository<SnakeBiteCase, Long> {
    Optional<SnakeBiteCase> findByCaseNumber(String caseNumber);
    List<SnakeBiteCase> findByStatus(CaseStatus status);
    List<SnakeBiteCase> findBySelectedHospitalId(Long hospitalId);
    List<SnakeBiteCase> findAllByOrderByCreatedAtDesc();
}
