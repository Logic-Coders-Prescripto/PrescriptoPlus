import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  X, 
  User, 
  Stethoscope, 
  Plus, 
  AlertCircle,
  FileText
} from 'lucide-react';

export function MyAppointments({ 
  appointments = [], 
  onCancelAppointment, 
  onBookNew,
  isDarkMode = false
}) {
  const headerBg = isDarkMode ? "bg-[#0a231f] border-[#133d36] text-white" : "bg-white border-[#e8e6df] text-[#1c2726]";
  const cardBg = isDarkMode ? "bg-[#0a231f] border-[#133d36] text-white" : "bg-white border-[#e8e6df] text-[#1c2726]";
  const dividerBorder = isDarkMode ? "border-[#133d36]" : "border-[#f1f0e9]";

  return (
    <div className={`space-y-6 animate-fade-in ${isDarkMode ? 'text-slate-100' : 'text-[#1c2726]'}`}>
      
      {/* Header */}
      <div className={`${headerBg} rounded-3xl border p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors`}>
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Consultation Schedule</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-normal font-serif-heading ${isDarkMode ? 'text-white' : 'text-[#0f3e3a]'}`}>
            My Scheduled Appointments
          </h2>
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-teal-200/70' : 'text-slate-500'}`}>
            Confirmed doctor visits, clinical slots, and hospital OPD tokens.
          </p>
        </div>

        <button
          onClick={onBookNew}
          className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto ${
            isDarkMode ? 'bg-teal-600 hover:bg-teal-500' : 'bg-[#0f3e3a] hover:bg-[#134e4a]'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Book New Slot</span>
        </button>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className={`${cardBg} rounded-3xl border p-12 text-center space-y-4 transition-colors`}>
          <div className="w-16 h-16 rounded-2xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center mx-auto text-slate-400">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#0f3e3a]'}`}>
              No Scheduled Consultations
            </h3>
            <p className={`text-xs max-w-sm mx-auto ${isDarkMode ? 'text-teal-200/70' : 'text-slate-500'}`}>
              You do not have any upcoming doctor appointments right now. Select a specialist to book an OPD slot.
            </p>
          </div>
          <button
            onClick={onBookNew}
            className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs mt-2 cursor-pointer inline-flex items-center space-x-1.5 shadow-sm ${
              isDarkMode ? 'bg-teal-600 hover:bg-teal-500' : 'bg-[#0f3e3a] hover:bg-[#134e4a]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Find a Doctor & Book</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {appointments.map((apt) => (
            <div 
              key={apt.id}
              className={`${cardBg} rounded-3xl border p-6 space-y-5 shadow-xs flex flex-col justify-between transition-colors`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${isDarkMode ? 'text-teal-400' : 'text-emerald-800'}`}>
                    OPD TOKEN #{apt.id}
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span>{apt.status || "Confirmed"}</span>
                  </span>
                </div>

                <div className="flex items-start space-x-4">
                  {/* Calendar Date Block */}
                  <div className="w-14 h-16 rounded-2xl bg-[#0f3e3a] text-white flex flex-col items-center justify-center shrink-0 shadow-xs border border-teal-600/30">
                    <span className="text-lg font-extrabold leading-none">{apt.date?.split(' ')[0] || "24"}</span>
                    <span className="text-[10px] font-bold tracking-wider text-emerald-300 uppercase mt-0.5">
                      {apt.date?.split(' ')[1] || "AUG"}
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className={`text-base sm:text-lg font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#0f3e3a]'}`}>
                      {apt.doctorName}
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {apt.specialty} • {apt.consultationType || "In-clinic"}
                    </p>
                    <div className={`flex items-center space-x-3 text-xs pt-1 font-mono ${isDarkMode ? 'text-teal-200/80' : 'text-slate-600'}`}>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        <span>{apt.time}</span>
                      </span>
                      <span>{apt.room || "Room 204"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`pt-3 border-t ${dividerBorder} flex items-center justify-between`}>
                <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-teal-300' : 'text-slate-700'}`}>
                  Fee: ₹{apt.amount || 800}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => alert(`Showing OPD Slip for ${apt.doctorName} (${apt.time})`)}
                    className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                      isDarkMode
                        ? 'bg-[#071d19] text-white border-[#133d36] hover:bg-[#123630]'
                        : 'bg-[#faf9f5] hover:bg-slate-100 text-slate-700 border-[#e8e6df]'
                    }`}
                  >
                    View Slip
                  </button>
                  <button
                    onClick={() => onCancelAppointment(apt.id)}
                    className="px-3.5 py-1.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
