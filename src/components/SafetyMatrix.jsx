import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Sparkles,
  Activity
} from 'lucide-react';

export function SafetyMatrix({ safetyAlerts = [], selectedLang }) {
  const isHindi = selectedLang === 'hi';

  if (!safetyAlerts || safetyAlerts.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-[#e8e6df] p-6 sm:p-8 space-y-5 shadow-xs text-[#1c2726]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f0e9]">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Clinical Pharmacology & Safety Alerts</span>
          </div>
          <h3 className="text-xl font-bold text-[#0f3e3a] font-heading">
            {isHindi ? "दवा सुरक्षा एवं सावधानी गाइड" : "AI Clinical Safety Warnings"}
          </h3>
          <p className="text-xs text-slate-500">
            {isHindi 
              ? "दवाओं के बीच परस्पर क्रिया और विशेष सावधानियां" 
              : "Pharmacological precautions, dietary intervals, and pediatric dosage rules"}
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
          {safetyAlerts.length} Safety Advisory
        </span>
      </div>

      {/* Safety Alerts List */}
      <div className="space-y-3">
        {safetyAlerts.map((alert, idx) => {
          const isHigh = alert.severity === 'high' || alert.type === 'critical';
          const isModerate = alert.severity === 'moderate' || alert.type === 'warning';

          return (
            <div 
              key={idx}
              className={`p-4 rounded-2xl border text-xs space-y-1.5 transition-all ${
                isHigh 
                  ? 'bg-rose-50 border-rose-200 text-rose-900' 
                  : isModerate
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-sm">
                {isHigh ? (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                ) : isModerate ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{alert.title || (isHigh ? "High Clinical Precaution" : "Administration Rule")}</span>
              </div>

              <p className="text-xs leading-relaxed opacity-90">
                {alert.message || alert.description || alert}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
