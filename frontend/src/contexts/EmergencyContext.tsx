import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  EmergencyCase,
  Hospital,
  Ambulance,
  SnakeIdentificationResult,
  BiteAssessment,
  CaseStatus,
  UrgencyLevel
} from '../types';
import {
  ApiService,
  getStoredCases,
  saveStoredCases,
  getStoredHospitals,
  getStoredAmbulances
} from '../services/api';

interface EmergencyContextType {
  activeCase: EmergencyCase | null;
  allCases: EmergencyCase[];
  hospitals: Hospital[];
  ambulances: Ambulance[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  startEmergency: () => void;
  updateLocation: (latitude: number, longitude: number, address: string) => Promise<void>;
  setSnakeIdentification: (data: SnakeIdentificationResult, imageUrl?: string) => Promise<void>;
  submitBiteAssessment: (assessment: BiteAssessment) => Promise<void>;
  selectHospital: (hospital: Hospital) => Promise<void>;
  dispatchNearestHospital: () => Promise<Hospital>;
  confirmEmergencyRequest: () => Promise<EmergencyCase>;
  requestAmbulance: () => Promise<void>;
  updateCaseStatus: (caseId: string, status: CaseStatus, updatedBy: string, notes?: string) => Promise<void>;
  resetEmergency: () => void;
  reloadAll: () => void;
}

const ACTIVE_CASE_ID_KEY = 'snakesafe_active_case_id_v1';
const CURRENT_STEP_KEY = 'snakesafe_patient_step_v1';

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allCases, setAllCases] = useState<EmergencyCase[]>(getStoredCases());
  const [hospitals, setHospitals] = useState<Hospital[]>(getStoredHospitals());
  const [ambulances, setAmbulances] = useState<Ambulance[]>(getStoredAmbulances());
  const [currentStep, setCurrentStepState] = useState<number>(() => {
    try {
      const s = localStorage.getItem(CURRENT_STEP_KEY);
      return s ? parseInt(s, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [activeCaseId, setActiveCaseId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_CASE_ID_KEY) || null;
    } catch {
      return null;
    }
  });

  // Active case resolved from store
  const activeCase = allCases.find(c => c.id === activeCaseId) || null;

  const setCurrentStep = (step: number) => {
    setCurrentStepState(step);
    localStorage.setItem(CURRENT_STEP_KEY, step.toString());
  };

  const reloadAll = useCallback(() => {
    setAllCases(getStoredCases());
    setHospitals(getStoredHospitals());
    setAmbulances(getStoredAmbulances());
  }, []);

  // Listen to cross-tab / local storage updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      reloadAll();
    };
    window.addEventListener('snakesafe_storage_update', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    
    // Polling interval for live updates across browser windows
    const interval = setInterval(() => {
      reloadAll();
    }, 2000);

    return () => {
      window.removeEventListener('snakesafe_storage_update', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
      clearInterval(interval);
    };
  }, [reloadAll]);

  const startEmergency = () => {
    const caseNumber = `SS${Math.floor(1000 + Math.random() * 9000)}`;
    const tempCase: EmergencyCase = {
      id: `case-${Date.now()}`,
      caseNumber,
      patientId: 'u-patient-1',
      patientName: 'Rahul Sharma',
      patientPhone: '+91 98765 43210',
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Detecting live emergency coordinates...',
      symptoms: [],
      urgencyLevel: 'CRITICAL',
      status: 'CREATED',
      statusHistory: [
        {
          status: 'CREATED',
          updatedBy: 'Rahul Sharma',
          timestamp: new Date().toISOString(),
          notes: 'Emergency initiated by patient attendant'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updated = [tempCase, ...allCases];
    setAllCases(updated);
    saveStoredCases(updated);
    setActiveCaseId(tempCase.id);
    localStorage.setItem(ACTIVE_CASE_ID_KEY, tempCase.id);
    setCurrentStep(2); // Move to Location step
  };

  const updateLocation = async (latitude: number, longitude: number, address: string) => {
    if (!activeCaseId) return;
    await ApiService.updateCase(activeCaseId, {
      latitude,
      longitude,
      address,
      status: 'LOCATION_CONFIRMED'
    });
    reloadAll();
    setCurrentStep(3); // Move to Snake Photo step
  };

  const setSnakeIdentification = async (data: SnakeIdentificationResult, imageUrl?: string) => {
    if (!activeCaseId) return;
    await ApiService.updateCase(activeCaseId, {
      possibleSpecies: data.possibleSpecies,
      possibleGroup: data.possibleGroup,
      confidence: data.confidence,
      identificationMethod: data.method || 'PHOTO_AI',
      identificationData: data,
      snakeImageUrl: imageUrl,
      status: 'SNAKE_IDENTIFIED'
    });
    reloadAll();
    setCurrentStep(5); // Move to Bite Assessment
  };

  const submitBiteAssessment = async (assessment: BiteAssessment) => {
    if (!activeCaseId) return;
    await ApiService.updateCase(activeCaseId, {
      biteTime: assessment.biteTime,
      biteLocation: assessment.biteLocation,
      symptoms: assessment.symptoms,
      notes: assessment.notes,
      urgencyLevel: assessment.urgencyLevel,
      status: 'BITE_ASSESSMENT_COMPLETE'
    });
    reloadAll();
    setCurrentStep(6); // Move to Hospital Finder
  };

  const selectHospital = async (hospital: Hospital) => {
    if (!activeCaseId) return;
    await ApiService.updateCase(activeCaseId, {
      selectedHospitalId: hospital.id,
      selectedHospital: hospital,
      status: 'HOSPITAL_SELECTED'
    });
    reloadAll();
    setCurrentStep(7); // Move to Hospital Confirmation
  };

  const confirmEmergencyRequest = async (): Promise<EmergencyCase> => {
    if (!activeCaseId) throw new Error('No active case');
    const updated = await ApiService.updateCaseStatus(
      activeCaseId,
      'EMERGENCY_REQUESTED',
      'Patient Attendant',
      'Emergency case confirmed and alert dispatched to selected hospital'
    );
    reloadAll();
    setCurrentStep(8); // Move to Ambulance Request step
    return updated;
  };

  const requestAmbulance = async () => {
    if (!activeCaseId) return;
    const availableAmb = ambulances.find(a => a.status === 'AVAILABLE') || ambulances[0];
    
    // Assign ambulance
    await ApiService.updateCase(activeCaseId, {
      ambulanceRequested: true,
      ambulanceId: availableAmb.id,
      ambulance: { ...availableAmb, status: 'EN_ROUTE' },
      status: 'AMBULANCE_REQUESTED'
    });
    
    // Update ambulance status
    await ApiService.updateAmbulanceStatus(availableAmb.id, 'EN_ROUTE');
    reloadAll();
  };

  // One-tap emergency dispatch: picks the nearest capable hospital and runs
  // select -> confirm -> ambulance request as a single action, so a victim
  // never has to browse/compare hospitals under duress. Snake ID and bite
  // details are intentionally NOT required before this runs — that data is
  // collected afterward, in parallel, via the "help the doctor prepare"
  // panel on the tracking screen (see AmbulanceStep).
  const dispatchNearestHospital = async (): Promise<Hospital> => {
    if (!activeCaseId) throw new Error('No active case');
    const nearest = [...hospitals].sort(
      (a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)
    )[0];
    if (!nearest) throw new Error('No hospitals available');

    await selectHospital(nearest);
    await confirmEmergencyRequest();
    await requestAmbulance();
    return nearest;
  };

  const updateCaseStatus = async (
    caseId: string,
    status: CaseStatus,
    updatedBy: string,
    notes?: string
  ) => {
    await ApiService.updateCaseStatus(caseId, status, updatedBy, notes);
    reloadAll();
  };

  const resetEmergency = () => {
    setActiveCaseId(null);
    localStorage.removeItem(ACTIVE_CASE_ID_KEY);
    setCurrentStep(1);
  };

  return (
    <EmergencyContext.Provider
      value={{
        activeCase,
        allCases,
        hospitals,
        ambulances,
        currentStep,
        setCurrentStep,
        startEmergency,
        updateLocation,
        setSnakeIdentification,
        submitBiteAssessment,
        selectHospital,
        dispatchNearestHospital,
        confirmEmergencyRequest,
        requestAmbulance,
        updateCaseStatus,
        resetEmergency,
        reloadAll
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const ctx = useContext(EmergencyContext);
  if (!ctx) throw new Error('useEmergency must be used within an EmergencyProvider');
  return ctx;
};
