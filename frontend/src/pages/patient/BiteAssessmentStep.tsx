import React, { useState } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Clock,
  CheckSquare,
  Square,
  ArrowRight,
  ShieldAlert,
  Flame,
  UserCheck
} from 'lucide-react';
import { MedicalWarningBanner } from '../../components/MedicalWarningBanner';
import { UrgencyLevel } from '../../types';

export const BiteAssessmentStep: React.FC = () => {
  const { activeCase, submitBiteAssessment } = useEmergency();
  const navigate = useNavigate();

  const [biteTime, setBiteTime] = useState<string>(activeCase?.biteTime || '15 minutes ago');
  const [biteLocation, setBiteLocation] = useState<string>(activeCase?.biteLocation || 'Leg');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    activeCase?.symptoms && activeCase.symptoms.length > 0
      ? activeCase.symptoms
      : ['Swelling', 'Pain']
  );
  const [notes, setNotes] = useState<string>(activeCase?.notes || '');
  const [showUrgencyBanner, setShowUrgencyBanner] = useState<boolean>(false);

  const biteLocations = ['Hand', 'Arm', 'Leg', 'Foot', 'Face', 'Torso', 'Other'];

  const symptomList = [
    'Swelling',
    'Pain',
    'Bleeding',
    'Vomiting',
    'Dizziness',
    'Blurred vision',
    'Difficulty breathing',
    'Weakness',
    'Muscle weakness',
    'Drooping eyelids',
    'Difficulty speaking',
    'Other'
  ];

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const calculateUrgency = (): UrgencyLevel => {
    const neuroSymptoms = ['Difficulty breathing', 'Drooping eyelids', 'Difficulty speaking', 'Blurred vision'];
    const hasNeuro = selectedSymptoms.some(s => neuroSymptoms.includes(s));
    if (hasNeuro || selectedSymptoms.length >= 3) {
      return 'CRITICAL';
    }
    return 'HIGH';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urgency = calculateUrgency();
    setShowUrgencyBanner(true);
    
    // Auto transition to Hospital Finder after showing the urgency warning
    setTimeout(() => {
      submitBiteAssessment({
        biteTime,
        biteLocation,
        symptoms: selectedSymptoms,
        notes,
        urgencyLevel: urgency
      });
      navigate('/patient/hospitals');
    }, 1100);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-brand-red text-xs font-bold mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>STEP 5 OF 8</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Bite Assessment & Symptoms
        </h2>
        <p className="text-sm text-slate-600 font-medium mt-1">
          Provide anatomical bite position and observed physiological symptoms to triage emergency response.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-card-soft p-6 sm:p-8 space-y-6">
        {/* 1. Time of Bite */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-blue" />
            <span>Time of Bite</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {['Just now (<10m)', '15 minutes ago', '30-60 mins ago', '> 1 hour ago'].map(t => (
              <button
                type="button"
                key={t}
                onClick={() => setBiteTime(t)}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                  biteTime === t
                    ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Body Location of Bite */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Bite Location on Body
          </label>
          <div className="flex flex-wrap gap-2">
            {biteLocations.map(loc => (
              <button
                type="button"
                key={loc}
                onClick={() => setBiteLocation(loc)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  biteLocation === loc
                    ? 'bg-brand-red text-white border-brand-red shadow-sm scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Symptoms (Multi-select) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Symptoms (Select all currently noticed)</span>
            <span className="text-[11px] font-normal text-slate-400">
              {selectedSymptoms.length} selected
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {symptomList.map(sym => {
              const isSelected = selectedSymptoms.includes(sym);
              const isSevere = ['Difficulty breathing', 'Drooping eyelids', 'Difficulty speaking'].includes(sym);

              return (
                <button
                  type="button"
                  key={sym}
                  onClick={() => toggleSymptom(sym)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border flex items-center space-x-2 ${
                    isSelected
                      ? isSevere
                        ? 'bg-red-50 text-brand-darkRed border-red-400 font-bold ring-1 ring-red-300'
                        : 'bg-blue-50 text-brand-blue border-blue-400 font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-brand-red flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <span className="truncate">{sym}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Additional Clinical Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Additional Clinical Observations / Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Swelling spreading above ankle, two distinct puncture marks visible, victim feels drowsy..."
            rows={2}
            className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-brand-blue"
          />
        </div>

        {/* Urgency Level Generation Display (Flowchart Screen 5) */}
        {showUrgencyBanner && (
          <div className="p-5 bg-brand-darkRed text-white rounded-2xl flex items-center space-x-4 shadow-xl animate-pulse">
            <ShieldAlert className="w-9 h-9 text-rose-300 flex-shrink-0" />
            <div>
              <p className="text-base sm:text-lg font-black tracking-tight uppercase">
                ⚠ EMERGENCY — SEEK MEDICAL CARE IMMEDIATELY
              </p>
              <p className="text-xs text-rose-100 mt-0.5 font-medium">
                System generated urgency: {calculateUrgency()} • Routing to equipped antivenom hospitals now...
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {!showUrgencyBanner && (
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto py-3.5 px-8 bg-brand-red hover:bg-brand-darkRed text-white font-extrabold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2"
            >
              <span>Submit Assessment & Find Hospitals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>

      {/* Medical Safety Disclaimer */}
      <div className="mt-6">
        <MedicalWarningBanner customText="Do not apply tight tourniquets, do not make incisional cuts, and do not attempt to suck out venom. Keep patient calm and immobilize the bitten limb while proceeding to hospital." />
      </div>
    </div>
  );
};
