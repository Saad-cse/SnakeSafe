// SnakeSafe TypeScript Domain Models

export type UserRole = 'PATIENT' | 'DOCTOR' | 'HOSPITAL_STAFF' | 'AMBULANCE_DRIVER' | 'ADMIN';

export type CaseStatus =
  | 'CREATED'
  | 'LOCATION_CONFIRMED'
  | 'SNAKE_IDENTIFICATION_PENDING'
  | 'SNAKE_IDENTIFIED'
  | 'BITE_ASSESSMENT_COMPLETE'
  | 'HOSPITAL_SELECTED'
  | 'EMERGENCY_REQUESTED'
  | 'HOSPITAL_ACCEPTED'
  | 'HOSPITAL_REJECTED'
  | 'AMBULANCE_REQUESTED'
  | 'AMBULANCE_ASSIGNED'
  | 'AMBULANCE_EN_ROUTE'
  | 'PATIENT_PICKED_UP'
  | 'PATIENT_ARRIVED'
  | 'TREATMENT_STARTED'
  | 'COMPLETED'
  | 'CANCELLED';

export type UrgencyLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  hospitalId?: string;
  ambulanceId?: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergencyAvailable: boolean;
  snakeBiteService: boolean;
  antivenomAvailable: boolean;
  antivenomVials?: number;
  icuAvailable: boolean;
  verified: boolean;
  distanceKm?: number;
  etaMinutes?: number;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  currentLatitude: number;
  currentLongitude: number;
  status: 'AVAILABLE' | 'EN_ROUTE' | 'BUSY' | 'OFFLINE';
  etaMinutes?: number;
}

export interface SnakeIdentificationResult {
  possibleSpecies: string;
  possibleGroup: string;
  confidence: number;
  confidenceLevel: string;
  venomous: boolean;
  antivenomType: string;
  riskLevel: string;
  keyFeatures: string[];
  warning: string;
  method?: 'PHOTO_AI' | 'QUESTIONNAIRE';
}

export interface QuestionnaireAnswers {
  color: string;
  pattern: string;
  approximateLength: string;
  headShape: string;
  timeOfDay: string;
  hoodSpread: string;
  nearWater: string;
  behavior: string;
}

export interface BiteAssessment {
  biteTime: string;
  biteLocation: string; // 'Hand', 'Arm', 'Leg', 'Foot', 'Face', 'Torso', 'Other'
  symptoms: string[];
  notes?: string;
  urgencyLevel: UrgencyLevel;
}

export interface EmergencyCase {
  id: string;
  caseNumber: string; // e.g. "SS1024"
  patientId: string;
  patientName: string;
  patientPhone: string;
  latitude: number;
  longitude: number;
  address: string;
  
  // Snake Identification
  snakeImageUrl?: string;
  possibleSpecies?: string;
  possibleGroup?: string;
  confidence?: number;
  identificationMethod?: 'PHOTO_AI' | 'QUESTIONNAIRE' | 'NONE';
  identificationData?: SnakeIdentificationResult;

  // Bite Assessment
  biteTime?: string;
  biteLocation?: string;
  symptoms: string[];
  notes?: string;
  urgencyLevel: UrgencyLevel;

  // Hospital
  selectedHospitalId?: string;
  selectedHospital?: Hospital;

  // Ambulance
  ambulanceRequested?: boolean;
  ambulanceId?: string;
  ambulance?: Ambulance;

  // Lifecycle
  status: CaseStatus;
  statusHistory: Array<{
    status: CaseStatus;
    updatedBy: string;
    timestamp: string;
    notes?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'EMERGENCY' | 'INFO' | 'SUCCESS' | 'WARNING';
  timestamp: string;
  caseId?: string;
  read: boolean;
}
