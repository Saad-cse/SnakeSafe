import React, { useState } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Building2,
  MapPin,
  Clock,
  Phone,
  Syringe,
  HeartPulse,
  Send,
  ArrowLeft,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { EmergencyMap } from '../../components/EmergencyMap';
import { MedicalWarningBanner } from '../../components/MedicalWarningBanner';

export const HospitalConfirmStep: React.FC = () => {
  const { activeCase, confirmEmergencyRequest } = useEmergency();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const hospital = activeCase?.selectedHospital;

  if (!hospital) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-600 font-medium">No hospital has been selected yet.</p>
        <button
          onClick={() => navigate('/patient/hospitals')}
          className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-lg font-bold text-xs"
        >
          Return to Hospital Finder
        </button>
      </div>
    );
  }

  const handleSendEmergencyRequest = async () => {
    setIsSubmitting(true);
    try {
      await confirmEmergencyRequest();
      navigate('/patient/ambulance');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-bold mb-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>STEP 7 OF 8</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Confirm Selected Hospital
        </h2>
        <p className="text-sm text-slate-600 font-medium mt-1">
          Review emergency facility dossier and dispatch pre-arrival alert to trauma center.
        </p>
      </div>

      {/* Hospital Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card-soft p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Building2 className="w-6 h-6 text-brand-blue" />
              <h3 className="text-xl font-extrabold text-slate-900">{hospital.name}</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
              <span>{hospital.address}</span>
            </p>
          </div>

          <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
            <span className="text-2xl font-black text-slate-900 block leading-none">
              {hospital.distanceKm} km
            </span>
            <span className="text-xs font-bold text-emerald-600 block mt-1">
              Estimated Travel Time: ~{hospital.etaMinutes} mins
            </span>
          </div>
        </div>

        {/* Services & Inventory Grid */}
        <div className="py-6 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs mb-1">
              <Syringe className="w-4 h-4" />
              <span>Antivenom Stock</span>
            </div>
            <p className="text-sm font-black text-emerald-950">
              {hospital.antivenomAvailable ? `${hospital.antivenomVials} Vials Ready` : 'Unavailable'}
            </p>
            <p className="text-[10px] text-emerald-700">Polyvalent serum verified</p>
          </div>

          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2 text-brand-blue font-bold text-xs mb-1">
              <HeartPulse className="w-4 h-4" />
              <span>ICU & Ventilators</span>
            </div>
            <p className="text-sm font-black text-blue-950">
              {hospital.icuAvailable ? 'Critical Beds Available' : 'No Critical ICU'}
            </p>
            <p className="text-[10px] text-blue-700">Intubation & respiratory support</p>
          </div>

          <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs mb-1">
              <Phone className="w-4 h-4" />
              <span>Emergency Desk</span>
            </div>
            <p className="text-sm font-black text-purple-950">{hospital.phone}</p>
            <p className="text-[10px] text-purple-700">24×7 Trauma Doctor on call</p>
          </div>
        </div>

        {/* Tactical Directions Map */}
        <div className="pt-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Emergency Transit Route
          </span>
          <EmergencyMap
            hospitals={[hospital]}
            selectedHospital={hospital}
            height="260px"
            showRoute={true}
          />
        </div>

        {/* Case ID Generation Notification */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 text-brand-red flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Emergency Case ID</span>
              <p className="text-sm font-extrabold text-slate-900">
                #{activeCase?.caseNumber || 'SS1024'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
            Database Linked
          </span>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <button
            type="button"
            onClick={() => navigate('/patient/hospitals')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Choose Different Hospital</span>
          </button>

          <button
            type="button"
            onClick={handleSendEmergencyRequest}
            disabled={isSubmitting}
            className="w-full sm:w-auto py-3.5 px-8 bg-brand-red hover:bg-brand-darkRed text-white font-black rounded-xl shadow-lg text-sm uppercase tracking-wider transition-all transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Dispatching Alert...' : 'Send Emergency Request'}</span>
          </button>
        </div>
      </div>

      <MedicalWarningBanner />
    </div>
  );
};
