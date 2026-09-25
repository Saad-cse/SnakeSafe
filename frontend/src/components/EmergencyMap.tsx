import React, { useState, useEffect } from 'react';
import { Hospital, Ambulance } from '../types';
import { MapPin, Navigation, Building2, Truck, Plus, Minus, Compass } from 'lucide-react';

interface Props {
  patientLocation?: { lat: number; lng: number; address?: string };
  hospitals?: Hospital[];
  selectedHospital?: Hospital | null;
  onSelectHospital?: (h: Hospital) => void;
  ambulance?: Ambulance | null;
  ambulanceProgress?: number; // 0 to 100%
  height?: string;
  showRoute?: boolean;
}

export const EmergencyMap: React.FC<Props> = ({
  patientLocation = { lat: 28.6139, lng: 77.2090, address: 'Connaught Place Emergency Zone' },
  hospitals = [],
  selectedHospital = null,
  onSelectHospital,
  ambulance = null,
  ambulanceProgress = 45,
  height = '380px',
  showRoute = true
}) => {
  const [zoom, setZoom] = useState(1);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Map coordinates projection helper (simulated local map grid 1000x600)
  const patientPos = { x: 500, y: 320 };
  
  // Hospital relative positions on the local grid
  const hospitalPositions: { [id: string]: { x: number; y: number } } = {
    'hosp-1': { x: 580, y: 190 }, // Apex Trauma
    'hosp-2': { x: 740, y: 220 }, // Civil Hospital
    'hosp-3': { x: 380, y: 150 }, // St. Jude
    'hosp-4': { x: 810, y: 440 }, // Rural CHC
    'hosp-5': { x: 330, y: 490 }, // Metro Care
    'hosp-6': { x: 670, y: 90 },  // Shree Krishna
  };

  const targetHospitalPos = selectedHospital && hospitalPositions[selectedHospital.id]
    ? hospitalPositions[selectedHospital.id]
    : hospitalPositions['hosp-1'];

  // Current calculated ambulance position along route
  const ambX = patientPos.x + (targetHospitalPos.x - patientPos.x) * (ambulanceProgress / 100);
  const ambY = patientPos.y + (targetHospitalPos.y - patientPos.y) * (ambulanceProgress / 100);

  return (
    <div
      style={{ height }}
      className="relative w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-750 shadow-inner select-none font-sans"
    >
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-white flex items-center space-x-2">
        <Compass className="w-4 h-4 text-brand-cyan animate-spin-slow" />
        <span className="text-xs font-bold tracking-wide">SnakeSafe GPS Tactical Vector Radar</span>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
          LIVE
        </span>
      </div>

      {/* Map Zoom Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col space-y-1 bg-slate-800/80 backdrop-blur rounded-lg p-1 border border-slate-700">
        <button
          onClick={() => setZoom(z => Math.min(z + 0.2, 1.6))}
          className="p-1 hover:bg-slate-700 rounded text-slate-200 transition-colors"
          title="Zoom in"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.2, 0.8))}
          className="p-1 hover:bg-slate-700 rounded text-slate-200 transition-colors"
          title="Zoom out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Canvas Map Grid */}
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full transition-transform duration-300"
        style={{ transform: `scale(${zoom})` }}
      >
        <defs>
          <radialGradient id="radarPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Tactical Map Grid lines */}
        <g stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4">
          {[...Array(11)].map((_, i) => (
            <line key={`x-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" />
          ))}
          {[...Array(7)].map((_, i) => (
            <line key={`y-${i}`} x1="0" y1={i * 100} x2="1000" y2={i * 100} />
          ))}
        </g>

        {/* City Streets and Corridors (Stylized medical transit routes) */}
        <g stroke="#334155" strokeWidth="6" strokeLinecap="round" opacity="0.6">
          <line x1="100" y1="320" x2="900" y2="320" />
          <line x1="500" y1="80" x2="500" y2="520" />
          <line x1="200" y1="120" x2="800" y2="480" />
          <line x1="250" y1="500" x2="850" y2="150" />
        </g>

        {/* Primary Route Line between Patient and Selected Hospital */}
        {showRoute && (
          <>
            <line
              x1={patientPos.x}
              y1={patientPos.y}
              x2={targetHospitalPos.x}
              y2={targetHospitalPos.y}
              stroke="url(#routeGrad)"
              strokeWidth="5"
              strokeDasharray="8 6"
              className="animate-pulse"
              filter="url(#glow)"
            />
          </>
        )}

        {/* Patient Radar Rings */}
        <circle cx={patientPos.x} cy={patientPos.y} r="80" fill="url(#radarPulse)" className="animate-ping-slow" />
        <circle cx={patientPos.x} cy={patientPos.y} r="18" fill="#DC2626" opacity="0.25" />
        <circle cx={patientPos.x} cy={patientPos.y} r="8" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
        <text
          x={patientPos.x}
          y={patientPos.y + 24}
          fill="#F87171"
          fontSize="11"
          fontWeight="bold"
          textAnchor="middle"
        >
          YOU / PATIENT
        </text>

        {/* Hospital Markers */}
        {hospitals.map(h => {
          const pos = hospitalPositions[h.id] || { x: 550, y: 250 };
          const isSelected = selectedHospital?.id === h.id;

          return (
            <g
              key={h.id}
              className="cursor-pointer group"
              onClick={() => onSelectHospital && onSelectHospital(h)}
              onMouseEnter={() => setActiveTooltip(h.id)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              {isSelected && (
                <circle cx={pos.x} cy={pos.y} r="24" fill="#3B82F6" opacity="0.3" className="animate-ping" />
              )}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? "14" : "11"}
                fill={h.antivenomAvailable ? "#10B981" : "#EAB308"}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              {/* Hospital Cross (+) */}
              <line x1={pos.x - 4} y1={pos.y} x2={pos.x + 4} y2={pos.y} stroke="#FFFFFF" strokeWidth="2" />
              <line x1={pos.x} y1={pos.y - 4} x2={pos.x} y2={pos.y + 4} stroke="#FFFFFF" strokeWidth="2" />

              <text
                x={pos.x}
                y={pos.y + 20}
                fill={isSelected ? '#60A5FA' : '#94A3B8'}
                fontSize="10"
                fontWeight={isSelected ? 'bold' : 'normal'}
                textAnchor="middle"
              >
                {h.name.length > 20 ? h.name.slice(0, 18) + '...' : h.name}
              </text>
            </g>
          );
        })}

        {/* Active Ambulance Marker */}
        {ambulance && (
          <g transform={`translate(${ambX}, ${ambY})`}>
            <circle cx="0" cy="0" r="16" fill="#F59E0B" opacity="0.3" className="animate-ping" />
            <circle cx="0" cy="0" r="11" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="24" fill="#FCD34D" fontSize="10" fontWeight="bold" textAnchor="middle">
              AMBULANCE ({ambulance.vehicleNumber.slice(0, 10)})
            </text>
          </g>
        )}
      </svg>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-2 left-3 right-3 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700 text-slate-300 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 ring-2 ring-red-400/40 inline-block"></span>
            <span className="font-medium text-slate-200">Patient Emergency</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="font-medium text-slate-200">Hospital (Antivenom Stocked)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="font-medium text-slate-200">Ambulance</span>
          </div>
        </div>

        {selectedHospital && (
          <div className="text-right font-semibold text-brand-cyan">
            Destination: {selectedHospital.name} ({selectedHospital.distanceKm} km • ~{selectedHospital.etaMinutes} min)
          </div>
        )}
      </div>
    </div>
  );
};
