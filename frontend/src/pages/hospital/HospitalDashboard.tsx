import React, { useState } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Building2,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  HeartPulse,
  User,
  ShieldAlert,
  Syringe,
  Truck,
  Eye,
  Settings,
  Users,
  LayoutDashboard,
  Calendar,
  Layers,
  FileCheck2,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { EmergencyCase, CaseStatus } from '../../types';
import { MedicalWarningBanner } from '../../components/MedicalWarningBanner';

export const HospitalDashboard: React.FC = () => {
  const { allCases, updateCaseStatus, reloadAll } = useEmergency();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'CASES' | 'PATIENTS' | 'AMBULANCES' | 'PROFILE'>('DASHBOARD');
  const [selectedCaseModal, setSelectedCaseModal] = useState<EmergencyCase | null>(null);

  // Filter cases relevant to this hospital
  const hospitalCases = allCases;
  const newRequests = hospitalCases.filter(c => c.status === 'EMERGENCY_REQUESTED');
  const activeCases = hospitalCases.filter(c =>
    ['HOSPITAL_ACCEPTED', 'AMBULANCE_REQUESTED', 'AMBULANCE_ASSIGNED', 'AMBULANCE_EN_ROUTE', 'PATIENT_PICKED_UP', 'PATIENT_ARRIVED', 'TREATMENT_STARTED'].includes(c.status)
  );
  const arrivingPatients = hospitalCases.filter(c =>
    ['AMBULANCE_EN_ROUTE', 'PATIENT_PICKED_UP'].includes(c.status)
  );
  const completedCases = hospitalCases.filter(c => c.status === 'COMPLETED');

  const handleAccept = async (c: EmergencyCase) => {
    await updateCaseStatus(c.id, 'HOSPITAL_ACCEPTED', currentUser.name, 'Case accepted by ER Chief');
  };

  const handleReject = async (c: EmergencyCase) => {
    await updateCaseStatus(c.id, 'HOSPITAL_REJECTED', currentUser.name, 'Diverted due to ICU saturation');
  };

  const handleAdvanceStatus = async (caseId: string, nextStatus: CaseStatus) => {
    await updateCaseStatus(caseId, nextStatus, currentUser.name);
    if (selectedCaseModal && selectedCaseModal.id === caseId) {
      setSelectedCaseModal(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-slate-100 font-sans">
      {/* Desktop Sidebar Navigation (Flowchart Screen 9) */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white tracking-tight leading-none">
                Apex Trauma Hospital
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold">
                Snakebite ER Unit • 24×7
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="p-3 space-y-1 flex-1 text-xs font-semibold">
          {[
            { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'CASES', label: 'Emergency Cases', icon: AlertTriangle, badge: newRequests.length },
            { id: 'PATIENTS', label: 'Patients & Triage', icon: Users },
            { id: 'AMBULANCES', label: 'Ambulances', icon: Truck },
            { id: 'PROFILE', label: 'Hospital Profile', icon: Building2 },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-brand-red text-white text-[10px] font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Doctor on duty status */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-cyan">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Clinical Toxicologist
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hospital Emergency Operations Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Real-time inbound snakebite patient dispatch, antivenom readiness & treatment workflow
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
              <Syringe className="w-4 h-4" />
              <span>Antivenom: 45 Vials Available</span>
            </span>
          </div>
        </div>

        {/* 4 Dashboard Metric Cards (Flowchart Screen 9) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Emergencies</span>
              <div className="w-7 h-7 rounded-lg bg-red-100 text-brand-red flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <span className="text-3xl font-black text-brand-red">{newRequests.length}</span>
            <span className="block text-[11px] text-slate-400 font-medium mt-1">Awaiting acceptance</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Cases</span>
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-blue flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <span className="text-3xl font-black text-brand-blue">{activeCases.length}</span>
            <span className="block text-[11px] text-slate-400 font-medium mt-1">In transit & ER floor</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patients Arriving</span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <span className="text-3xl font-black text-amber-600">{arrivingPatients.length}</span>
            <span className="block text-[11px] text-slate-400 font-medium mt-1">En route via ambulance</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Available Ambulances</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <span className="text-3xl font-black text-emerald-600">2</span>
            <span className="block text-[11px] text-slate-400 font-medium mt-1">ALS fleet ready</span>
          </div>
        </div>

        {/* NEW EMERGENCY REQUEST ALERT CARD (Flowchart Screen 9 Exact Match) */}
        {newRequests.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <h2 className="text-base font-extrabold text-brand-darkRed uppercase tracking-wider">
                Inbound Emergency Pre-Alerts (Action Required)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {newRequests.map(req => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border-2 border-red-500 shadow-lg p-6 relative overflow-hidden"
                >
                  {/* Top Header matching flowchart */}
                  <div className="bg-red-50 -mx-6 -mt-6 px-6 py-3 border-b border-red-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-brand-darkRed font-black text-sm uppercase tracking-wide">
                      <AlertTriangle className="w-4 h-4 text-brand-red" />
                      <span>New Emergency Request</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      11:18 PM
                    </span>
                  </div>

                  {/* Body Info matching flowchart Screen 9 */}
                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-bold text-slate-500">Patient ID:</span>
                      <span className="font-extrabold text-slate-900 font-mono text-sm">
                        {req.caseNumber} ({req.patientName})
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-bold text-slate-500">Possible Snake:</span>
                      <span className="font-bold text-brand-darkRed">
                        {req.possibleGroup || 'Cobra-like'} ({req.confidence ? `${Math.round(req.confidence * 100)}%` : 'Low Confidence'})
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-bold text-slate-500">Bite Location:</span>
                      <span className="font-bold text-slate-800">
                        {req.biteLocation || 'Right leg'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-bold text-slate-500">Symptoms:</span>
                      <span className="font-bold text-slate-800">
                        {req.symptoms.length > 0 ? req.symptoms.join(', ') : 'Swelling, Pain'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="font-bold text-slate-500">Ambulance:</span>
                      <span className="font-bold text-emerald-600">
                        Requested (ETA {req.ambulance?.etaMinutes || 12} min)
                      </span>
                    </div>
                  </div>

                  {/* Accept / Reject Buttons (Flowchart Screen 9) */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleAccept(req)}
                      className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow text-xs uppercase tracking-wider transition-all"
                    >
                      Accept Case
                    </button>
                    <button
                      onClick={() => handleReject(req)}
                      className="py-3 px-4 bg-red-100 hover:bg-red-200 text-brand-red font-bold rounded-xl text-xs uppercase tracking-wider transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVE CASES TABLE & CLINICAL TRIAGE (Screens 9 & 11) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Active Inbound & Treatment Cases
              </h3>
              <p className="text-xs text-slate-500">
                Manage patient arrivals, antivenom administration, and clinical resolution
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Case #</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Possible Snake / AI</th>
                  <th className="py-3 px-4">Bite & Symptoms</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4 text-right">Clinical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hospitalCases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {c.caseNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{c.patientName}</div>
                      <div className="text-[10px] text-slate-400">{c.patientPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-brand-darkRed block">
                        {c.possibleGroup || 'Suspected Venomous'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {c.confidence ? `${Math.round(c.confidence * 100)}% confidence` : 'Clinical Triage'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">{c.biteLocation}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {c.symptoms.join(', ')}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-brand-blue">
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedCaseModal(c)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors"
                      >
                        Clinical Dossier
                      </button>

                      {/* Progressive workflow buttons matching flowchart screens 9 & 11 */}
                      {c.status === 'HOSPITAL_ACCEPTED' && (
                        <button
                          onClick={() => handleAdvanceStatus(c.id, 'PATIENT_ARRIVED')}
                          className="px-3 py-1.5 bg-brand-blue hover:bg-blue-900 text-white rounded-lg font-bold text-[11px]"
                        >
                          Patient Arrived
                        </button>
                      )}

                      {c.status === 'PATIENT_ARRIVED' && (
                        <button
                          onClick={() => handleAdvanceStatus(c.id, 'TREATMENT_STARTED')}
                          className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-[11px]"
                        >
                          Start Treatment
                        </button>
                      )}

                      {c.status === 'TREATMENT_STARTED' && (
                        <button
                          onClick={() => handleAdvanceStatus(c.id, 'COMPLETED')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                        >
                          Complete Case
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Doctor Clinical Dossier Modal (Flowchart Screen 11) */}
        {selectedCaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-wider">
                    Emergency Clinical Dossier
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    Patient Case #{selectedCaseModal.caseNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCaseModal(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
                >
                  ✕
                </button>
              </div>

              {/* Dossier Fields */}
              <div className="py-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Patient Name</span>
                    <p className="font-bold text-slate-800 text-sm">{selectedCaseModal.patientName}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Bite Time</span>
                    <p className="font-bold text-slate-800 text-sm">{selectedCaseModal.biteTime || '15m ago'}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Bite Location</span>
                    <p className="font-bold text-brand-red text-sm">{selectedCaseModal.biteLocation}</p>
                  </div>
                </div>

                {/* Snake AI Information (Supporting Only notice) */}
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                    AI Species Identification Estimate (Supporting Clinical Aid)
                  </span>
                  <p className="text-base font-black text-purple-950">
                    {selectedCaseModal.possibleGroup} — {selectedCaseModal.possibleSpecies}
                  </p>
                  <p className="text-xs text-purple-800 mt-1">
                    Confidence: {selectedCaseModal.confidence ? `${Math.round(selectedCaseModal.confidence * 100)}%` : 'Observation based'} • Suggested Protocol: Polyvalent Snake Antivenom (ASV)
                  </p>
                </div>

                {/* Symptoms Multi-list */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Reported Symptoms
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCaseModal.symptoms.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-red-50 text-brand-darkRed rounded-lg font-bold">
                        • {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress Transitions (Flowchart Screen 11) */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
                  <button
                    onClick={() => handleAdvanceStatus(selectedCaseModal.id, 'PATIENT_ARRIVED')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                  >
                    Mark Patient Arrived
                  </button>
                  <button
                    onClick={() => handleAdvanceStatus(selectedCaseModal.id, 'TREATMENT_STARTED')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                  >
                    Start Antivenom Treatment
                  </button>
                  <button
                    onClick={() => handleAdvanceStatus(selectedCaseModal.id, 'COMPLETED')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                  >
                    Complete & Discharge Case
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <MedicalWarningBanner />
      </main>
    </div>
  );
};
