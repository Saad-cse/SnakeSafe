import React, { useState, useEffect } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Truck,
  Navigation,
  MapPin,
  Building2,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { EmergencyMap } from '../../components/EmergencyMap';
import { CaseStatus } from '../../types';

export const DriverDashboard: React.FC = () => {
  const { allCases, updateCaseStatus } = useEmergency();
  const { currentUser } = useAuth();

  // Find assigned or unassigned emergency case requiring ride
  const assignedCase = allCases.find(
    c => ['AMBULANCE_REQUESTED', 'AMBULANCE_ASSIGNED', 'AMBULANCE_EN_ROUTE', 'PATIENT_PICKED_UP'].includes(c.status)
  ) || allCases[0];

  const [rideAccepted, setRideAccepted] = useState<boolean>(
    Boolean(assignedCase && ['AMBULANCE_ASSIGNED', 'AMBULANCE_EN_ROUTE', 'PATIENT_PICKED_UP'].includes(assignedCase.status))
  );
  const [navStep, setNavStep] = useState<number>(1);
  const [driverProgress, setDriverProgress] = useState<number>(30);

  // Status transitions matching Flowchart Screen 10
  const statusPipeline: { status: CaseStatus; label: string; action: string }[] = [
    { status: 'AMBULANCE_ASSIGNED', label: 'Accepted Ride', action: 'Signal: En Route to Patient' },
    { status: 'AMBULANCE_EN_ROUTE', label: 'Arriving at Patient Scene', action: 'Signal: Arrived at Scene' },
    { status: 'PATIENT_PICKED_UP', label: 'Patient Picked Up & Stabilized', action: 'Signal: En Route to Hospital' },
    { status: 'PATIENT_ARRIVED', label: 'Arrived at Hospital ER Bay', action: 'Handover Patient to ER' },
  ];

  const handleAcceptRide = async () => {
    if (!assignedCase) return;
    setRideAccepted(true);
    await updateCaseStatus(
      assignedCase.id,
      'AMBULANCE_ASSIGNED',
      currentUser.name,
      'Ambulance driver accepted emergency dispatch'
    );
  };

  const handleNextStatus = async () => {
    if (!assignedCase) return;
    const currentIdx = statusPipeline.findIndex(s => s.status === assignedCase.status);
    const nextItem = statusPipeline[currentIdx + 1] || statusPipeline[statusPipeline.length - 1];
    
    await updateCaseStatus(
      assignedCase.id,
      nextItem.status,
      currentUser.name,
      `Ambulance status updated: ${nextItem.label}`
    );
    setDriverProgress(prev => Math.min(prev + 25, 95));
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 font-sans">
      {/* Mobile-first Driver Cockpit Header */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-md mb-4 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm">{currentUser.name}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                ON DUTY
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Unit: DL-01-EM-4920 (ALS)</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-xs text-emerald-400 font-bold">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>GPS CONNECTED</span>
        </div>
      </div>

      {!assignedCase ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Truck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No pending ambulance calls in your sector.</p>
        </div>
      ) : !rideAccepted ? (
        /* INCOMING DISPATCH REQUEST (Flowchart Screen 10) */
        <div className="bg-white rounded-2xl border-2 border-brand-red shadow-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-brand-darkRed font-black text-sm uppercase tracking-wide">
              <AlertTriangle className="w-5 h-5 text-brand-red animate-pulse" />
              <span>New Emergency Request</span>
            </div>
            <span className="text-xs font-bold bg-red-100 text-red-800 px-2.5 py-1 rounded-full">
              CASE #{assignedCase.caseNumber}
            </span>
          </div>

          {/* Location & Destination info */}
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Patient Pickup Location
              </span>
              <p className="font-extrabold text-slate-800 text-sm mt-0.5 flex items-start space-x-1.5">
                <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                <span>{assignedCase.address}</span>
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Hospital Destination
              </span>
              <p className="font-extrabold text-brand-blue text-sm mt-0.5 flex items-start space-x-1.5">
                <Building2 className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
                <span>{assignedCase.selectedHospital?.name || 'Apex Trauma & Emergency'}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-amber-50 rounded-xl text-amber-900 font-bold">
                <span className="text-[10px] text-amber-700 block uppercase">ETA to Scene</span>
                <span className="text-base">~6 minutes</span>
              </div>
              <div className="p-2.5 bg-purple-50 rounded-xl text-purple-900 font-bold">
                <span className="text-[10px] text-purple-700 block uppercase">Species Triage</span>
                <span className="text-base truncate block">{assignedCase.possibleGroup || 'Cobra-like'}</span>
              </div>
            </div>
          </div>

          {/* Accept Ride Button (Flowchart Screen 10) */}
          <button
            onClick={handleAcceptRide}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg text-sm uppercase tracking-wider transition-all transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Accept Ride & Start Navigation</span>
          </button>
        </div>
      ) : (
        /* LIVE NAVIGATION & STATUS PIPELINE (Flowchart Screen 10) */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card-soft p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Tactical Navigation
              </span>
              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                {assignedCase.status.replace(/_/g, ' ')}
              </span>
            </div>

            {/* Tactical GPS Map */}
            <EmergencyMap
              selectedHospital={assignedCase.selectedHospital}
              ambulanceProgress={driverProgress}
              height="260px"
              showRoute={true}
            />

            {/* Navigation Milestones */}
            <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 font-bold text-[10px] uppercase">
                <span>Route Progress</span>
                <span>Speed: 58 km/h</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-lightBlue h-full transition-all duration-500"
                  style={{ width: `${driverProgress}%` }}
                />
              </div>
            </div>

            {/* Status progression control button (Flowchart Screen 10) */}
            <div className="pt-2">
              <button
                onClick={handleNextStatus}
                className="w-full py-3.5 px-5 bg-brand-blue hover:bg-blue-900 text-white font-extrabold rounded-xl shadow text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all"
              >
                <span>Advance Ride Milestone →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
