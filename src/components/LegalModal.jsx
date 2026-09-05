import React, { useState } from 'react';
import { X, ShieldAlert, FileText, Lock, Scale, HelpCircle } from 'lucide-react';

export function LegalModal({ isOpen, onClose, defaultTab = 'disclaimer' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white border border-[#e8e6df] max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative my-6 text-[#1c2726] space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#0f3e3a] border border-emerald-200 flex items-center justify-center font-bold">
            <Scale className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0f3e3a] font-heading">
              Prescripto Governance & Legal Framework
            </h2>
            <p className="text-xs text-slate-500">
              Healthcare DPDP Act Compliance & Medical AI Ethics Policies
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs border-b border-[#f1f0e9]">
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold cursor-pointer transition-all ${
              activeTab === 'disclaimer' ? 'bg-[#0f3e3a] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Medical & AI Disclaimer
          </button>
          <button
            onClick={() => setActiveTab('consent')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold cursor-pointer transition-all ${
              activeTab === 'consent' ? 'bg-[#0f3e3a] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Patient Consent Policy
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold cursor-pointer transition-all ${
              activeTab === 'privacy' ? 'bg-[#0f3e3a] text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Data Retention & Deletion
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-3 text-xs text-slate-600 max-h-72 overflow-y-auto leading-relaxed pr-1 bg-[#faf9f5] p-4 rounded-2xl border border-[#e8e6df]">
          {activeTab === 'disclaimer' && (
            <div className="space-y-2">
              <h4 className="font-bold text-[#0f3e3a] text-sm">Medical AI Assistive Disclaimer</h4>
              <p>
                Prescripto is designed strictly as an assistive medical transcription and schedule management tool. It does not provide autonomous medical diagnoses, alter prescriptions, or replace clinical consultation with a licensed physician.
              </p>
              <p>
                AI-extracted data must always be verified against the physical doctor's prescription or reviewed by a verified medical practitioner. Never stop, change, or start any treatment without consulting a licensed physician or pharmacist.
              </p>
            </div>
          )}

          {activeTab === 'consent' && (
            <div className="space-y-2">
              <h4 className="font-bold text-[#0f3e3a] text-sm">Patient Data Consent Notice</h4>
              <p>
                By uploading a prescription, the patient grants explicit, revocable consent for optical character recognition (OCR) and doctor verification.
              </p>
              <p>
                Patients maintain full rights to delete their uploaded prescription data at any time from their personal dashboard.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-2">
              <h4 className="font-bold text-[#0f3e3a] text-sm">Data Retention & Deletion Policy</h4>
              <p>
                All temporary prescription processing memory is wiped immediately upon session exit or explicit user deletion.
              </p>
              <p>
                Doctor-verified records are encrypted with zero-knowledge keys and are accessible only to the patient and verified medical council registered practitioners.
              </p>
            </div>
          )}
        </div>

        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0f3e3a] hover:bg-[#134e4a] text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
}
