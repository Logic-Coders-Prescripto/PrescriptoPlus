import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Database,
  FastForward
} from 'lucide-react';

export default function ScannerAnimation({ scanData, onScanComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [visibleBoxes, setVisibleBoxes] = useState([]);

  const pipelineSteps = [
    { label: 'Preprocessing document & calibrating contrast...', icon: Cpu },
    { label: 'Neural OCR Handwriting & print segmentation...', icon: Search },
    { label: 'Mapping chemical entities with RxNorm & FDA database...', icon: Database },
    { label: 'Cross-referencing drug-drug & food safety alerts...', icon: ShieldCheck },
    { label: 'Finalizing structured clinical schedule...', icon: Sparkles }
  ];

  const overlayBoxes = scanData?.overlayBoxes || [
    { top: '15%', left: '10%', width: '45%', height: '8%', label: 'Patient Info' },
    { top: '28%', left: '10%', width: '80%', height: '14%', label: 'Rx: Medication 1' },
    { top: '45%', left: '10%', width: '80%', height: '14%', label: 'Rx: Medication 2' },
    { top: '65%', left: '10%', width: '80%', height: '14%', label: 'Rx: Medication 3' },
    { top: '82%', left: '60%', width: '30%', height: '10%', label: "Doctor's Stamp" }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgress(35);
      setVisibleBoxes(overlayBoxes.slice(0, 1));
    }, 600);

    const timer2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgress(60);
      setVisibleBoxes(overlayBoxes.slice(0, 3));
    }, 1300);

    const timer3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgress(85);
      setVisibleBoxes(overlayBoxes.slice(0, 4));
    }, 2000);

    const timer4 = setTimeout(() => {
      setCurrentStepIndex(4);
      setProgress(98);
      setVisibleBoxes(overlayBoxes);
    }, 2600);

    const timer5 = setTimeout(() => {
      setProgress(100);
      onScanComplete();
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-4">
      {/* Scanner Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-spin" /> Prescripto Plus DeepVision OCR v3.2
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Digitizing Prescription Slip...
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Extracting patient metadata, brand-generic formulas, dosages, and safety contraindications.
        </p>

        {/* Skip button */}
        <button
          onClick={onScanComplete}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
        >
          <FastForward className="w-3.5 h-3.5 text-emerald-400" /> Skip Scan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Document Optical Scanner Container (Left 7 Cols) */}
        <div className="md:col-span-7">
          <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 p-2 shadow-2xl shadow-emerald-950/80">
            <div className="relative aspect-[3/4] max-h-[420px] w-full rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center">
              {/* Prescription Document Image */}
              <img
                src={scanData?.image}
                alt="Document being scanned"
                className="w-full h-full object-contain filter contrast-125"
                style={{
                  transform: `rotate(${scanData?.enhancements?.rotation || 0}deg)`,
                  filter: `brightness(${scanData?.enhancements?.brightness || 100}%) contrast(${scanData?.enhancements?.contrast || 100}%)`
                }}
              />

              {/* Laser Scanning Beam */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] animate-scan-laser z-20 pointer-events-none" />

              {/* Laser Beam Gradient Glow */}
              <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-emerald-500/20 to-transparent animate-scan-laser z-10 pointer-events-none" />

              {/* Dynamic OCR Recognition Bounding Boxes */}
              {visibleBoxes.map((box, idx) => (
                <div
                  key={idx}
                  className="absolute border-2 border-emerald-400 bg-emerald-500/20 rounded-md z-15 transition-all duration-300 animate-pulse pointer-events-none"
                  style={{
                    top: box.top,
                    left: box.left,
                    width: box.width,
                    height: box.height
                  }}
                >
                  <span className="absolute -top-5 left-1 text-[9px] font-bold bg-slate-950/90 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40 shadow">
                    {box.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Processing Pipeline Stepper (Right 5 Cols) */}
        <div className="md:col-span-5 space-y-5">
          {/* Progress Bar */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300">OCR Confidence Extraction</span>
              <span className="text-emerald-400 font-mono text-sm">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stepper Status List */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Neural Pipeline
            </h3>

            <div className="space-y-2.5">
              {pipelineSteps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all duration-200 ${
                      isCurrent
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-white shadow-md'
                        : isCompleted
                        ? 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                        : 'border-transparent text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Icon className={`w-4 h-4 ${isCurrent ? 'text-emerald-400 animate-spin' : 'text-slate-500'}`} />
                      )}
                    </div>
                    <span className="font-medium leading-tight">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
