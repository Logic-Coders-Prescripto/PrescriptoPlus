import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Download, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles,
  Server,
  Database
} from 'lucide-react';
import { generateAbdmFhirBundle } from '../utils/abdmFhirGenerator';

export function AbdmFhirExportModal({
  isOpen,
  onClose,
  medicines = [],
  doctorInfo = {},
  patientInfo = {},
  diagnosis = 'Clinical Prescription Protocol',
  hospitalName = 'PMBJP Healthcare Center',
  isDarkMode = false
}) {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  if (!isOpen) return null;

  const fhirBundle = generateAbdmFhirBundle({
    prescriptionId: 'rx-' + Date.now(),
    patient: patientInfo,
    doctor: doctorInfo,
    hospital: hospitalName,
    diagnosis,
    medicines
  });

  const jsonString = JSON.stringify(fhirBundle, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ABDM-FHIR-Prescription-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('SYNCED_TO_ABHA_LOCKER');
    }, 1200);
  };

  const cardBg = isDarkMode ? "bg-[#0b2420] border-[#16443c] text-white" : "bg-white border-[#e8e6df] text-[#1c2726]";
  const subCardBg = isDarkMode ? "bg-[#10332d] border-[#184840]" : "bg-[#faf9f5] border-[#e8e6df]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className={`${cardBg} rounded-3xl border w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#f1f0e9]/30">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Ayushman Bharat Digital Mission (ABDM) Compliant</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                HL7 FHIR R4 Bundle
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading">
              National Health Authority (NHA) FHIR Export
            </h2>
            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Digitized electronic prescription interoperable with all Indian ABDM health lockers, PHR apps, and hospitals.
            </p>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-2xl ${isDarkMode ? 'hover:bg-[#16443c] text-slate-400' : 'hover:bg-slate-100 text-slate-500'} transition-colors cursor-pointer`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#0d2a25] border-b border-[#f1f0e9]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300 font-mono">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>Resources: {fhirBundle.entry.length} FHIR Records</span>
            </div>

            {syncStatus === 'SYNCED_TO_ABHA_LOCKER' ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Synced to ABHA ID (Simulated)</span>
              </span>
            ) : (
              <button
                onClick={handleSimulateSync}
                disabled={isSyncing}
                className="px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
              >
                <Server className="w-3.5 h-3.5" />
                <span>{isSyncing ? "Connecting Gateway..." : "Sync to ABHA Locker"}</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition-colors font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-600" />
              <span>{copied ? "Copied to Clipboard!" : "Copy JSON"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .fhir.json</span>
            </button>
          </div>
        </div>

        {/* JSON Syntax Viewer */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-950 text-slate-100 font-mono text-xs shadow-inner">
          <pre className="whitespace-pre-wrap leading-relaxed">
            <code>{jsonString}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f1f0e9]/20 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Profile: NRCES StructureDefinition/PrescriptionRecord</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
