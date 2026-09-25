package com.snakesafe.repositories;

import com.snakesafe.entities.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByAntivenomAvailableTrue();
    List<Hospital> findByVerifiedTrue();
}
