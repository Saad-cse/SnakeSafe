import React, { useState, useEffect } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import {
  PhoneCall,
  Truck,
  MapPin,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Navigation,
  ArrowRight,
  AlertTriangle,
  Radio,
  ClipboardList,
  ChevronRight
} from 'lucide-react';
import { EmergencyMap } from '../../components/EmergencyMap';
import { MedicalWarningBanner } from '../../components/MedicalWarningBanner';

export const AmbulanceStep: React.FC = () => {
  const { activeCase, requestAmbulance, updateCaseStatus } = useEmergency();
  const navigate = useNavigate();

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [trackingMode, setTrackingMode] = useState<boolean>(
    Boolean(activeCase?.ambulanceRequested || activeCase?.ambulance)
  );
  const [simulatedProgress, setSimulatedProgress] = useState<number>(35);

  const ambulance = activeCase?.ambulance;
  const hospital = activeCase?.selectedHospital;

  // Handle SnakeSafe Ambulance Request
  const handleRequestSnakeSafeAmbulance = async () => {
    setIsSearching(true);
    // Realistic search animation
    setTimeout(async () => {
      await requestAmbulance();
      setIsSearching(false);
      setTrackingMode(true);
    }, 1200);
  };

  // Simulate ambulance movement along route
  useEffect(() => {
    if (!trackingMode) return;
    const timer = setInterval(() => {
      setSimulatedProgress(p => {
        if (p >= 95) return 95;
        return p + 5;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [trackingMode]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-brand-red text-xs font-bold mb-2">
          <Truck className="w-3.5 h-3.5" />
          <span>STEP 4 OF 4 — HELP IS ON THE WAY</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Ambulance Coordination
        </h2>
        <p className="text-sm text-slate-600 font-medium mt-1">
          Select direct emergency telephone dialer or request integrated GPS-tracked SnakeSafe emergency ambulance.
        </p>
      </div>

      {/* Two Choice Options (Flowchart Screen 8) */}
      {!trackingMode && !isSearching && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Option 1: Call Ambulance Directly */}
          <div className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Call Ambulance Directly</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Connect instantly with National Emergency 108 or Regional Ambulance Dispatch via telephone.
              </p>
            </div>
            <div className="mt-6">
              <a
                href="tel:108"
                className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Dial 108 Helpline</span>
              </a>
            </div>
          </div>

          {/* Option 2: Request Ambulance from SnakeSafe */}
          <div className="p-6 bg-white rounded-2xl border-2 border-brand-red shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-red text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
              RECOMMENDED
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-50 text-brand-red flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Request from SnakeSafe</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dispatches ALS unit pre-briefed on snakebite species and patient symptoms with live GPS navigation.
              </p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleRequestSnakeSafeAmbulance}
                className="w-full py-3.5 px-4 bg-brand-red hover:bg-brand-darkRed text-white font-black rounded-xl shadow-lg text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all transform active:scale-95"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>Request Ambulance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Searching State */}
      {isSearching && (
        <div className="p-10 bg-white rounded-2xl border border-slate-200 shadow-card-soft text-center mb-6">
          <RefreshCw className="w-10 h-10 text-brand-red animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900">
            Searching for nearby ambulance…
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Transmitting case #{activeCase?.caseNumber} coordinates to nearest Advanced Life Support fleet
          </p>
        </div>
      )}

      {/* Tracking State (Screen 8 & Screen 10 Integration) */}
      {trackingMode && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card-soft p-6 sm:p-8 mb-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                  Ambulance Requested & Dispatched
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                Live Ambulance Tracking
              </h3>
            </div>

            <div className="text-left sm:text-right bg-emerald-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
              <span className="text-xs text-slate-500 font-bold uppercase block">Estimated Arrival</span>
              <span className="text-2xl font-black text-emerald-600">
                ~{ambulance?.etaMinutes || 7} MINS
              </span>
            </div>
          </div>

          {/* Tactical Map with Live Ambulance */}
          <div>
            <EmergencyMap
              hospitals={hospital ? [hospital] : []}
              selectedHospital={hospital}
              ambulance={ambulance}
              ambulanceProgress={simulatedProgress}
              height="300px"
              showRoute={true}
            />
          </div>

          {/* Assigned Driver & Vehicle Details (Flowchart Screen 8) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
                <User className="w-5 h-5 text-brand-blue" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Driver</span>
                <p className="text-xs font-extrabold text-slate-800">
                  {ambulance?.driverName || 'Vikram Singh'}
                </p>
                <p className="text-[10px] text-slate-500">{ambulance?.driverPhone || '+91 98333 44556'}</p>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Vehicle Unit</span>
              <p className="text-xs font-extrabold text-slate-800">
                {ambulance?.vehicleNumber || 'DL-01-EM-4920 (ALS)'}
              </p>
              <p className="text-[10px] text-emerald-600 font-bold">Equipped with Oxygen & Antivenom Kit</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Current Status</span>
              <p className="text-xs font-black text-brand-blue">
                {activeCase?.status.replace(/_/g, ' ') || 'EN ROUTE TO PATIENT'}
              </p>
              <p className="text-[10px] text-slate-500">Live GPS telemetry updating</p>
            </div>
          </div>

          {/* Optional, non-blocking: help the doctor prepare */}
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
            {activeCase?.possibleSpecies || (activeCase?.symptoms && activeCase.symptoms.length > 0) ? (
              <div className="flex items-center space-x-2 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-bold">
                  Thanks — the doctor can already see what you've shared so far.
                </span>
              </div>
            ) : (
              <button
                onClick={() => navigate('/patient/snake-id')}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-blue-200 flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-4 h-4 text-brand-blue" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">Help the doctor prepare (optional)</p>
                    <p className="text-[11px] text-slate-500">Snake photo/ID + symptoms — takes ~30 seconds, never delays your ambulance</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </button>
            )}
          </div>

          {/* Shortcut to see what Doctor/Hospital sees */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">
              Hospital is prepped for your arrival.
            </span>
            <button
              onClick={() => navigate('/hospital')}
              className="py-2 px-4 bg-brand-blue hover:bg-blue-900 text-white font-bold rounded-lg flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <span>View Doctor / Hospital Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <MedicalWarningBanner />
    </div>
  );
};
