import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  FileText,
  Lock,
  CheckCircle2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function PrescriptionUploadPage({ 
  onProcessPrescription, 
  selectedLang, 
  onOpenLegal 
}) {
  const isHindi = selectedLang === 'hi';
  const fileInputRef = useRef(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileSelected = (file) => {
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
    setErrorMessage('');
  };

  const handleStartProcessing = () => {
    if (!previewUrl) {
      setErrorMessage("Please choose or capture a prescription photo first.");
      return;
    }
    if (!consentChecked) {
      setErrorMessage("Please check the patient consent box to proceed.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onProcessPrescription({
        fileData: previewUrl,
        fileName: selectedFile?.name || "prescription-capture.jpg"
      });
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="max-w-3xl w-full mx-auto space-y-6 text-[#1c2726] animate-fade-in">
      
      {/* Upload Header Card */}
      <div className="bg-white rounded-3xl border border-[#e8e6df] p-6 sm:p-8 shadow-xs space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>AI Vision OCR Processor</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-normal font-serif-heading text-[#0f3e3a]">
          {isHindi ? "डॉक्टर पर्ची स्कैन करें" : "Upload Doctor's Prescription"}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          {isHindi 
            ? "हस्तलिखित पर्ची की फोटो लें या गैलरी से अपलोड करें" 
            : "Capture handwritten clinic slips or upload digital hospital discharge prescriptions."}
        </p>
      </div>

      <input 
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
      />

      {/* Upload Dropzone */}
      <div className="bg-white rounded-3xl border border-[#e8e6df] p-6 sm:p-8 space-y-5 shadow-xs">
        {!previewUrl ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#cbd5e1] hover:border-[#0f3e3a] rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all bg-[#faf9f5] hover:bg-white flex flex-col items-center justify-center space-y-4 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Camera className="w-8 h-8 text-emerald-700" />
            </div>

            <div>
              <div className="text-base sm:text-lg font-bold text-[#0f3e3a]">
                {isHindi ? "पर्ची की फोटो यहाँ अपलोड करें" : "Click to Snap Photo or Browse File"}
              </div>
              <div className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Supports JPG, PNG, WEBP. Automatic enhancement for low-light clinical handwriting.
              </div>
            </div>

            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-[#0f3e3a] hover:bg-[#134e4a] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm flex items-center space-x-2"
            >
              <Upload className="w-4 h-4 text-emerald-300" />
              <span>Choose Image / Camera</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="aspect-[16/9] sm:aspect-[21/9] bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-[#e8e6df]">
              <img 
                src={previewUrl} 
                alt="Prescription Preview" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-slate-600 hover:text-[#0f3e3a] cursor-pointer underline font-medium"
              >
                Change photo
              </button>
              <button
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                className="text-rose-600 hover:text-rose-700 cursor-pointer font-medium"
              >
                Remove photo
              </button>
            </div>
          </div>
        )}

        {/* Consent Checkbox */}
        <div className="p-4 bg-[#faf9f5] rounded-2xl border border-[#e8e6df] space-y-2">
          <label className="flex items-start space-x-3 cursor-pointer text-xs select-none">
            <input 
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => { setConsentChecked(e.target.checked); setErrorMessage(''); }}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#0f3e3a] focus:ring-[#0f3e3a] cursor-pointer"
            />
            <span className="text-slate-700 leading-relaxed">
              <strong>Patient DPDP Consent:</strong> I authorize AI optical character extraction for my prescription. I understand this is an assistive tool and schedule recommendations should be confirmed with my doctor or pharmacist.
            </span>
          </label>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleStartProcessing}
          disabled={isProcessing}
          className="w-full py-4 rounded-2xl bg-[#0f3e3a] hover:bg-[#134e4a] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-sm flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
          ) : (
            <Sparkles className="w-4 h-4 text-emerald-300" />
          )}
          <span>{isProcessing ? "Analyzing Handwriting & Salts..." : "Process Prescription with AI Vision →"}</span>
        </button>

      </div>

    </div>
  );
}
