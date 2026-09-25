package com.snakesafe.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hospitals")
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    private Double latitude;
    private Double longitude;
    private String phone;

    private Boolean emergencyAvailable = true;
    private Boolean snakeBiteService = true;
    private Boolean antivenomAvailable = true;
    private Integer antivenomVials = 20;
    private Boolean icuAvailable = true;
    private Boolean verified = true;

    @Transient
    private Double distanceKm;

    @Transient
    private Integer etaMinutes;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Hospital() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Boolean getEmergencyAvailable() { return emergencyAvailable; }
    public void setEmergencyAvailable(Boolean emergencyAvailable) { this.emergencyAvailable = emergencyAvailable; }

    public Boolean getSnakeBiteService() { return snakeBiteService; }
    public void setSnakeBiteService(Boolean snakeBiteService) { this.snakeBiteService = snakeBiteService; }

    public Boolean getAntivenomAvailable() { return antivenomAvailable; }
    public void setAntivenomAvailable(Boolean antivenomAvailable) { this.antivenomAvailable = antivenomAvailable; }

    public Integer getAntivenomVials() { return antivenomVials; }
    public void setAntivenomVials(Integer antivenomVials) { this.antivenomVials = antivenomVials; }

    public Boolean getIcuAvailable() { return icuAvailable; }
    public void setIcuAvailable(Boolean icuAvailable) { this.icuAvailable = icuAvailable; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Integer getEtaMinutes() { return etaMinutes; }
    public void setEtaMinutes(Integer etaMinutes) { this.etaMinutes = etaMinutes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
