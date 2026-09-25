import React from 'react';
import { UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Stethoscope, Truck, Shield, ArrowRight } from 'lucide-react';

export const QuickRoleBar: React.FC = () => {
  const { currentUser, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; path: string; color: string }[] = [
    {
      role: 'PATIENT',
      label: 'Patient / Attendant',
      icon: <User className="w-3.5 h-3.5" />,
      path: '/patient',
      color: 'bg-red-600 text-white hover:bg-red-700'
    },
    {
      role: 'DOCTOR',
      label: 'Hospital Doctor',
      icon: <Stethoscope className="w-3.5 h-3.5" />,
      path: '/hospital',
      color: 'bg-brand-blue text-white hover:bg-blue-900'
    },
    {
      role: 'AMBULANCE_DRIVER',
      label: 'Ambulance Driver',
      icon: <Truck className="w-3.5 h-3.5" />,
      path: '/driver',
      color: 'bg-emerald-600 text-white hover:bg-emerald-700'
    },
    {
      role: 'ADMIN',
      label: 'System Admin',
      icon: <Shield className="w-3.5 h-3.5" />,
      path: '/admin',
      color: 'bg-purple-700 text-white hover:bg-purple-800'
    }
  ];

  const handleSwitch = (r: typeof roles[0]) => {
    switchRole(r.role);
    navigate(r.path);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-full shadow-2xl border border-slate-700/80 flex items-center space-x-2 max-w-[95vw] overflow-x-auto text-xs">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 hidden md:inline">
        Simulate Role:
      </span>

      <div className="flex items-center space-x-1.5">
        {roles.map(r => {
          const isActive = currentUser.role === r.role && location.pathname.startsWith(r.path);
          return (
            <button
              key={r.role}
              onClick={() => handleSwitch(r)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full font-semibold transition-all duration-200 ${
                isActive
                  ? `${r.color} ring-2 ring-white/50 shadow-md scale-105`
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {r.icon}
              <span className="whitespace-nowrap">{r.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
