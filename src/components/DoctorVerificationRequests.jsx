import React, { useState } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  FileText, 
  AlertCircle,
  Pill,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function DoctorVerificationRequests({ 
  doctorProfile, 
  prescriptions = [], 
  onVerifyPrescription, 
  selectedLang 
}) {
  const [selectedRx, setSelectedRx] = useState(prescriptions[0] || null);
  const [doctorNote, setDoctorNote] = useState('Doses verified as per pediatric URTI fever protocol. Ensure hydration.');
  const [isApproved, setIsApproved] = useState(false);

  const handleApprove = () => {
    if (!selectedRx) return;

    onVerifyPrescription(selectedRx.id, {
      approvedBy: doctorProfile?.name || "Dr. Rajesh Sharma, MD",
      regNo: doctorProfile?.regNo || "MCI-48291",
      hospital: doctorProfile?.hospital || "Apollo Hospitals",
      doctorNote: doctorNote,
      verifiedAt: new Date().toISOString()
    });

    setIsApproved(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#1c2726]">
      
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#e8e6df] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Doctor Verification Station (HITL)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-normal font-serif-heading text-[#0f3e3a]">
            Prescription Verification Requests
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Review OCR extractions, adjust clinical dosages, and affix your Medical Council digital signature.
          </p>
        </div>

        <div className="bg-[#faf9f5] border border-[#e8e6df] p-3 rounded-2xl flex items-center space-x-3 self-start md:self-auto shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-[#0f3e3a] text-white flex items-center justify-center font-bold text-xs">
            DR
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#0f3e3a] block">{doctorProfile?.name || "Dr. Rajesh Sharma"}</span>
            <span className="text-[11px] font-mono text-emerald-800 font-semibold">{doctorProfile?.regNo || "MCI-48291"} (Verified)</span>
          </div>
        </div>
      </div>

      {/* Main Verification Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Uploaded Image Preview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#e8e6df] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0f3e3a]">
              Original Patient Upload
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-[#faf9f5] px-2 py-0.5 rounded-lg border border-[#e8e6df]">
              HIGH RES 1080P
            </span>
          </div>

          <div className="aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-[#e8e6df]">
            <img 
              src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80" 
              alt="Prescription Slip"
              className="w-full h-full object-cover" 
            />
          </div>

          <div className="p-3 bg-[#faf9f5] rounded-2xl border border-[#e8e6df] text-xs text-slate-600 space-y-1">
            <div className="font-bold text-[#0f3e3a]">Patient Demographics:</div>
            <div>Name: <strong>Dev Soni</strong> (Age 20, Male)</div>
            <div>Uploaded: Today, 10:14 AM via Patient Portal</div>
          </div>
        </div>

        {/* Right Col: Extracted Data & Digital Sign-off (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e8e6df] p-6 sm:p-8 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f0e9]">
              <h3 className="text-base font-bold text-[#0f3e3a]">
                AI-Extracted Medication Formulations
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                98% OCR Match
              </span>
            </div>

            <div className="space-y-2.5">
              {(selectedRx?.extraction?.medicines || []).map((med, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#faf9f5] border border-[#e8e6df] flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-bold text-[#0f3e3a]">{med.brandName || med.name?.value}</h4>
                    <p className="text-[11px] text-slate-500">{med.genericSalt || "Paracetamol IP"} • {med.foodRelation?.value || med.foodRelation || "After food"}</p>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-[#e8e6df]">
                    {med.frequency?.value || med.frequency || "TID"}
                  </span>
                </div>
              ))}
            </div>

            {/* Doctor Advice Input */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold text-[#0f3e3a]">
                Doctor's Clinical Notes / Specific Instructions:
              </label>
              <textarea 
                rows={2}
                value={doctorNote}
                onChange={(e) => setDoctorNote(e.target.value)}
                placeholder="Enter clinical advice for patient..."
                className="w-full bg-[#faf9f5] border border-[#e8e6df] focus:border-[#0f3e3a] rounded-xl p-3 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Verification Actions */}
          <div className="pt-4 border-t border-[#f1f0e9] flex items-center justify-between gap-3">
            <button
              onClick={() => alert("Verification rejected. Patient will be notified.")}
              className="px-4 py-2.5 text-xs text-rose-600 font-bold hover:bg-rose-50 rounded-xl cursor-pointer"
            >
              Reject / Request Rescan
            </button>

            <button
              onClick={handleApprove}
              className="px-6 py-3 rounded-2xl bg-[#0f3e3a] hover:bg-[#134e4a] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs flex items-center space-x-2"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-300" />
              <span>{isApproved ? "✓ Digitally Signed & Approved" : "Digitally Sign & Approve Rx →"}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
