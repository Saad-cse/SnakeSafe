import { Hospital, Ambulance, User, EmergencyCase } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'u-patient-1',
    name: 'Rahul Sharma',
    email: 'patient@snakesafe.org',
    phone: '+91 98765 43210',
    role: 'PATIENT'
  },
  {
    id: 'u-doctor-1',
    name: 'Dr. Ananya Roy (Toxicologist)',
    email: 'doctor@citygeneral.org',
    phone: '+91 98111 22334',
    role: 'DOCTOR',
    hospitalId: 'hosp-1'
  },
  {
    id: 'u-staff-1',
    name: 'Nurse Rajesh Kumar',
    email: 'staff@citygeneral.org',
    phone: '+91 98222 33445',
    role: 'HOSPITAL_STAFF',
    hospitalId: 'hosp-1'
  },
  {
    id: 'u-driver-1',
    name: 'Vikram Singh (Ambulance Lead)',
    email: 'driver@snakesafe.org',
    phone: '+91 98333 44556',
    role: 'AMBULANCE_DRIVER',
    ambulanceId: 'amb-101'
  },
  {
    id: 'u-admin-1',
    name: 'Dr. Meera Patel (Chief Administrator)',
    email: 'admin@snakesafe.gov',
    phone: '+91 98999 00112',
    role: 'ADMIN'
  }
];

export const DEMO_HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'Apex Trauma & Multi-Specialty Hospital',
    address: 'Plot 42, Health City Boulevard, Sector 12',
    latitude: 28.6139,
    longitude: 77.2090,
    phone: '+91 11 2345 6789',
    emergencyAvailable: true,
    snakeBiteService: true,
    antivenomAvailable: true,
    antivenomVials: 45,
    icuAvailable: true,
    verified: true,
    distanceKm: 3.2,
    etaMinutes: 11
  },
  {
    id: 'hosp-2',
    name: 'Government District Civil Hospital',
    address: 'Ring Road, Civil Lines Medical Enclave',
    latitude: 28.6250,
    longitude: 77.2180,
    phone: '+91 11 2398 1100',
    emergencyAvailable: true,
    snakeBiteService: true,
    antivenomAvailable: true,
    antivenomVials: 80,
    icuAvailable: true,
    verified: true,
    distanceKm: 5.8,
    etaMinutes: 18
  },
  {
    id: 'hosp-3',
    name: 'St. Jude Emergency Center',
    address: '14 Cathedral Road, North Campus',
    latitude: 28.6380,
    longitude: 77.1950,
    phone: '+91 11 2766 5432',
    emergencyAvailable: true,
    snakeBiteService: true,
    antivenomAvailable: false,
    antivenomVials: 0,
    icuAvailable: true,
    verified: true,
    distanceKm: 7.4,
    etaMinutes: 24
  },
  {
    id: 'hosp-4',
    name: 'Rural Community Health Centre (CHC)',
    address: 'Highway 8, Kasna Village Junction',
    latitude: 28.5950,
    longitude: 77.2350,
    phone: '+91 120 289 9001',
    emergencyAvailable: true,
    snakeBiteService: false,
    antivenomAvailable: true,
    antivenomVials: 12,
    icuAvailable: false,
    verified: true,
    distanceKm: 9.1,
    etaMinutes: 29
  },
  {
    id: 'hosp-5',
    name: 'Metro Care Super-Specialty Institute',
    address: '88 Tech Park Expressway, South Extension',
    latitude: 28.5800,
    longitude: 77.1850,
    phone: '+91 11 4155 8899',
    emergencyAvailable: true,
    snakeBiteService: true,
    antivenomAvailable: true,
    antivenomVials: 35,
    icuAvailable: true,
    verified: true,
    distanceKm: 12.3,
    etaMinutes: 36
  },
  {
    id: 'hosp-6',
    name: 'Shree Krishna Charitable Hospital',
    address: 'Near Mandir Chowk, Old Subzi Mandi',
    latitude: 28.6490,
    longitude: 77.2100,
    phone: '+91 11 2382 7700',
    emergencyAvailable: false,
    snakeBiteService: false,
    antivenomAvailable: false,
    antivenomVials: 0,
    icuAvailable: false,
    verified: false,
    distanceKm: 14.5,
    etaMinutes: 42
  }
];

export const DEMO_AMBULANCES: Ambulance[] = [
  {
    id: 'amb-101',
    vehicleNumber: 'DL-01-EM-4920 (ALS Unit)',
    driverId: 'u-driver-1',
    driverName: 'Vikram Singh',
    driverPhone: '+91 98333 44556',
    currentLatitude: 28.6105,
    currentLongitude: 77.2050,
    status: 'AVAILABLE',
    etaMinutes: 8
  },
  {
    id: 'amb-102',
    vehicleNumber: 'DL-01-EM-1108 (BLS Unit)',
    driverId: 'u-driver-2',
    driverName: 'Mohd. Tariq',
    driverPhone: '+91 98444 55667',
    currentLatitude: 28.6220,
    currentLongitude: 77.2150,
    status: 'AVAILABLE',
    etaMinutes: 14
  },
  {
    id: 'amb-103',
    vehicleNumber: 'DL-01-EM-9922 (Critical ICU)',
    driverId: 'u-driver-3',
    driverName: 'Ramesh Chander',
    driverPhone: '+91 98555 66778',
    currentLatitude: 28.6010,
    currentLongitude: 77.1990,
    status: 'EN_ROUTE',
    etaMinutes: 6
  },
  {
    id: 'amb-104',
    vehicleNumber: 'DL-01-EM-3301 (Trauma Express)',
    driverId: 'u-driver-4',
    driverName: 'Kuldeep Yadav',
    driverPhone: '+91 98666 77889',
    currentLatitude: 28.6300,
    currentLongitude: 77.2280,
    status: 'OFFLINE',
    etaMinutes: 0
  }
];

