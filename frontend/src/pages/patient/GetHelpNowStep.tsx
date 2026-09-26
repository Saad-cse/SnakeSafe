import React, { useState, useMemo } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Phone,
  ShieldCheck,
  ChevronDown,
  Syringe,
  HeartPulse,
  Ambulance as AmbulanceIcon,
  Loader2
} from 'lucide-react';
import { Hospital } from '../../types';
import { MedicalWarningBanner } from '../../components/MedicalWarningBanner';

// This screen replaces the old 3-screen chain (Hospital Finder -> Hospital
// Confirm -> Ambulance Request) with a single "one tap to get help" action.
// The nearest capable hospital is pre-selected automatically; the full list
// is available but tucked behind a "Choose a different hospital" toggle so
// it never becomes the default path a victim has to navigate under duress.
export const GetHelpNowStep: React.FC = () => {
  const { hospitals, dispatchNearestHospital, selectHospital, requestAmbulance, confirmEmergencyRequest } = useEmergency();
  const navigate = useNavigate();

  const sortedHospitals = useMemo(
    () => [...hospitals].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0)),
    [hospitals]
  );
  const nearest = sortedHospitals[0];

  const [showAllHospitals, setShowAllHospitals] = useState(false);
  const [pickedHospital, setPickedHospital] = useState<Hospital | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchError, setDispatchError] = useState<string | null>(null);

  const activeHospital = pickedHospital || nearest;

  const handleDispatch = async () => {
    if (isDispatching || !activeHospital) return;
    setIsDispatching(true);
    setDispatchError(null);
    try {
      if (pickedHospital) {
        // A different hospital was manually chosen — run the same 3 steps
        // dispatchNearestHospital would, just against that hospital instead.
        await selectHospital(pickedHospital);
        await confirmEmergencyRequest();
        await requestAmbulance();
      } else {
        await dispatchNearestHospital();
      }
      navigate('/patient/ambulance');
    } catch (err) {
      console.error('Dispatch failed:', err);
      setDispatchError("Couldn't reach the dispatch service — please try again.");
      setIsDispatching(false);
    }
  };

  if (!nearest) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <p className="text-slate-700 font-semibold">No hospitals found nearby yet — please wait a moment and try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-brand-red text-xs font-bold mb-2">
          <AmbulanceIcon className="w-3.5 h-3.5" />
          <span>STEP 2 OF 2 — GET HELP NOW</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Ready to dispatch help
        </h2>
        <p className="text-sm text-slate-600 font-medium mt-1">
          Don't wait to identify the snake first — get moving toward treatment now.
        </p>
      </div>

      {/* Pre-selected nearest hospital card */}
      <div className="bg-white rounded-2xl border-2 border-emerald-300 ring-2 ring-emerald-50 shadow-sm p-5 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            {pickedHospital ? 'SELECTED HOSPITAL' : 'NEAREST — AUTO-SELECTED'}
          </span>
          <span className="text-xs font-bold text-emerald-600">~{activeHospital.etaMinutes} min ETA</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-base text-slate-900">{activeHospital.name}</span>
          {activeHospital.verified && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{activeHospital.address} • {activeHospital.distanceKm} km away</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            activeHospital.antivenomAvailable ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}>
            <Syringe className="w-3 h-3" />
            <span>{activeHospital.antivenomAvailable ? 'Antivenom Stocked' : 'Antivenom Unknown'}</span>
          </span>
          <span className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
            activeHospital.icuAvailable ? 'bg-blue-50 text-brand-blue border-blue-200' : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}>
            <HeartPulse className="w-3 h-3" />
            <span>ICU / Critical Care</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-600 font-semibold pt-2 mt-2 border-t border-slate-100">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span>ER Line: {activeHospital.phone}</span>
        </div>
      </div>

      {/* Change hospital toggle — deliberately de-emphasized */}
      <button
        type="button"
        onClick={() => setShowAllHospitals(!showAllHospitals)}
        className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-700 py-2 mb-4 flex items-center justify-center space-x-1"
      >
        <span>Choose a different hospital instead</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllHospitals ? 'rotate-180' : ''}`} />
      </button>

      {showAllHospitals && (
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {sortedHospitals.map(h => (
            <button
              key={h.id}
              onClick={() => { setPickedHospital(h); setShowAllHospitals(false); }}
              className={`w-full text-left p-3 rounded-xl border transition-colors ${
                activeHospital.id === h.id ? 'border-brand-red bg-red-50' : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{h.name}</span>
                <span className="text-xs font-bold text-slate-500">{h.distanceKm} km</span>
              </div>
              <p className="text-[11px] text-slate-500">{h.address}</p>
            </button>
          ))}
        </div>
      )}

      {dispatchError && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-semibold">
          {dispatchError}
        </div>
      )}

      <button
        onClick={handleDispatch}
        disabled={isDispatching}
        className="w-full py-4 px-6 bg-brand-red hover:bg-brand-darkRed text-white font-extrabold rounded-xl shadow-lg transition-all text-base flex items-center justify-center space-x-2 disabled:opacity-70"
      >
        {isDispatching ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Dispatching...</span>
          </>
        ) : (
          <>
            <AmbulanceIcon className="w-5 h-5" />
            <span>Dispatch Ambulance Now</span>
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-slate-400 font-medium mt-3">
        You'll be able to help identify the snake and describe symptoms right after this — it won't delay the ambulance.
      </p>

      <a
        href="tel:108"
        className="mt-4 w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors"
      >
        <Phone className="w-3.5 h-3.5" />
        <span>Prefer to call 108 directly instead?</span>
      </a>

      <div className="mt-8">
        <MedicalWarningBanner />
      </div>
    </div>
  );
};
