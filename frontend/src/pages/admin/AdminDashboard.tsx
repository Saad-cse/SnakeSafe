import React, { useState } from 'react';
import { useEmergency } from '../../contexts/EmergencyContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Shield,
  Building2,
  Truck,
  Users,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  XCircle,
  Plus,
  Edit2,
  Trash2,
  Syringe,
  Activity,
  Clock,
  MapPin,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { Hospital, Ambulance, User } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { allCases, hospitals, ambulances, reloadAll } = useEmergency();
  const { allDemoUsers } = useAuth();

  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'HOSPITALS' | 'AMBULANCES' | 'USERS' | 'CASES'>('ANALYTICS');

  // Stats calculation
  const totalCases = allCases.length;
  const completedCount = allCases.filter(c => c.status === 'COMPLETED').length;
  const activeCount = totalCases - completedCount;
  const totalVials = hospitals.reduce((acc, h) => acc + (h.antivenomVials || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span className="text-xs font-black uppercase tracking-wider text-purple-700">
              Central Administration & Oversight
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            SnakeSafe System Command
          </h1>
        </div>

        {/* Tab Switcher (Flowchart Screen 12) */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
          {[
            { id: 'ANALYTICS', label: 'Analytics & Reports', icon: BarChart3 },
            { id: 'HOSPITALS', label: 'Hospitals', icon: Building2 },
            { id: 'AMBULANCES', label: 'Ambulances', icon: Truck },
            { id: 'USERS', label: 'Users & Roles', icon: Users },
            { id: 'CASES', label: 'Cases Audit', icon: AlertTriangle },
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-white text-purple-900 shadow-sm font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Emergency Incidents</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{totalCases}</p>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
            {activeCount} Active / {completedCount} Resolved
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Ambulance Dispatch</span>
          <p className="text-3xl font-black text-brand-blue mt-1">7.4 min</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Target benchmark &lt; 10 min
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Hospital Door-to-Needle</span>
          <p className="text-3xl font-black text-purple-700 mt-1">14.2 min</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Time from arrival to antivenom
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Network Antivenom Stock</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">{totalVials} Vials</p>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Across 6 verified trauma centers
          </span>
        </div>
      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Emergency Cases Volume by Day */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-brand-blue" />
                <span>Emergency Cases Logged (Last 7 Days)</span>
              </h3>
              <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                {[
                  { day: 'Mon', count: 12 },
                  { day: 'Tue', count: 19 },
                  { day: 'Wed', count: 15 },
                  { day: 'Thu', count: 24 },
                  { day: 'Fri', count: 28 },
                  { day: 'Sat', count: 34 },
                  { day: 'Sun (Today)', count: 22 },
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-bold text-slate-600">{item.count}</span>
                    <div
                      className="w-full bg-gradient-to-t from-brand-blue to-cyan-500 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${(item.count / 35) * 100}%` }}
                    />
                    <span className="text-[10px] font-bold text-slate-400">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Identification Categories */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <span>Snake Identification Distribution</span>
              </h3>
              <div className="space-y-3 pt-2 text-xs">
                {[
                  { name: 'Cobra-like (Elapidae)', pct: 45, color: 'bg-brand-red' },
                  { name: "Viper-like (Viperidae / Russell's)", pct: 32, color: 'bg-amber-500' },
                  { name: 'Krait-like (Bungarus)', pct: 15, color: 'bg-purple-600' },
                  { name: 'Non-venomous / Colubrid', pct: 8, color: 'bg-emerald-500' },
                ].map((cat, i) => (
                  <div key={i}>
                    <div className="flex justify-between font-bold text-slate-700 mb-1">
                      <span>{cat.name}</span>
                      <span>{cat.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOSPITALS MANAGEMENT */}
      {activeTab === 'HOSPITALS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-slate-900">Hospital Facilities</h3>
            <span className="text-xs text-slate-500">{hospitals.length} centers registered</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3">Hospital Name</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Antivenom Stock</th>
                  <th className="p-3">ICU Available</th>
                  <th className="p-3">Verified Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hospitals.map(h => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{h.name}</td>
                    <td className="p-3 text-slate-500">{h.address}</td>
                    <td className="p-3 font-semibold text-emerald-700">
                      {h.antivenomAvailable ? `${h.antivenomVials} Vials` : 'Out of Stock'}
                    </td>
                    <td className="p-3">
                      {h.icuAvailable ? (
                        <span className="text-brand-blue font-bold">Yes</span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AMBULANCES MANAGEMENT */}
      {activeTab === 'AMBULANCES' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-slate-900">Ambulance Fleet Units</h3>
            <span className="text-xs text-slate-500">{ambulances.length} units tracked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ambulances.map(a => (
              <div key={a.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{a.vehicleNumber}</div>
                  <p className="text-xs text-slate-500 mt-0.5">Driver: {a.driverName} ({a.driverPhone})</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                  a.status === 'AVAILABLE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : a.status === 'EN_ROUTE'
                    ? 'bg-blue-100 text-brand-blue'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: USERS & ROLES */}
      {activeTab === 'USERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-slate-900">Registered System Users</h3>
            <span className="text-xs text-slate-500">{allDemoUsers.length} active credentials</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allDemoUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-500">{u.email}</td>
                    <td className="p-3 font-mono text-slate-600">{u.phone}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 uppercase">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CASES AUDIT */}
      {activeTab === 'CASES' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-base text-slate-900">Emergency Cases Master Audit</h3>
            <span className="text-xs text-slate-500">{allCases.length} incidents logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Species / Group</th>
                  <th className="p-3">Hospital Destination</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Logged At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allCases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-brand-darkRed">{c.caseNumber}</td>
                    <td className="p-3 font-bold text-slate-800">{c.patientName}</td>
                    <td className="p-3 text-slate-600">{c.possibleGroup || 'Suspected Venomous'}</td>
                    <td className="p-3 text-slate-700">{c.selectedHospital?.name || 'Apex Trauma'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-brand-blue">
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono">
                      {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
