import React, { useState } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  PhoneCall,
  Activity,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Hospital,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { MedicalWarningBanner } from '../../components/MedicalWarningBanner';

export const Home: React.FC = () => {
  const { startEmergency, activeCase } = useEmergency();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleStartEmergency = () => {
    setShowConfirmModal(true);
  };

  const confirmAndProceed = () => {
    setShowConfirmModal(false);
    startEmergency();
    navigate('/patient/location');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100 pb-20">
      {/* Hero Container */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-12 w-full text-center flex-1 flex flex-col justify-center">
        {/* Urgent Callout Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-brand-darkRed text-xs sm:text-sm font-extrabold mx-auto mb-6 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-ping" />
          <span>SNAKE BITE EMERGENCY RAPID RESPONSE</span>
        </div>

        {/* Title and Tagline */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          SnakeSafe
        </h1>
        <p className="mt-2 text-xl sm:text-2xl font-bold text-brand-blue tracking-tight">
          Snake Bite Emergency Response System
        </p>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
          “From Bite to Treatment — Faster, Safer, Smarter”
        </p>

        {/* Big Emergency Button (Screen 1 Focal Point) */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center">
          <button
            onClick={handleStartEmergency}
            className="group relative w-full max-w-md bg-gradient-to-r from-brand-red via-red-600 to-rose-700 hover:from-red-700 hover:to-brand-darkRed text-white py-6 sm:py-7 px-8 rounded-2xl sm:rounded-3xl font-black text-xl sm:text-2xl shadow-emergency transform active:scale-95 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-4 border-2 border-red-400/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <ShieldAlert className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-left">
              <span className="block leading-none uppercase tracking-wider text-xs sm:text-sm text-red-200 font-bold">
                Tap Here In Emergency
              </span>
              <span className="block tracking-tight text-white mt-1">
                Emergency Snake Bite
              </span>
            </div>
          </button>

          <p className="text-xs text-slate-500 font-semibold mt-3 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Pre-alerts hospitals & dispatches antivenom emergency support immediately</span>
          </p>
        </div>

        {/* If an active case already exists, give direct shortcut */}
        {activeCase && (
          <div className="mt-6 max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-2xl text-left flex items-center justify-between shadow-sm">
            <div>
              <div className="text-xs font-bold text-red-800 uppercase tracking-wide">
                Case in Progress: #{activeCase.caseNumber}
              </div>
              <div className="text-xs text-slate-600 font-medium mt-0.5">
                Status: {activeCase.status.replace(/_/g, ' ')}
              </div>
            </div>
            <button
              onClick={() => navigate('/patient/location')}
              className="px-3 py-1.5 bg-brand-red text-white text-xs font-bold rounded-lg hover:bg-brand-darkRed transition-colors flex items-center space-x-1"
            >
              <span>Resume</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Mandatory Safety Notice */}
        <div className="mt-10 max-w-2xl mx-auto text-left">
          <MedicalWarningBanner />
        </div>

        {/* 3 Pillars Overview */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-brand-lightBlue transition-all">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">AI Snake Triage</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Instant AI photo analysis & questionnaire to estimate venomous group without delaying transit.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-emerald-400 transition-all">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Hospital className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Antivenom Finder</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Identifies verified hospitals with antivenom stocks, 24x7 trauma teams, and ICU availability.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 transition-all">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Hospital Pre-Alert</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Pushes live clinical dossiers to ER doctors before patient arrival to prep antivenom vials.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal (Screen 1 Step in Flowchart) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center transform transition-all scale-100">
            <div className="w-16 h-16 rounded-full bg-red-100 text-brand-red flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Confirm Emergency?
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
              You are about to initiate an active emergency protocol. This will locate nearby hospitals with antivenom services and prepare ambulance transport.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmAndProceed}
                className="flex-1 py-3.5 px-5 bg-brand-red hover:bg-brand-darkRed text-white font-extrabold rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider"
              >
                Yes, Continue
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm"
              >
                No, Back Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
