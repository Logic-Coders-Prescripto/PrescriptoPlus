import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Camera, 
  Sparkles, 
  RotateCw, 
  Sun, 
  Contrast, 
  Check, 
  Image as ImageIcon,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { SAMPLE_PRESCRIPTIONS } from '../data/samplePrescriptions';

export default function PrescriptionUploader({ onStartScan, onSelectPreset }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [selectedPresetId, setSelectedPresetId] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    setFileName(file.name);
    setSelectedPresetId(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePresetClick = (preset) => {
    setSelectedPresetId(preset.id);
    setSelectedImage(preset.imagePreview);
    setFileName(preset.title);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    onSelectPreset(preset);
  };

  const handleLaunchScan = () => {
    if (!selectedImage) return;
    onStartScan({
      image: selectedImage,
      fileName: fileName || 'Uploaded-Prescription.jpg',
      presetId: selectedPresetId,
      enhancements: { rotation, brightness, contrast }
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Clinical OCR & Drug Interaction Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Turn Messy Prescriptions into <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Digital Clarity</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Upload any handwritten or printed doctor slip. Prescripto Plus automatically extracts dosage timings, flags dangerous drug contraindications, organizes your daily dose calendar, and finds generic cost savings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload Dropzone & Controls (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                Upload Doctor Slip or Rx Image
              </h2>
              <span className="text-xs text-slate-400">JPG, PNG, WEBP or PDF</span>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] overflow-hidden ${
                isDragging
                  ? 'border-emerald-400 bg-emerald-950/30 scale-[0.99]'
                  : selectedImage
                  ? 'border-emerald-500/40 bg-slate-900/60 hover:border-emerald-400'
                  : 'border-slate-700/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {selectedImage ? (
                <div className="w-full h-full flex flex-col items-center">
                  <div className="relative max-h-56 max-w-full rounded-xl overflow-hidden shadow-xl border border-slate-700 bg-slate-950">
                    <img
                      src={selectedImage}
                      alt="Prescription preview"
                      className="max-h-56 object-contain transition-all duration-200"
                      style={{
                        transform: `rotate(${rotation}deg)`,
                        filter: `brightness(${brightness}%) contrast(${contrast}%)`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end justify-center p-3">
                      <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 bg-slate-900/90 px-3 py-1 rounded-full border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" /> Ready for AI Analysis ({fileName})
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-400">Click or drop another file to replace</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-950/50">
                    <Upload className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Drag & Drop prescription image here, or <span className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-4">Browse files</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">High resolution or clear phone photos yield 99%+ OCR accuracy</p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Select default preset if user clicks sample camera
                        handlePresetClick(SAMPLE_PRESCRIPTIONS[0]);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-teal-400" /> Use Camera Simulation
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Image Enhancements Bar (Visible when image is loaded) */}
            {selectedImage && (
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> OCR Pre-Processing Enhancements
                  </span>
                  <button
                    onClick={() => {
                      setRotation(0);
                      setBrightness(100);
                      setContrast(100);
                    }}
                    className="text-slate-400 hover:text-emerald-400 text-[11px]"
                  >
                    Reset Filters
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {/* Rotate */}
                  <button
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-all active:scale-95"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-emerald-400" /> Rotate ({rotation}°)
                  </button>

                  {/* Brightness */}
                  <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                    <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <input
                      type="range"
                      min="70"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 w-6">{brightness}%</span>
                  </div>

                  {/* Contrast */}
                  <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                    <Contrast className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <input
                      type="range"
                      min="70"
                      max="160"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 w-6">{contrast}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Launch OCR Button */}
            <button
              disabled={!selectedImage}
              onClick={handleLaunchScan}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                selectedImage
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 shadow-emerald-500/25 active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>Digitize & Analyze Prescription</span>
            </button>
          </div>
        </div>

        {/* Quick Sample Presets (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  Try Real Sample Prescriptions
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Test Prescripto Plus features without uploading your own file</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-500/30">
                1-Click Demo
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {SAMPLE_PRESCRIPTIONS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetClick(preset)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 group ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/60'
                        : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 border border-emerald-500/20">
                          {preset.category}
                        </span>
                        <h3 className="text-sm font-bold text-white mt-1.5 group-hover:text-emerald-300 transition-colors">
                          {preset.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">{preset.description}</p>
                      </div>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1 transition-all ${
                        isSelected ? 'bg-emerald-400 text-slate-950' : 'border border-slate-700 group-hover:border-slate-500'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{preset.doctor.name.split(',')[0]}</span>
                      <span className="text-emerald-400 font-semibold">{preset.medications.length} Medicines</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>HIPAA & Privacy Guarantee:</strong> Prescripto Plus processes all scans through client-side sandbox emulation. No confidential patient data is stored without permission.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
