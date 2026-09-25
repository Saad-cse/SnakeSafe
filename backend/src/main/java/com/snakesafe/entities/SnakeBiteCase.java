package com.snakesafe.entities;

import com.snakesafe.enums.CaseStatus;
import com.snakesafe.enums.UrgencyLevel;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "snake_bite_cases")
public class SnakeBiteCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String caseNumber; // e.g. "SS1024"

    private String patientId;
    private String patientName;
    private String patientPhone;

    private Double latitude;
    private Double longitude;
    private String address;

    // Snake Identification details
    @Column(length = 2000)
    private String snakeImageUrl;
    private String possibleSpecies;
    private String possibleGroup;
    private Double confidence;
    private String identificationMethod; // PHOTO_AI, QUESTIONNAIRE, NONE

    // Bite details
    private String biteTime;
    private String biteLocation;

    @Column(length = 1000)
    private String symptoms; // comma separated

    @Column(length = 2000)
    private String notes;

    @Enumerated(EnumType.STRING)
    private UrgencyLevel urgencyLevel = UrgencyLevel.CRITICAL;

    // Hospital selection
    private Long selectedHospitalId;
    private String selectedHospitalName;

    // Ambulance details
    private Boolean ambulanceRequested = false;
    private Long ambulanceId;
    private String ambulanceVehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CaseStatus status = CaseStatus.CREATED;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public SnakeBiteCase() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getSnakeImageUrl() { return snakeImageUrl; }
    public void setSnakeImageUrl(String snakeImageUrl) { this.snakeImageUrl = snakeImageUrl; }

    public String getPossibleSpecies() { return possibleSpecies; }
    public void setPossibleSpecies(String possibleSpecies) { this.possibleSpecies = possibleSpecies; }

    public String getPossibleGroup() { return possibleGroup; }
    public void setPossibleGroup(String possibleGroup) { this.possibleGroup = possibleGroup; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getIdentificationMethod() { return identificationMethod; }
    public void setIdentificationMethod(String identificationMethod) { this.identificationMethod = identificationMethod; }

    public String getBiteTime() { return biteTime; }
    public void setBiteTime(String biteTime) { this.biteTime = biteTime; }

    public String getBiteLocation() { return biteLocation; }
    public void setBiteLocation(String biteLocation) { this.biteLocation = biteLocation; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public UrgencyLevel getUrgencyLevel() { return urgencyLevel; }
    public void setUrgencyLevel(UrgencyLevel urgencyLevel) { this.urgencyLevel = urgencyLevel; }

    public Long getSelectedHospitalId() { return selectedHospitalId; }
    public void setSelectedHospitalId(Long selectedHospitalId) { this.selectedHospitalId = selectedHospitalId; }

    public String getSelectedHospitalName() { return selectedHospitalName; }
    public void setSelectedHospitalName(String selectedHospitalName) { this.selectedHospitalName = selectedHospitalName; }

    public Boolean getAmbulanceRequested() { return ambulanceRequested; }
    public void setAmbulanceRequested(Boolean ambulanceRequested) { this.ambulanceRequested = ambulanceRequested; }

    public Long getAmbulanceId() { return ambulanceId; }
    public void setAmbulanceId(Long ambulanceId) { this.ambulanceId = ambulanceId; }

    public String getAmbulanceVehicleNumber() { return ambulanceVehicleNumber; }
    public void setAmbulanceVehicleNumber(String ambulanceVehicleNumber) { this.ambulanceVehicleNumber = ambulanceVehicleNumber; }

    public CaseStatus getStatus() { return status; }
    public void setStatus(CaseStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
