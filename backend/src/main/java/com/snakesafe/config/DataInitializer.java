package com.snakesafe.config;

import com.snakesafe.entities.*;
import com.snakesafe.enums.*;
import com.snakesafe.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final AmbulanceRepository ambulanceRepository;
    private final SnakeBiteCaseRepository caseRepository;

    public DataInitializer(
            UserRepository userRepository,
            HospitalRepository hospitalRepository,
            AmbulanceRepository ambulanceRepository,
            SnakeBiteCaseRepository caseRepository) {
        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
        this.ambulanceRepository = ambulanceRepository;
        this.caseRepository = caseRepository;
    }

    @Override
    public void run(String... args) {
        if (hospitalRepository.count() == 0) {
            // Seed Hospitals
            Hospital h1 = new Hospital();
            h1.setName("Apex Trauma & Multi-Specialty Hospital");
            h1.setAddress("Plot 42, Health City Boulevard, Sector 12");
            h1.setLatitude(28.6139);
            h1.setLongitude(77.2090);
            h1.setPhone("+91 11 2345 6789");
            h1.setEmergencyAvailable(true);
            h1.setSnakeBiteService(true);
            h1.setAntivenomAvailable(true);
            h1.setAntivenomVials(45);
            h1.setIcuAvailable(true);
            h1.setVerified(true);
            hospitalRepository.save(h1);

            Hospital h2 = new Hospital();
            h2.setName("Government District Civil Hospital");
            h2.setAddress("Ring Road, Civil Lines Medical Enclave");
            h2.setLatitude(28.6250);
            h2.setLongitude(77.2180);
            h2.setPhone("+91 11 2398 1100");
            h2.setEmergencyAvailable(true);
            h2.setSnakeBiteService(true);
            h2.setAntivenomAvailable(true);
            h2.setAntivenomVials(80);
            h2.setIcuAvailable(true);
            h2.setVerified(true);
            hospitalRepository.save(h2);

            Hospital h3 = new Hospital();
            h3.setName("St. Jude Emergency Center");
            h3.setAddress("14 Cathedral Road, North Campus");
            h3.setLatitude(28.6380);
            h3.setLongitude(77.1950);
            h3.setPhone("+91 11 2766 5432");
            h3.setEmergencyAvailable(true);
            h3.setSnakeBiteService(true);
            h3.setAntivenomAvailable(false);
            h3.setAntivenomVials(0);
            h3.setIcuAvailable(true);
            h3.setVerified(true);
            hospitalRepository.save(h3);
        }

        if (ambulanceRepository.count() == 0) {
            // Seed Ambulances
            Ambulance a1 = new Ambulance();
            a1.setVehicleNumber("DL-01-EM-4920 (ALS Unit)");
            a1.setDriverName("Vikram Singh");
            a1.setDriverPhone("+91 98333 44556");
            a1.setCurrentLatitude(28.6105);
            a1.setCurrentLongitude(77.2050);
            a1.setStatus("AVAILABLE");
            ambulanceRepository.save(a1);

            Ambulance a2 = new Ambulance();
            a2.setVehicleNumber("DL-01-EM-1108 (BLS Unit)");
            a2.setDriverName("Mohd. Tariq");
            a2.setDriverPhone("+91 98444 55667");
            a2.setCurrentLatitude(28.6220);
            a2.setCurrentLongitude(77.2150);
            a2.setStatus("AVAILABLE");
            ambulanceRepository.save(a2);
        }

        if (userRepository.count() == 0) {
            userRepository.save(new User("Rahul Sharma", "patient@snakesafe.org", "+91 98765 43210", Role.PATIENT));
            userRepository.save(new User("Dr. Ananya Roy", "doctor@citygeneral.org", "+91 98111 22334", Role.DOCTOR));
            userRepository.save(new User("Vikram Singh", "driver@snakesafe.org", "+91 98333 44556", Role.AMBULANCE_DRIVER));
            userRepository.save(new User("Dr. Meera Patel", "admin@snakesafe.gov", "+91 98999 00112", Role.ADMIN));
        }

        if (caseRepository.count() == 0) {
            SnakeBiteCase c1 = new SnakeBiteCase();
            c1.setCaseNumber("SS1024");
            c1.setPatientName("Rahul Sharma");
            c1.setPatientPhone("+91 98765 43210");
            c1.setLatitude(28.6139);
            c1.setLongitude(77.2090);
            c1.setAddress("Sector 4, Connaught Place Central District");
            c1.setPossibleSpecies("Indian Spectacled Cobra (Naja naja)");
            c1.setPossibleGroup("Cobra-like");
            c1.setConfidence(0.72);
            c1.setIdentificationMethod("PHOTO_AI");
            c1.setBiteTime("15 minutes ago");
            c1.setBiteLocation("Right leg");
            c1.setSymptoms("Swelling, Pain, Dizziness");
            c1.setUrgencyLevel(UrgencyLevel.CRITICAL);
            c1.setSelectedHospitalName("Apex Trauma & Multi-Specialty Hospital");
            c1.setAmbulanceRequested(true);
            c1.setAmbulanceVehicleNumber("DL-01-EM-4920");
            c1.setStatus(CaseStatus.EMERGENCY_REQUESTED);
            caseRepository.save(c1);
        }
    }
}
