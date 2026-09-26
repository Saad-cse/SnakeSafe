import React, { useState, useEffect } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Edit3,
  Compass
} from 'lucide-react';
import { MedicalWarningBanner } from '../../components/MedicalWarningBanner';

export const LocationStep: React.FC = () => {
  const { activeCase, updateLocation } = useEmergency();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState<boolean>(false);

  const [latitude, setLatitude] = useState<number>(activeCase?.latitude || 28.6139);
  const [longitude, setLongitude] = useState<number>(activeCase?.longitude || 77.2090);
  const [address, setAddress] = useState<string>(
    activeCase?.address && !activeCase.address.includes('Detecting')
      ? activeCase.address
      : 'Sector 4, Connaught Place Central District'
  );
  const [manualInput, setManualInput] = useState<string>(address);

  // Auto trigger location on mount if default coordinates
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = () => {
    setLoading(true);
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg("We couldn't detect your location. Browser geolocation is not supported.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        const approx = `Near GPS (${lat.toFixed(4)}, ${lng.toFixed(4)}), Medical Emergency Corridor`;
        setAddress(approx);
        setManualInput(approx);
        setLoading(false);
      },
      (err) => {
        // Fallback gracefully without blocking
        console.warn('Geolocation failed:', err.message);
        setErrorMsg("We couldn't detect your location.");
        setLoading(false);
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const handleConfirmLocation = async () => {
    if (isConfirming) return;
    setIsConfirming(true);
    const finalAddress = manualMode ? manualInput : address;
    try {
      await updateLocation(latitude, longitude, finalAddress);
      navigate('/patient/snake-id');
    } catch (err) {
      console.error('Failed to save location:', err);
      setErrorMsg("Couldn't save your location — please try again.");
      setIsConfirming(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-bold mb-2">
          <Navigation className="w-3.5 h-3.5" />
          <span>STEP 2 OF 8</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
          Your Location
        </h2>
        <p className="text-sm text-slate-600 font-medium mt-1">
          Accurate location helps dispatch the closest antivenom ambulance and alert nearest hospital trauma teams.
        </p>
      </div>

      {/* Main Location Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card-soft p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Incident Coordinates
          </span>
          <span className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>High Precision GPS</span>
          </span>
        </div>

        {/* Display detected latitude & longitude */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="block text-[11px] font-bold text-slate-400 uppercase">Latitude</span>
            <span className="text-base sm:text-lg font-mono font-bold text-slate-800">
              {loading ? 'Locating...' : latitude.toFixed(6)}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="block text-[11px] font-bold text-slate-400 uppercase">Longitude</span>
            <span className="text-base sm:text-lg font-mono font-bold text-slate-800">
              {loading ? 'Locating...' : longitude.toFixed(6)}
            </span>
          </div>
        </div>

        {/* Approximate Address */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
          <span className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
            Approximate Address / Landmark
          </span>
          {manualMode ? (
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. Near Shiv Mandir, Village Kasna, Greater Noida..."
              rows={2}
              className="w-full mt-1 p-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          ) : (
            <p className="text-sm font-semibold text-slate-800 flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
              <span>{address}</span>
            </p>
          )}
        </div>

        {/* Geolocation Failure Notification (Flowchart Screen 2) */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6 text-red-900 text-xs sm:text-sm">
            <div className="flex items-center space-x-2 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-brand-red flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <p className="text-slate-600 text-xs">
              Do not worry — you can enter the address manually or continue with approximate coordinates.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={fetchCurrentLocation}
                className="px-3 py-1.5 bg-white border border-red-300 rounded-lg text-xs font-bold text-red-700 hover:bg-red-100 flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={() => setManualMode(true)}
                className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-800 flex items-center space-x-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Enter Location Manually</span>
              </button>
            </div>
          </div>
        )}

        {/* Buttons (Screen 2) */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={fetchCurrentLocation}
            disabled={loading}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm flex items-center justify-center space-x-2 transition-colors border border-slate-300"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-brand-blue" />
            ) : (
              <Compass className="w-4 h-4 text-brand-blue" />
            )}
            <span>{loading ? 'Detecting GPS...' : 'Get Current Location'}</span>
          </button>

          {!manualMode && (
            <button
              type="button"
              onClick={() => setManualMode(true)}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm flex items-center justify-center space-x-2 border border-slate-300"
            >
              <Edit3 className="w-4 h-4 text-slate-600" />
              <span>Enter Manually</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirmLocation}
            disabled={isConfirming}
            className="flex-1 py-3.5 px-6 bg-brand-red hover:bg-brand-darkRed text-white font-extrabold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            <span>{isConfirming ? 'Saving...' : 'Confirm & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <MedicalWarningBanner />
      </div>
    </div>
  );
};
