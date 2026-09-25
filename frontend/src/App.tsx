import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EmergencyProvider, useEmergency } from './contexts/EmergencyContext';
import { Header } from './components/Header';
import { QuickRoleBar } from './components/QuickRoleBar';
import { ProgressStepper } from './components/ProgressStepper';

// Patient Flow Pages
import { Home } from './pages/patient/Home';
import { LocationStep } from './pages/patient/LocationStep';
import { SnakePhotoStep } from './pages/patient/SnakePhotoStep';
import { QuestionnaireStep } from './pages/patient/QuestionnaireStep';
import { BiteAssessmentStep } from './pages/patient/BiteAssessmentStep';
import { HospitalFinderStep } from './pages/patient/HospitalFinderStep';
import { HospitalConfirmStep } from './pages/patient/HospitalConfirmStep';
import { AmbulanceStep } from './pages/patient/AmbulanceStep';

// Hospital, Driver & Admin Pages
import { HospitalDashboard } from './pages/hospital/HospitalDashboard';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentStep } = useEmergency();

  const isPatientFlow = location.pathname.startsWith('/patient') && location.pathname !== '/patient';

  // Map route to step number
  const getStepFromPath = (path: string): number => {
    if (path.includes('/location')) return 2;
    if (path.includes('/snake-id')) return 3;
    if (path.includes('/questionnaire')) return 4;
    if (path.includes('/bite-assessment')) return 5;
    if (path.includes('/hospitals')) return 6;
    if (path.includes('/confirm-hospital')) return 7;
    if (path.includes('/ambulance')) return 8;
    return 1;
  };

  const handleStepClick = (stepNum: number) => {
    switch (stepNum) {
      case 1: navigate('/'); break;
      case 2: navigate('/patient/location'); break;
      case 3: navigate('/patient/snake-id'); break;
      case 5: navigate('/patient/bite-assessment'); break;
      case 6: navigate('/patient/hospitals'); break;
      case 7: navigate('/patient/confirm-hospital'); break;
      case 8: navigate('/patient/ambulance'); break;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16">
      <Header />

      {/* Progress Stepper for Patient Flow */}
      {isPatientFlow && (
        <ProgressStepper
          currentStep={getStepFromPath(location.pathname)}
          onStepClick={handleStepClick}
        />
      )}

      {/* Main Page Routes */}
      <main className="flex-1">
        <Routes>
          {/* Patient 8 Steps Flow */}
          <Route path="/" element={<Home />} />
          <Route path="/patient" element={<Navigate to="/" replace />} />
          <Route path="/patient/location" element={<LocationStep />} />
          <Route path="/patient/snake-id" element={<SnakePhotoStep />} />
          <Route path="/patient/questionnaire" element={<QuestionnaireStep />} />
          <Route path="/patient/bite-assessment" element={<BiteAssessmentStep />} />
          <Route path="/patient/hospitals" element={<HospitalFinderStep />} />
          <Route path="/patient/confirm-hospital" element={<HospitalConfirmStep />} />
          <Route path="/patient/ambulance" element={<AmbulanceStep />} />

          {/* Hospital / Doctor Dashboard */}
          <Route path="/hospital/*" element={<HospitalDashboard />} />

          {/* Ambulance Driver App */}
          <Route path="/driver/*" element={<DriverDashboard />} />

          {/* System Admin Panel */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Floating Multi-Role Switcher for testing all perspectives */}
      <QuickRoleBar />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <EmergencyProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </EmergencyProvider>
    </AuthProvider>
  );
};

export default App;
