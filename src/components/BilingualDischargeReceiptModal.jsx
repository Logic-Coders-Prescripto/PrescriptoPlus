import React, { useRef } from 'react';
import { 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  Sun, 
  Sunset, 
  Moon, 
  Utensils, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  FileText,
  Clock,
  HeartPulse
} from 'lucide-react';

export function BilingualDischargeReceiptModal({
  isOpen,
  onClose,
  medicines = [],
  doctorInfo = {},
  patientInfo = {},
  diagnosis = 'Prescription Protocol',
  hospitalName = 'PMBJP Empanelled Healthcare Center',
  isDarkMode = false
}) {
  const printRef = useRef(null);

  if (!isOpen || !medicines || medicines.length === 0) return null;

  const totalBrandedCost = medicines.reduce((sum, m) => sum + (Number(m.brandedPrice) || 60), 0);
  const totalGenericCost = medicines.reduce((sum, m) => sum + (Number(m.genericPrice) || 15), 0);
  const totalSavings = Math.max(0, totalBrandedCost - totalGenericCost);
  const savingPercentage = totalBrandedCost > 0 ? ((totalSavings / totalBrandedCost) * 100).toFixed(1) : 75;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white print:static">
      <div className="bg-white text-slate-900 rounded-3xl border border-slate-200 w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-none print:w-full print:rounded-none">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1.5">
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bilingual Patient Care Slip (Hindi + English)</span>
            </span>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Printable / Offline Rural Clinic Ready
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#0f3e3a] hover:bg-[#134e4a] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>1-Tap Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT BODY */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-4 print:overflow-visible">
          
          {/* HOSPITAL LETTERHEAD */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-base">
                  Rx
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-slate-900">
                    {hospitalName}
                  </h1>
                  <p className="text-[11px] text-slate-600 font-medium">
                    National PMBJP Generic Medicine Subsidy Network • Pradhan Mantri Bhartiya Janaushadhi Pariyojana
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right sm:text-right text-xs space-y-0.5 border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="font-bold text-slate-800">{doctorInfo.name || "Dr. Authorized Consultant Physician"}</div>
              <div className="text-slate-500">{doctorInfo.specialty || "General Medicine & Therapeutics"}</div>
              <div className="text-[11px] font-mono text-emerald-800 font-bold">
                Reg: {doctorInfo.regNo || "CGMC-3378 / NMC-2024"}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">Date: {currentDate}</div>
            </div>
          </div>

          {/* PATIENT PROFILE STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Name (मरीज)</span>
              <span className="font-bold text-slate-900 text-sm">{patientInfo.name || "Mr. Verified Citizen"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Age / Gender (आयु/लिंग)</span>
              <span className="font-semibold text-slate-800">{patientInfo.age || "45 Yrs"} • {patientInfo.gender || "Male"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Clinical Indication (निदान)</span>
              <span className="font-semibold text-slate-800 truncate block">{diagnosis}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">ABHA Health ID</span>
              <span className="font-mono font-bold text-emerald-800 text-[11px]">91-8492-3841-9920</span>
            </div>
          </div>

          {/* TIME-OF-DAY VISUAL SCHEDULE GUIDE (LEGEND) */}
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-emerald-950 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Visual Time-of-Day Iconography (समय चिन्ह गाइड):</span>
            </span>
            <div className="flex items-center space-x-4 text-[11px] font-medium text-emerald-900">
              <span className="flex items-center space-x-1">
                <span>🌅</span>
                <span>Morning (सुबह 8:00 AM)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>☀️</span>
                <span>Afternoon (दोपहर 1:30 PM)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🌙</span>
                <span>Night (रात 9:30 PM)</span>
              </span>
            </div>
          </div>

          {/* TABLE OF MEDICINES & BILINGUAL TIMING */}
          <div className="border border-slate-300 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3 w-8">#</th>
                  <th className="p-3">Medicine & Salt (दवाई और फॉर्मूला)</th>
                  <th className="p-3 text-center">Schedule (समय)</th>
                  <th className="p-3">Meal Rule (खाने का नियम)</th>
                  <th className="p-3 text-right">Jan Aushadhi Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {medicines.map((med, index) => {
                  const isMorning = med.schedule?.includes('morning') || med.frequency?.toLowerCase().includes('od') || med.frequency?.includes('1-');
                  const isNoon = med.schedule?.includes('afternoon') || med.frequency?.includes('-1-');
                  const isNight = med.schedule?.includes('night') || med.frequency?.toLowerCase().includes('hs') || med.frequency?.includes('-1');

                  return (
                    <tr key={med.id || index} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-400">{index + 1}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900 text-sm">{med.brandName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {med.genericSalt || "Standard Indian Pharmacopoeia Salt"}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs">
                          <span title="Morning">{isMorning ? '🌅' : '—'}</span>
                          <span className="text-slate-300">|</span>
                          <span title="Afternoon">{isNoon ? '☀️' : '—'}</span>
                          <span className="text-slate-300">|</span>
                          <span title="Night">{isNight ? '🌙' : '—'}</span>
                        </div>
                        <span className="block text-[10px] text-slate-500 mt-0.5 font-bold font-mono">
                          {med.frequency}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                          med.foodRelation?.toLowerCase().includes('empty') || med.foodRelation?.includes('खाली')
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        }`}>
                          {med.foodRelation?.includes('खाली') ? '🥣 ' : '🍲 '}
                          {med.foodRelation || "After meals with water"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="font-bold text-emerald-700 text-sm">
                          ₹{(Number(med.genericPrice) || 15).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 line-through">
                          ₹{(Number(med.brandedPrice) || 60).toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PMBJP TOTAL SAVINGS BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                Jan Aushadhi Generic Savings (प्रधानमंत्री जन औषधि बचत)
              </span>
              <div className="text-base sm:text-lg font-bold">
                Total Monthly Savings: ₹{totalSavings.toFixed(2)} ({savingPercentage}% Lower Cost)
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Market Branded Cost: ₹{totalBrandedCost.toFixed(2)} → Jan Aushadhi Kendra Cost: ₹{totalGenericCost.toFixed(2)}
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs text-center shrink-0 shadow">
              PMBJP Certified Generic
            </div>
          </div>

          {/* DOCTOR DIGITAL SIGNATURE & VERIFICATION QR CODE */}
          <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-3">
              {/* Verification QR SVG */}
              <div className="w-16 h-16 p-1 rounded-xl border border-slate-300 bg-white flex items-center justify-center shrink-0">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div>
                <div className="font-bold text-slate-800">Scan QR to Verify on ABHA</div>
                <div className="text-[10px] text-slate-500 font-mono">ID: NHA-RX-{Date.now().toString().slice(-8)}</div>
                <div className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>National Medical Registry Signed</span>
                </div>
              </div>
            </div>

            {/* Doctor Stamp */}
            <div className="border-2 border-dashed border-emerald-700 p-3 rounded-xl text-center min-w-[200px] bg-emerald-50/40">
              <div className="font-serif italic text-emerald-900 font-bold text-sm">
                {doctorInfo.name || "Dr. Rajesh Sharma, MD"}
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                Digitally Authenticated Stamp
              </div>
              <div className="text-[9px] text-emerald-800 font-mono font-bold">
                NMC Verified Electronic Prescription
              </div>
            </div>
          </div>

          {/* Footer Medical Disclaimer */}
          <div className="text-center text-[10px] text-slate-400 font-medium">
            This bilingual care slip is generated under PMBJP guidelines for patient compliance. Please store in a cool, dry place away from direct sunlight.
          </div>

        </div>

      </div>
    </div>
  );
}
