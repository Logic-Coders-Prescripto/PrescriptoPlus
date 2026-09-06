import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Share2, 
  Sparkles, 
  Check, 
  X, 
  Sun, 
  Moon, 
  Coffee, 
  ShieldCheck,
  Plus,
  Inbox
} from 'lucide-react';
import { apiUrl } from '../config/api';

export function MedicineReminders({ 
  medicines = [], 
  onOpenWhatsApp, 
  selectedLang,
  isDarkMode = false,
  userId = 'usr-1'
}) {
  const isHindi = selectedLang === 'hi';
  const [schedulePeriods, setSchedulePeriods] = useState([]);

  // Restore saved routines from database if medicines prop is empty
  useEffect(() => {
    if ((!medicines || medicines.length === 0) && userId) {
      fetch(apiUrl(`/api/reminders/user/${userId}`))
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.data && data.data.length > 0) {
            const saved = data.data[0];
            if (saved.schedulePeriods && saved.schedulePeriods.length > 0) {
              setSchedulePeriods(saved.schedulePeriods);
            }
          }
        })
        .catch(e => console.warn('Could not load saved routines:', e));
    }
  }, [userId, medicines]);

  // Generate dynamic dosage schedule strictly from the active uploaded prescription
  useEffect(() => {
    if (!medicines || medicines.length === 0) {
      return;
    }

    const morningMeds = [];
    const afternoonMeds = [];
    const nightMeds = [];

    medicines.forEach((med, idx) => {
      const freq = (med.frequency?.value || med.frequency || '').toLowerCase();
      const sched = med.schedule || [];
      const name = med.brandName || med.name?.value || 'Prescribed Medicine';
      const dose = med.strength?.value || med.strength || med.type || '1 Dose';
      const instruction = med.foodRelation?.value || med.foodRelation || 'As directed by physician';

      // Morning allocation
      if (sched.includes('morning') || freq.includes('morning') || freq.includes('1-0-1') || freq.includes('1-1-1') || freq.includes('1-0-0') || freq.includes('bd') || freq.includes('tds') || freq.includes('od')) {
        morningMeds.push({
          id: `m-morn-${idx}`,
          name,
          dose,
          instruction,
          status: 'pending'
        });
      }

      // Afternoon allocation
      if (sched.includes('afternoon') || freq.includes('afternoon') || freq.includes('tds') || freq.includes('1-1-1') || freq.includes('sos')) {
        afternoonMeds.push({
          id: `m-aft-${idx}`,
          name,
          dose,
          instruction,
          status: 'pending'
        });
      }

      // Night allocation
      if (sched.includes('night') || freq.includes('night') || freq.includes('bedtime') || freq.includes('1-0-1') || freq.includes('1-1-1') || freq.includes('0-0-1') || freq.includes('bd') || freq.includes('tds')) {
        nightMeds.push({
          id: `m-night-${idx}`,
          name,
          dose,
          instruction,
          status: 'pending'
        });
      }
    });

    const periods = [];
    if (morningMeds.length > 0) {
      periods.push({
        id: 'period-morning',
        period: 'morning',
        title: isHindi ? 'सुबह की खुराक (08:00 AM)' : 'Morning Routine (08:00 AM)',
        time: '08:00 AM',
        icon: 'sun',
        medicines: morningMeds
      });
    }

    if (afternoonMeds.length > 0) {
      periods.push({
        id: 'period-afternoon',
        period: 'afternoon',
        title: isHindi ? 'दोपहर की खुराक (01:30 PM)' : 'Afternoon / Lunch Routine (01:30 PM)',
        time: '01:30 PM',
        icon: 'sun',
        medicines: afternoonMeds
      });
    }

    if (nightMeds.length > 0) {
      periods.push({
        id: 'period-night',
        period: 'night',
        title: isHindi ? 'रात / सोने से पहले (09:30 PM)' : 'Night & Bedtime Routine (09:30 PM)',
        time: '09:30 PM',
        icon: 'moon',
        medicines: nightMeds
      });
    }

    // Fallback if timings weren't explicitly split: put all in active prescribed list
    if (periods.length === 0 && medicines.length > 0) {
      periods.push({
        id: 'period-prescribed',
        period: 'general',
        title: isHindi ? 'डॉक्टर द्वारा निर्धारित खुराक' : 'Prescribed Medication Routine',
        time: 'As Directed',
        icon: 'sun',
        medicines: medicines.map((m, idx) => ({
          id: `m-gen-${idx}`,
          name: m.brandName || 'Prescribed Medicine',
          dose: m.strength || '1 Dose',
          instruction: m.foodRelation || 'After meals with water',
          status: 'pending'
        }))
      });
    }

    setSchedulePeriods(periods);
  }, [medicines, isHindi]);

  const handleUpdateStatus = (periodId, medId, newStatus) => {
    setSchedulePeriods(prev => {
      const updated = prev.map(period => {
        if (period.id === periodId) {
          return {
            ...period,
            medicines: period.medicines.map(m => {
              if (m.id === medId) {
                return { ...m, status: newStatus };
              }
              return m;
            })
          };
        }
        return period;
      });

      // Synchronize reminder adherence to server database
      try {
        fetch(apiUrl('/api/reminders/sync'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            schedulePeriods: updated
          })
        }).catch(err => console.warn('Sync reminders error:', err));
      } catch (e) {}

      return updated;
    });
  };

  const allDoses = schedulePeriods.flatMap(p => p.medicines);
  const totalDoses = allDoses.length;
  const takenDoses = allDoses.filter(d => d.status === 'taken').length;
  const adherenceScore = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;

  const cardBg = isDarkMode ? "bg-[#0f2c27] border-[#18443e] text-white" : "bg-white border-[#e8e6df] text-[#1c2726]";
  const subCardBg = isDarkMode ? "bg-[#143b35] border-[#1b4841]" : "bg-[#faf9f5] border-[#e8e6df]";

  // Empty state when no prescription has been loaded and no saved routine in database
  if ((!medicines || medicines.length === 0) && schedulePeriods.length === 0) {
    return (
      <div className={`${cardBg} rounded-3xl p-12 text-center space-y-4 border border-dashed transition-colors`}>
        <Inbox className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold">
          {isHindi ? "कोई पर्ची सक्रिय नहीं है" : "No Prescription Loaded for Reminders"}
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {isHindi
            ? "दवाइयों का सटीक समय-सारणी देखने के लिए कृपया AI पर्ची स्कैनर में डॉक्टर की पर्ची अपलोड करें।"
            : "Upload or photograph a doctor's prescription in the AI Prescription tab to automatically generate your personalized daily dosage reminder schedule."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card */}
      <div className={`${cardBg} rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs transition-colors`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <Bell className="w-3.5 h-3.5 text-emerald-600" />
              <span>Prescription-Generated Dosage Schedule</span>
            </div>
            <h2 className="text-2xl font-bold font-heading">
              {isHindi ? "आज की दवाइयों की समय-सारणी" : "Today's Active Medication Routine"}
            </h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {isHindi 
                ? "अपलोड की गई पर्ची के अनुसार तैयार की गई समय-सारणी" 
                : "Synchronized directly with your uploaded prescription slip"}
            </p>
          </div>
        </div>

        {/* Adherence Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-emerald-700 uppercase tracking-wider">
              {isHindi ? "दवाई पालन स्तर (Adherence)" : "Prescription Adherence"}
            </span>
            <span className="font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              {takenDoses} / {totalDoses} Doses Completed ({adherenceScore}%)
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-200/60 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${adherenceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Routine Sections Generated Dynamically */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {schedulePeriods.map((period) => (
          <div 
            key={period.id}
            className={`${cardBg} rounded-3xl p-6 space-y-4 shadow-xs transition-colors`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#e8e6df]/50">
              <div className="flex items-center space-x-2">
                {period.icon === 'moon' ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <h3 className="text-sm font-bold">{period.title}</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {period.medicines.length} Doses
              </span>
            </div>

            <div className="space-y-2.5">
              {period.medicines.map((med) => (
                <div 
                  key={med.id}
                  className={`p-3.5 rounded-2xl ${subCardBg} border transition-all flex items-center justify-between gap-3`}
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{med.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{med.dose} • {med.instruction}</div>
                  </div>

                  {/* Actions: Taken / Skipped / Snooze */}
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => handleUpdateStatus(period.id, med.id, 'taken')}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        med.status === 'taken' 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : 'bg-white border border-[#e8e6df] text-slate-400 hover:text-emerald-600'
                      }`}
                      title="Mark as taken"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(period.id, med.id, 'skipped')}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        med.status === 'skipped' 
                          ? 'bg-rose-600 text-white shadow-xs' 
                          : 'bg-white border border-[#e8e6df] text-slate-400 hover:text-rose-600'
                      }`}
                      title="Skip dose"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(period.id, med.id, 'snoozed')}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        med.status === 'snoozed' 
                          ? 'bg-amber-600 text-white shadow-xs' 
                          : 'bg-white border border-[#e8e6df] text-slate-400 hover:text-amber-600'
                      }`}
                      title="Snooze 15 mins"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
