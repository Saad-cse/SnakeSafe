import React, { useState, useMemo } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Phone,
  CheckCircle,
  XCircle,
  Navigation,
  List,
  Map as MapIcon,
  ShieldCheck,
  AlertCircle,
  Filter,
  ArrowRight,
  Syringe,
  HeartPulse
} from 'lucide-react';
import { Hospital } from '../../types';
import { EmergencyMap } from '../../components/EmergencyMap';
import { MedicalWarningBanner } from '../../components/MedicalWarningBanner';

export const HospitalFinderStep: React.FC = () => {
  const { hospitals, activeCase, selectHospital } = useEmergency();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'LIST' | 'MAP'>('LIST');
  const [filterAntivenomOnly, setFilterAntivenomOnly] = useState<boolean>(true);
  const [filterIcuOnly, setFilterIcuOnly] = useState<boolean>(false);
  const [filterSnakeOnly, setFilterSnakeOnly] = useState<boolean>(true);
  const [selectedHospitalLocal, setSelectedHospitalLocal] = useState<Hospital | null>(null);

  // Filtered and sorted hospitals list
  const filteredHospitals = useMemo(() => {
    return hospitals.filter(h => {
      if (filterAntivenomOnly && !h.antivenomAvailable) return false;
      if (filterIcuOnly && !h.icuAvailable) return false;
      if (filterSnakeOnly && !h.snakeBiteService) return false;
      return true;
    }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [hospitals, filterAntivenomOnly, filterIcuOnly, filterSnakeOnly]);

  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [selectError, setSelectError] = useState<string | null>(null);

  const handleSelect = async (h: Hospital) => {
    if (isSelecting) return;
    setIsSelecting(true);
    setSelectError(null);
    setSelectedHospitalLocal(h);
    try {
      await selectHospital(h);
      navigate('/patient/confirm-hospital');
    } catch (err) {
      console.error('Hospital selection failed:', err);
      setSelectError("Couldn't save your selection — please try again.");
      setIsSelecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>STEP 6 OF 8</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Nearby Hospital Finder
        </h2>
        <p className="text-sm text-slate-600 font-medium mt-1 max-w-xl mx-auto">
          Displaying specialized facilities matching antivenom inventory and critical trauma capabilities.
        </p>
      </div>

      {/* Critical Capability Advisory */}
      <div className="mb-4 p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-2.5 text-xs text-blue-900">
        <AlertCircle className="w-4 h-4 text-brand-blue flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Facility Capability Guidance: </span>
          The nearest hospital may not always be the best choice. Look for <strong>Antivenom Service</strong> and <strong>24×7 ICU/Critical Care</strong> capability badges before choosing.
        </div>
      </div>

      {/* Controls Bar: Filters & View Switcher */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center space-x-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </span>

          <button
            type="button"
            onClick={() => setFilterAntivenomOnly(!filterAntivenomOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
              filterAntivenomOnly
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Syringe className="w-3.5 h-3.5" />
            <span>Antivenom Stocked</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterIcuOnly(!filterIcuOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
              filterIcuOnly
                ? 'bg-brand-blue text-white border-brand-blue shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>ICU Critical Care</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterSnakeOnly(!filterSnakeOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
              filterSnakeOnly
                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Snake-Bite Unit</span>
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode('LIST')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${
              viewMode === 'LIST' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('MAP')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${
              viewMode === 'MAP' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* Selection Error Banner */}
      {selectError && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-semibold">
          {selectError}
        </div>
      )}

      {/* View Content */}
      {viewMode === 'MAP' ? (
        <div className="space-y-4">
          <EmergencyMap
            hospitals={filteredHospitals}
            selectedHospital={selectedHospitalLocal || filteredHospitals[0]}
            onSelectHospital={(h) => setSelectedHospitalLocal(h)}
            height="440px"
          />

          {selectedHospitalLocal && (
            <div className="p-4 bg-white rounded-xl border-2 border-brand-blue shadow-md flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">{selectedHospitalLocal.name}</h4>
                <p className="text-xs text-slate-500">{selectedHospitalLocal.address} • {selectedHospitalLocal.distanceKm} km</p>
              </div>
              <button
                onClick={() => handleSelect(selectedHospitalLocal)}
                disabled={isSelecting}
                className="py-2 px-5 bg-brand-red hover:bg-brand-darkRed text-white text-xs font-extrabold rounded-lg shadow disabled:opacity-60"
              >
                {isSelecting ? 'Selecting...' : 'Select Hospital'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHospitals.map((h, index) => (
            <div
              key={h.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-sm hover:shadow-md ${
                index === 0 ? 'border-emerald-300 ring-2 ring-emerald-50' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left details */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-base text-slate-900">{h.name}</span>
                    {h.verified && (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Facility</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 font-medium">{h.address}</p>

                  {/* Capabilities Badges (Flowchart Screen 6) */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span
                      className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        h.antivenomAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <Syringe className="w-3 h-3" />
                      <span>Antivenom: {h.antivenomAvailable ? `In Stock (${h.antivenomVials} vials)` : 'Unavailable'}</span>
                    </span>

                    <span
                      className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        h.snakeBiteService
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <Building2 className="w-3 h-3" />
                      <span>Snake Bite Emergency</span>
                    </span>

                    <span
                      className={`inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        h.icuAvailable
                          ? 'bg-blue-50 text-brand-blue border-blue-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <HeartPulse className="w-3 h-3" />
                      <span>ICU / Critical Care</span>
                    </span>

                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      <span>24×7 Emergency</span>
                    </span>
                  </div>

                  {/* Phone contact */}
                  <div className="flex items-center space-x-2 text-xs text-slate-600 font-semibold pt-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>ER Line: {h.phone}</span>
                  </div>
                </div>

                {/* Right: Distance, ETA, and Select button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 sm:pl-4 sm:border-l border-slate-100 min-w-[140px]">
                  <div className="text-left sm:text-right">
                    <span className="text-xl font-black text-slate-900 block leading-none">
                      {h.distanceKm} km
                    </span>
                    <span className="text-xs font-bold text-emerald-600 block mt-0.5">
                      ~{h.etaMinutes} min ETA
                    </span>
                  </div>

                  <button
                    onClick={() => handleSelect(h)}
                    disabled={isSelecting}
                    className="mt-2 py-2.5 px-5 bg-brand-red hover:bg-brand-darkRed text-white font-extrabold rounded-xl shadow text-xs uppercase tracking-wider transition-all transform active:scale-95 flex items-center space-x-1.5 disabled:opacity-60"
                  >
                    <span>{isSelecting ? 'Selecting...' : 'Select Hospital'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredHospitals.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-600 font-medium">No hospitals match all active filters.</p>
              <button
                onClick={() => {
                  setFilterAntivenomOnly(false);
                  setFilterIcuOnly(false);
                  setFilterSnakeOnly(false);
                }}
                className="mt-3 px-4 py-2 bg-brand-blue text-white text-xs font-bold rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <MedicalWarningBanner />
      </div>
    </div>
  );
};
