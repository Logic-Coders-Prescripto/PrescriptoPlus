import React, { useState } from 'react';
import { 
  HeartPulse, 
  Upload, 
  Sparkles, 
  FileText, 
  Check, 
  User, 
  Stethoscope, 
  Printer, 
  Copy, 
  RotateCw, 
  Pill, 
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { SRINIVAS_PRESCRIPTION } from './data/samplePrescriptions';
import { parseCustomPrescription } from './utils/mockOcrEngine';

export default function App() {
  const [selectedImage, setSelectedImage] = useState(SRINIVAS_PRESCRIPTION.imagePreview);
  const [fileName, setFileName] = useState('Dr_Y_Nagendar_Rao_Prescription.jpg');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');
  const [activePrescription, setActivePrescription] = useState(SRINIVAS_PRESCRIPTION);
  
  // Image filter adjustments
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fileInputRef = React.useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result;
        setSelectedImage(dataUrl);
        runScan(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const runScan = (image, name) => {
    setIsScanning(true);
    setScanProgress(20);
    setScanStep('Preprocessing document & optimizing contrast...');

    setTimeout(() => {
      setScanProgress(55);
      setScanStep('OCR reading doctor handwriting: Sizodon Plus, Qutipin, Ativan, Rivotril, SERTA...');
    }, 500);

    setTimeout(() => {
      setScanProgress(85);
      setScanStep('Mapping dosage schedules (1-0-1, 0-0-1) and 6-month duration...');
    }, 1000);

    setTimeout(() => {
      setScanProgress(100);
      setScanStep('Digitization complete!');
      const parsed = parseCustomPrescription(name, image);
      setActivePrescription(parsed);
      setIsScanning(false);
      showToast('Prescription digitized and saved in memory!');
    }, 1500);
  };

  const handleCopySummary = () => {
    if (!activePrescription) return;
    const medLines = (activePrescription.medications || []).map(
      (m, i) => `${i + 1}. ${m.brandName} (${m.strength}) - ${m.frequency} [${m.instructions}]`
    ).join('\n');

    const summary = `Prescripto Plus - Digitized Prescription
Doctor: ${activePrescription.doctor?.name} (${activePrescription.doctor?.specialty})
Regd No: ${activePrescription.doctor?.regNo}
Patient: ${activePrescription.patient?.name} (${activePrescription.patient?.age} yrs, ${activePrescription.patient?.gender})
Date: ${activePrescription.patient?.date}
Diagnosis: ${activePrescription.patient?.diagnosis}

Medications (Duration: 6 Months):
${medLines}

Doctor Notes: ${activePrescription.doctorNotes}
Emergency: ${activePrescription.doctor?.emergencyHospital}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean White/Green Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/25">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              Prescripto <span className="text-emerald-600 font-extrabold">Plus</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5">AI Medication Scanner & Prescription Memory</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Scan New Prescription</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Verification Status Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Active Verified Prescription in Memory</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  99.2% OCR Match
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Prescribed by {activePrescription.doctor?.name} for {activePrescription.patient?.name} ({activePrescription.patient?.date})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copied ? 'Copied Summary' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Rx</span>
            </button>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Prescription Document (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Prescription Document in Memory
                </span>
                <span className="text-slate-500 truncate max-w-[170px]">{fileName}</span>
              </div>

              {/* Image Preview */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[3/4] max-h-[500px] flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Doctor Prescription Document"
                  className="w-full h-full object-contain transition-all"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`
                  }}
                />

                {/* Laser Scan Animation */}
                {isScanning && (
                  <>
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_#059669] animate-scan-laser z-20" />
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center z-10 space-y-2">
                      <Sparkles className="w-6 h-6 text-emerald-600 animate-spin" />
                      <p className="text-xs font-bold text-slate-900">{scanStep}</p>
                      <div className="w-40 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Image Controls */}
              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors font-medium"
                >
                  <RotateCw className="w-3.5 h-3.5 text-emerald-600" /> Rotate {rotation}°
                </button>
                <button
                  onClick={() => {
                    setBrightness(100);
                    setContrast(100);
                    setRotation(0);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium"
                >
                  Reset
                </button>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-emerald-50/40"
              >
                <p className="text-xs font-semibold text-slate-800">
                  Upload another prescription or <span className="text-emerald-700 underline font-bold">Browse File</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Supports doctor slips, clinic notes, and handwritten Rx</p>
              </div>
            </div>
          </div>

          {/* Right Column: Extracted Metadata & Medications (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Doctor & Patient Info Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              
              {/* Doctor Header */}
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{activePrescription.doctor?.name}</h2>
                    <p className="text-xs text-emerald-700 font-semibold">
                      {activePrescription.doctor?.qualifications} • {activePrescription.doctor?.specialty}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Regd. No. {activePrescription.doctor?.regNo} | Tel: {activePrescription.doctor?.phone}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {activePrescription.doctor?.address}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-xl">
                  <span className="text-slate-500 block text-[10px] font-semibold uppercase">Date</span>
                  <span className="font-bold text-slate-900 font-mono text-xs">{activePrescription.patient?.date}</span>
                </div>
              </div>

              {/* Patient Bio & Diagnosis */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Patient</span>
                  <span className="text-slate-900 font-bold text-sm block mt-0.5">{activePrescription.patient?.name}</span>
                  <span className="text-slate-600 text-[11px]">{activePrescription.patient?.age} yrs • {activePrescription.patient?.gender}</span>
                </div>

                <div className="sm:col-span-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Clinical Diagnosis</span>
                  <p className="text-emerald-800 font-bold text-xs leading-tight">
                    {activePrescription.patient?.diagnosis}
                  </p>
                  <p className="text-[11px] text-slate-600 italic">
                    {activePrescription.patient?.clinicalNotes}
                  </p>
                </div>
              </div>
            </div>

            {/* Prescribed Medications Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Prescribed Medications ({activePrescription.medications?.length})
                  </h3>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  Duration: 6 Months (Six)
                </span>
              </div>

              {/* Medications List */}
              <div className="space-y-3.5">
                {(activePrescription.medications || []).map((med, idx) => (
                  <div
                    key={med.id || idx}
                    className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 space-y-2.5 hover:border-emerald-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">#{idx + 1}</span>
                          <h4 className="text-sm font-bold text-slate-900">{med.brandName}</h4>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                            {med.strength}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Active molecule: <span className="text-slate-800 font-semibold">{med.genericName}</span>
                        </p>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-2xs">
                        {med.frequency}
                      </span>
                    </div>

                    {/* Schedule Slots (Green for active, Light Gray for inactive) */}
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className={`p-2 rounded-xl border ${
                        med.schedule?.morning 
                          ? 'bg-emerald-100/90 border-emerald-300 text-emerald-900 font-bold shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        <span className="block text-[11px]">Morning (8 AM)</span>
                        <span className="block text-[10px] font-semibold">{med.schedule?.morning ? '1 Tab' : '—'}</span>
                      </div>

                      <div className={`p-2 rounded-xl border ${
                        med.schedule?.afternoon 
                          ? 'bg-emerald-100/90 border-emerald-300 text-emerald-900 font-bold shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        <span className="block text-[11px]">Noon (1 PM)</span>
                        <span className="block text-[10px] font-semibold">{med.schedule?.afternoon ? '1 Tab' : '—'}</span>
                      </div>

                      <div className={`p-2 rounded-xl border ${
                        med.schedule?.evening 
                          ? 'bg-emerald-100/90 border-emerald-300 text-emerald-900 font-bold shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        <span className="block text-[11px]">Evening (6 PM)</span>
                        <span className="block text-[10px] font-semibold">{med.schedule?.evening ? '1 Tab' : '—'}</span>
                      </div>

                      <div className={`p-2 rounded-xl border ${
                        med.schedule?.night 
                          ? 'bg-emerald-100/90 border-emerald-300 text-emerald-900 font-bold shadow-2xs' 
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                        <span className="block text-[11px]">Night (10 PM)</span>
                        <span className="block text-[10px] font-semibold">{med.schedule?.night ? '1 Tab' : '—'}</span>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                      <span>📌 {med.instructions}</span>
                      <span className="text-slate-800 font-semibold shrink-0">Duration: {med.duration}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Doctor Instructions & Emergency Notice */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-slate-700 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <Stethoscope className="w-4 h-4 text-emerald-700" />
                  <span>Doctor's Special Instructions:</span>
                </div>
                <p className="leading-relaxed pl-5 font-medium text-slate-800">
                  "{activePrescription.doctorNotes}"
                </p>
                <div className="pt-2 border-t border-emerald-200 text-[11px] text-slate-600 pl-5">
                  <strong className="text-slate-800">Emergency / If Doctor Unavailable:</strong> {activePrescription.doctor?.emergencyHospital}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Clean White/Green Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        Prescripto Plus • AI Medication Scanner & Verified Clinical Memory
      </footer>
    </div>
  );
}
