import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Bell, 
  BellRing, 
  Flame, 
  Sparkles, 
  Sun, 
  Moon, 
  Sunset, 
  Coffee,
  Check,
  RotateCcw
} from 'lucide-react';

export default function DailySchedule({ medications = [] }) {
  const [takenStatus, setTakenStatus] = useState({});
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState('all');

  const daysOfWeek = [
    { short: 'Mon', day: 1, active: true },
    { short: 'Tue', day: 2, active: true },
    { short: 'Wed', day: 3, active: true },
    { short: 'Thu', day: 4, active: true, isToday: true },
    { short: 'Fri', day: 5, active: false },
    { short: 'Sat', day: 6, active: false },
    { short: 'Sun', day: 7, active: false }
  ];

  // Organize medications by time slot
  const slots = [
    {
      id: 'morning',
      title: 'Morning Dose',
      time: '08:00 AM',
      icon: Coffee,
      color: 'from-amber-500/20 to-orange-500/10',
      borderColor: 'border-amber-500/30',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-500/30',
      items: medications.filter(m => m.schedule?.morning)
    },
    {
      id: 'afternoon',
      title: 'Afternoon Dose',
      time: '01:00 PM',
      icon: Sun,
      color: 'from-orange-500/20 to-yellow-500/10',
      borderColor: 'border-orange-500/30',
      badgeColor: 'bg-orange-950/80 text-orange-300 border-orange-500/30',
      items: medications.filter(m => m.schedule?.afternoon)
    },
    {
      id: 'evening',
      title: 'Evening Dose',
      time: '06:00 PM',
      icon: Sunset,
      color: 'from-indigo-500/20 to-purple-500/10',
      borderColor: 'border-indigo-500/30',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30',
      items: medications.filter(m => m.schedule?.evening)
    },
    {
      id: 'night',
      title: 'Bedtime Dose',
      time: '10:00 PM',
      icon: Moon,
      color: 'from-purple-500/20 to-blue-500/10',
      borderColor: 'border-purple-500/30',
      badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-500/30',
      items: medications.filter(m => m.schedule?.night)
    }
  ];

  // Total daily doses calculation
  const totalDosesToday = slots.reduce((acc, slot) => acc + slot.items.length, 0);
  const totalTaken = Object.values(takenStatus).filter(Boolean).length;
  const adherencePercentage = totalDosesToday > 0 ? Math.round((totalTaken / totalDosesToday) * 100) : 0;

  const toggleTaken = (slotId, medId) => {
    const key = `${slotId}-${medId}`;
    setTakenStatus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleResetDay = () => {
    setTakenStatus({});
  };

  const filteredSlots = selectedSlot === 'all' 
    ? slots 
    : slots.filter(s => s.id === selectedSlot);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Adherence & Streak Tracker Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Adherence Progress Bar (8 Cols) */}
        <div className="md:col-span-8 glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Today's Medication Tracker</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Check off each medicine as you take it to maintain adherence</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                {totalTaken} / {totalDosesToday} Taken ({adherencePercentage}%)
              </span>
              <button
                onClick={handleResetDay}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Reset Tracker for Today"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-800/90 rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500 shadow-lg shadow-emerald-500/40"
              style={{ width: `${adherencePercentage}%` }}
            />
          </div>

          {/* Day of Week Adherence Strip */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
            {daysOfWeek.map((d, i) => (
              <div
                key={i}
                className={`flex-1 py-2 rounded-xl text-center border transition-all ${
                  d.isToday
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-950/60'
                    : d.active
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-slate-900/20 border-slate-800/40 text-slate-600'
                }`}
              >
                <span className="text-[10px] font-bold block uppercase">{d.short}</span>
                <span className="text-xs font-semibold">{d.isToday ? 'Today' : d.active ? '✓' : '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak & Smart Alarm Widget (4 Cols) */}
        <div className="md:col-span-4 glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-sm font-bold text-white">4-Day Streak!</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
              Gold Tier
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Consistently taking your prescribed doses on time reduces complication risk by up to 80%.
          </p>

          {/* Reminder Toggle */}
          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {reminderEnabled ? (
                <BellRing className="w-4 h-4 text-emerald-400 animate-bounce" />
              ) : (
                <Bell className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <span className="text-xs font-semibold text-white block">Smart Dose Alarms</span>
                <span className="text-[10px] text-slate-400">Push notification 15m prior</span>
              </div>
            </div>
            <button
              onClick={() => setReminderEnabled(!reminderEnabled)}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                reminderEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  reminderEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Time Slot Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedSlot('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedSlot === 'all'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          All Times ({totalDosesToday} Doses)
        </button>
        {slots.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedSlot(s.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedSlot === s.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>{s.title.split(' ')[0]}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
              {s.items.length}
            </span>
          </button>
        ))}
      </div>

      {/* Time-of-Day Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSlots.map((slot) => {
          const Icon = slot.icon;
          const slotTakenCount = slot.items.filter(m => takenStatus[`${slot.id}-${m.id}`]).length;
          const isSlotAllTaken = slot.items.length > 0 && slotTakenCount === slot.items.length;

          return (
            <div
              key={slot.id}
              className={`glass-panel rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden ${
                isSlotAllTaken
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${slot.color} border ${slot.borderColor} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{slot.title}</h3>
                      <span className="text-xs text-slate-400 font-mono">({slot.time})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {slot.items.length} {slot.items.length === 1 ? 'medicine' : 'medicines'} scheduled
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${slot.badgeColor}`}>
                  {slotTakenCount}/{slot.items.length} Done
                </span>
              </div>

              {/* Medicines In This Slot */}
              <div className="space-y-3 pt-4">
                {slot.items.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500 italic">
                    No medications scheduled for this time window.
                  </div>
                ) : (
                  slot.items.map((med) => {
                    const key = `${slot.id}-${med.id}`;
                    const isTaken = !!takenStatus[key];

                    return (
                      <div
                        key={med.id}
                        onClick={() => toggleTaken(slot.id, med.id)}
                        className={`cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                          isTaken
                            ? 'bg-emerald-950/30 border-emerald-500/50 opacity-90'
                            : 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                              isTaken
                                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/40'
                                : 'border border-slate-600 hover:border-emerald-400 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${
                                isTaken ? 'line-through text-slate-400' : 'text-white'
                              }`}>
                                {med.brandName}
                              </span>
                              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.2 rounded border border-emerald-500/20">
                                {med.strength}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {med.genericName} • {med.form}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                med.beforeFood
                                  ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {med.beforeFood ? '🥣 Before Food' : '🍽️ After Meal'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {med.instructions}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg shrink-0 ${
                          isTaken
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isTaken ? 'Taken ✓' : 'Pending'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
