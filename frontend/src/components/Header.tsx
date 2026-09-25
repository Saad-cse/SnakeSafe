import React from 'react';
import { ShieldAlert, PhoneCall, Activity, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEmergency } from '../contexts/EmergencyContext';
import { Link, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeCase, resetEmergency } = useEmergency();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-red to-red-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">SnakeSafe</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
                  EMERGENCY 24/7
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                From Bite to Treatment — Faster, Safer, Smarter
              </p>
            </div>
          </Link>

          {/* Center: Active Emergency Badge if active */}
          {activeCase && (
            <div
              onClick={() => navigate('/patient')}
              className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full cursor-pointer hover:bg-red-100 transition-colors"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="text-xs font-bold text-red-800">
                ACTIVE CASE #{activeCase.caseNumber}
              </span>
              <span className="text-xs text-red-600 bg-white px-2 py-0.5 rounded-full font-medium border border-red-200">
                {activeCase.status.replace(/_/g, ' ')}
              </span>
            </div>
          )}

          {/* Right Navigation & Emergency Hotline */}
          <div className="flex items-center space-x-3">
            <a
              href="tel:108"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow transition-colors"
              title="National Ambulance Hotline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>DIAL 108</span>
            </a>

            {/* Current Active Role Badge */}
            <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-800">{currentUser.name}</div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-brand-blue">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
            </div>

            {activeCase && (
              <button
                onClick={resetEmergency}
                title="Reset active emergency simulation"
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