export const INITIAL_PRE_SEEDED_CASES: EmergencyCase[] = [
  {
    id: 'case-demo-1024',
    caseNumber: 'SS1024',
    patientId: 'u-patient-1',
    patientName: 'Rahul Sharma',
    patientPhone: '+91 98765 43210',
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'Near Central Park, Connaught Place Sector 4',
    snakeImageUrl: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600&auto=format&fit=crop&q=80',
    possibleSpecies: 'Indian Spectacled Cobra (Naja naja)',
    possibleGroup: 'Cobra-like',
    confidence: 0.72,
    identificationMethod: 'PHOTO_AI',
    identificationData: {
      possibleSpecies: 'Indian Spectacled Cobra (Naja naja)',
      possibleGroup: 'Cobra-like',
      confidence: 0.72,
      confidenceLevel: 'Medium',
      venomous: true,
      antivenomType: 'Polyvalent Antivenom',
      riskLevel: 'Critical - Neurotoxic',
      keyFeatures: ['Distinct neck hood', 'Round pupils', 'Neurotoxic risk'],
      warning: '⚠ This is only an estimate. Do not delay medical treatment.'
    },
    biteTime: '15 minutes ago',
    biteLocation: 'Right leg',
    symptoms: ['Swelling', 'Pain', 'Dizziness'],
    notes: 'Patient felt sudden sharp puncture pain in tall grass. Swelling spreading above ankle.',
    urgencyLevel: 'CRITICAL',
    selectedHospitalId: 'hosp-1',
    selectedHospital: DEMO_HOSPITALS[0],
    ambulanceRequested: true,
    ambulanceId: 'amb-101',
    ambulance: DEMO_AMBULANCES[0],
    status: 'EMERGENCY_REQUESTED',
    statusHistory: [
      { status: 'CREATED', updatedBy: 'Rahul Sharma', timestamp: '2026-09-21T14:30:00Z', notes: 'Emergency initiated' },
      { status: 'LOCATION_CONFIRMED', updatedBy: 'Rahul Sharma', timestamp: '2026-09-21T14:31:00Z', notes: 'GPS detected' },
      { status: 'SNAKE_IDENTIFIED', updatedBy: 'AI Identification Engine', timestamp: '2026-09-21T14:32:10Z', notes: 'Cobra-like (72%)' },
      { status: 'BITE_ASSESSMENT_COMPLETE', updatedBy: 'Rahul Sharma', timestamp: '2026-09-21T14:33:00Z', notes: 'Right leg, swelling & pain' },
      { status: 'HOSPITAL_SELECTED', updatedBy: 'Rahul Sharma', timestamp: '2026-09-21T14:34:00Z', notes: 'Apex Trauma Selected' },
      { status: 'EMERGENCY_REQUESTED', updatedBy: 'Rahul Sharma', timestamp: '2026-09-21T14:35:00Z', notes: 'Dispatched pre-alert' },
    ],
    createdAt: '2026-09-21T14:30:00Z',
    updatedAt: '2026-09-21T14:35:00Z'
  },
  {
    id: 'case-demo-1025',
    caseNumber: 'SS1025',
    patientId: 'u-patient-2',
    patientName: 'Kavita Verma',
    patientPhone: '+91 98123 45678',
    latitude: 28.6250,
    longitude: 77.2180,
    address: 'Near Subzi Mandi, Civil Lines',
    possibleSpecies: "Russell's Viper (Daboia russelii)",
    possibleGroup: 'Viper-like',
    confidence: 0.81,
    identificationMethod: 'PHOTO_AI',
    identificationData: {
      possibleSpecies: "Russell's Viper (Daboia russelii)",
      possibleGroup: 'Viper-like',
      confidence: 0.81,
      confidenceLevel: 'High',
      venomous: true,
      antivenomType: 'Polyvalent Antivenom',
      riskLevel: 'Critical - Hemotoxic',
      keyFeatures: ['Triangular head', 'Brown chains of oval spots', 'Severe coagulopathy risk'],
      warning: '⚠ This is only an estimate. Do not delay medical treatment.'
    },
    biteTime: '30 minutes ago',
    biteLocation: 'Left Foot',
    symptoms: ['Bleeding', 'Swelling', 'Pain', 'Vomiting'],
    notes: 'Continuous oozing of blood from fang marks.',
    urgencyLevel: 'CRITICAL',
    selectedHospitalId: 'hosp-1',
    selectedHospital: DEMO_HOSPITALS[0],
    ambulanceRequested: true,
    ambulanceId: 'amb-103',
    ambulance: DEMO_AMBULANCES[2],
    status: 'TREATMENT_STARTED',
    statusHistory: [
      { status: 'CREATED', updatedBy: 'Kavita Verma', timestamp: '2026-09-21T13:10:00Z' },
      { status: 'HOSPITAL_ACCEPTED', updatedBy: 'Dr. Ananya Roy', timestamp: '2026-09-21T13:20:00Z' },
      { status: 'PATIENT_ARRIVED', updatedBy: 'Triage Nurse', timestamp: '2026-09-21T13:45:00Z' },
      { status: 'TREATMENT_STARTED', updatedBy: 'Dr. Ananya Roy', timestamp: '2026-09-21T13:50:00Z', notes: '10 vials of polyvalent antivenom infused' }
    ],
    createdAt: '2026-09-21T13:10:00Z',
    updatedAt: '2026-09-21T13:50:00Z'
  }
];
