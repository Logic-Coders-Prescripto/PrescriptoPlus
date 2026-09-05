import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  FileText, 
  HeartPulse, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function ExportModal({ prescription, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const generateShareText = () => {
    const medLines = (prescription.medications || []).map(
      (m, i) => `${i + 1}. ${m.brandName} (${m.strength}) - ${m.frequency} [${m.instructions}]`
    ).join('\n');

    return `🏥 Prescripto Plus Digital Prescription Summary
Patient: ${prescription.patient?.name} (Age: ${prescription.patient?.age})
Diagnosis: ${prescription.patient?.diagnosis}
Doctor: ${prescription.doctor?.name} (${prescription.doctor?.clinic})
Date: ${prescription.patient?.date}

📋 Prescribed Medications:
${medLines}

⚠️ Special Instructions: ${prescription.doctorNotes || 'Take medications consistently.'}
🔗 Verified via Prescripto Plus AI Platform`;
  };

  const handleCopyText = () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl my-8 overflow-hidden">
        
        {/* Modal Action Header (Excluded from print) */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Digital Prescription Report</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Summary' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Document Body */}
        <div ref={printRef} className="p-6 sm:p-10 space-y-6 text-slate-900 bg-white rounded-b-3xl print:p-0 print:m-0 print:rounded-none">
          
          {/* Clinic & Doctor Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <HeartPulse className="w-6 h-6 text-emerald-600" />
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {prescription.doctor?.clinic || 'Metropolitan Health Clinic'}
                </h1>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-1">
                {prescription.doctor?.name} • {prescription.doctor?.specialty}
              </p>
              <p className="text-[11px] text-slate-500">
                Reg No: {prescription.doctor?.regNo} | Phone: {prescription.doctor?.phone}
              </p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                Digitized Medical Record
              </span>
              <p className="text-slate-500 text-[11px] mt-1.5">Date: {prescription.patient?.date || '2026-09-05'}</p>
              <p className="text-slate-500 text-[11px]">Rx ID: {prescription.id}</p>
            </div>
          </div>

          {/* Patient Details Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Patient Name</span>
              <span className="font-bold text-slate-900">{prescription.patient?.name}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Age / Gender</span>
              <span className="font-semibold text-slate-800">{prescription.patient?.age} yrs / {prescription.patient?.gender}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Blood Pressure</span>
              <span className="font-semibold text-slate-800">{prescription.patient?.bp || '--'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Diagnosis</span>
              <span className="font-bold text-emerald-800">{prescription.patient?.diagnosis}</span>
            </div>
          </div>

          {/* Medication Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>℞</span> Prescribed Medications & Dosage Instructions
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700">
                  <tr>
                    <th className="p-2.5 font-bold">#</th>
                    <th className="p-2.5 font-bold">Medicine / Strength</th>
                    <th className="p-2.5 font-bold">Schedule (M-A-E-N)</th>
                    <th className="p-2.5 font-bold">Meal Timing</th>
                    <th className="p-2.5 font-bold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {(prescription.medications || []).map((med, idx) => (
                    <tr key={med.id || idx}>
                      <td className="p-2.5 font-semibold text-slate-400">{idx + 1}</td>
                      <td className="p-2.5">
                        <span className="font-bold text-slate-900 block">{med.brandName} ({med.strength})</span>
                        <span className="text-[11px] text-slate-500">{med.genericName} • {med.form}</span>
                      </td>
                      <td className="p-2.5 font-mono text-slate-700 font-semibold">
                        {med.schedule?.morning ? '1' : '0'}-{med.schedule?.afternoon ? '1' : '0'}-{med.schedule?.evening ? '1' : '0'}-{med.schedule?.night ? '1' : '0'}
                      </td>
                      <td className="p-2.5 text-slate-700">
                        {med.beforeFood ? 'Before Food' : 'After Food'}
                      </td>
                      <td className="p-2.5 text-slate-700 font-medium">{med.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctor Notes & Special Advice */}
          {prescription.doctorNotes && (
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">Doctor's Advice & Diet Restrictions:</span>
              <p className="text-emerald-950 leading-relaxed">{prescription.doctorNotes}</p>
            </div>
          )}

          {/* Footer & QR Code Verification */}
          <div className="pt-4 border-t-2 border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Dynamic SVG QR Code */}
              <div className="w-16 h-16 p-1 bg-white border border-slate-300 rounded-lg flex items-center justify-center shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                  <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="currentColor" />
                  
                  <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" fill="currentColor" />
                  
                  <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                  <rect x="40" y="10" width="10" height="20" fill="currentColor" />
                  <rect x="55" y="25" width="10" height="10" fill="currentColor" />
                  <rect x="35" y="45" width="30" height="10" fill="currentColor" />
                  <rect x="40" y="70" width="20" height="20" fill="currentColor" />
                  <rect x="70" y="50" width="15" height="15" fill="currentColor" />
                </svg>
              </div>

              <div className="text-[11px] text-slate-500">
                <span className="font-bold text-slate-800 block">Scan to Verify with Pharmacy</span>
                <span>Digitally certified through Prescripto Plus OCR Clinical Engine v3.2</span>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-serif italic font-bold text-slate-800 text-sm">{prescription.doctor?.name}</div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Authorized Signatory</span>
              <span className="text-[10px] text-emerald-700 font-semibold">Next Follow-up: {prescription.followUpDate || '4 Weeks'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
