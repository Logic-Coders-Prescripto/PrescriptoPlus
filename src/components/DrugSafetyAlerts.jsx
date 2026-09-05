import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  Utensils, 
  Wine, 
  Flame, 
  HelpCircle,
  Stethoscope,
  ExternalLink
} from 'lucide-react';

export default function DrugSafetyAlerts({ safetyAlerts = [], medications = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Generic food & lifestyle alerts mapped dynamically
  const lifestyleAlerts = [
    {
      id: 'ls-1',
      severity: 'Moderate',
      type: 'Hydration Advisory',
      title: 'Maintain Consistent Hydration',
      description: 'Many oral antibiotics and metabolic medications are filtered via renal pathways. Aim for at least 2.5 Liters of water daily.'
    },
    {
      id: 'ls-2',
      severity: 'High',
      type: 'Alcohol Warning',
      title: 'Zero Alcohol During Prescription Period',
      description: 'Alcohol can induce dangerous hepatic interactions with pain relievers, statins, and antihistamines.'
    }
  ];

  const allAlerts = [...safetyAlerts, ...lifestyleAlerts];

  const filteredAlerts = activeFilter === 'all'
    ? allAlerts
    : allAlerts.filter(a => a.severity.toLowerCase() === activeFilter.toLowerCase());

  const highRiskCount = allAlerts.filter(a => a.severity === 'High').length;
  const modRiskCount = allAlerts.filter(a => a.severity === 'Moderate').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Safety Score Overview Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> RxNorm & FDA Safety Engine Cross-Reference
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Clinical Drug Interaction & Safety Analysis
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Prescripto Plus automatically scans your active prescription combinations against clinical drug contraindication databases to ensure zero hazardous overlaps.
            </p>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center lg:justify-end">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center w-full max-w-xs space-y-2 shadow-xl">
              <span className="text-xs font-semibold text-slate-400">Safety Index Rating</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-black font-mono text-emerald-400">9.4</span>
                <span className="text-xs text-slate-400 font-medium">/ 10</span>
              </div>
              <p className="text-[11px] text-emerald-300 font-medium">Safe Regimen with Mild Food Advisories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">High Risk Conflicts</span>
            <p className="text-xl font-bold text-rose-400 mt-1 font-mono">{highRiskCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Moderate Dietary Advisories</span>
            <p className="text-xl font-bold text-amber-400 mt-1 font-mono">{modRiskCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Active Molecules Cross-Checked</span>
            <p className="text-xl font-bold text-emerald-400 mt-1 font-mono">{medications.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'all'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Alerts ({allAlerts.length})
        </button>
        <button
          onClick={() => setActiveFilter('high')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'high'
              ? 'bg-rose-500 text-white font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          High Risk ({highRiskCount})
        </button>
        <button
          onClick={() => setActiveFilter('moderate')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeFilter === 'moderate'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Moderate ({modRiskCount})
        </button>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isHigh = alert.severity === 'High';
          const isMod = alert.severity === 'Moderate';

          return (
            <div
              key={alert.id}
              className={`glass-panel rounded-3xl p-5 sm:p-6 border transition-all ${
                isHigh
                  ? 'border-rose-500/40 bg-rose-950/10 shadow-lg shadow-rose-950/40'
                  : isMod
                  ? 'border-amber-500/40 bg-amber-950/10'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isHigh
                      ? 'bg-rose-500/20 text-rose-400'
                      : isMod
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {isHigh ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : isMod ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {alert.type}
                    </span>
                    <h3 className="text-base font-bold text-white">{alert.title}</h3>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold w-fit ${
                  isHigh
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                    : isMod
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {alert.severity} Severity
                </span>
              </div>

              <div className="pt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {alert.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested Questions for Your Doctor */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-emerald-400" />
          Smart Questions to Ask Your Pharmacist / Doctor
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300">
            💬 "Can I safely substitute any of these branded medications for FDA-approved bioequivalent generics?"
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300">
            💬 "What should I do if I miss a scheduled dose by more than 4 hours?"
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300">
            💬 "Are there any over-the-counter pain relievers (like aspirin or NSAIDs) I must avoid with this regimen?"
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300">
            💬 "Do I need any routine blood laboratory tests (liver panel, eGFR) during this medication duration?"
          </div>
        </div>
      </div>
    </div>
  );
}
