import React, { useRef } from 'react';
import { Camera, Upload, RefreshCw, CheckCircle2, X, Sparkles, Activity, FileText, Pill, ChevronDown, AlertCircle, Trash2 } from 'lucide-react';

export function PrescriptionScanner({ 
  uploadedImage, 
  onImageUploaded, 
  onRemoveImage,
  isScanning, 
  scanStatusText,
  errorMessage,
  onTriggerScan, 
  overallConfidence,
  totalDetectedMeds,
  decodedCategory,
  doctorSpecialty,
  userProfile,
  selectedLang,
  isDarkMode = false,
  onSelectSampleRx
}) {
  const fileInputRef = useRef(null);
  const isHindi = selectedLang === 'hi';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUploaded(event.target.result, file.name);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const cardBg = isDarkMode ? "bg-[#0f2c27] border-[#18443e] text-white" : "bg-white border-[#e8e6df] text-[#1c2726]";
  const subCardBg = isDarkMode ? "bg-[#143b35] border-[#1b4841]" : "bg-[#faf9f5] border-[#e8e6df]";

  return (
    <div className={`${cardBg} rounded-3xl border p-6 sm:p-8 space-y-5 shadow-xs transition-colors`}>
      
      {/* Scanner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f0e9]/50">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>Prescription Vision & Optical OCR Reader</span>
          </div>
          <h2 className="text-xl font-bold font-heading">
            {isHindi ? "डॉक्टर की पर्ची अपलोड करें" : "Scan & Read Doctor's Prescription"}
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {isHindi 
              ? "पर्ची की फोटो से दवाइयों के नाम और खुराक सीधे पढ़ें" 
              : "Upload or photograph any handwritten or printed clinic prescription slip to extract medicines"}
          </p>
        </div>

        {/* Readability Meter Badge */}
        {uploadedImage && !errorMessage && (
          <div className={`${subCardBg} border px-3.5 py-1.5 rounded-2xl flex items-center space-x-2 self-start sm:self-auto shadow-xs`}>
            <div className="flex items-center space-x-1 text-emerald-700">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold">{isHindi ? "रीडिंग एक्यूरेसी:" : "OCR Accuracy:"}</span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {overallConfidence}%
            </span>
          </div>
        )}
      </div>

      {/* ERROR BANNER: Shown if non-prescription image is uploaded */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-xs text-rose-900 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-rose-800">
              {isHindi ? "अमान्य दस्तावेज़ (Invalid Document)" : "Invalid Prescription Document"}
            </div>
            <p className="text-rose-700 leading-relaxed">
              {errorMessage}
            </p>
            <div className="pt-1">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-rose-800 underline hover:text-rose-950 cursor-pointer"
              >
                {isHindi ? "कृपया सही डॉक्टर की पर्ची अपलोड करें" : "Click here to upload a valid doctor's prescription slip"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
      />

      {/* UPLOAD SCANNER DROPZONE */}
      {!uploadedImage ? (
        <div className={`border-2 border-dashed ${isDarkMode ? 'border-[#1b4841] bg-[#0c2722]/50' : 'border-[#cbd5e1] bg-[#faf9f5]'} rounded-3xl p-8 sm:p-10 text-center transition-all flex flex-col items-center justify-center space-y-4`}>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-transform"
          >
            <Camera className="w-7 h-7" />
          </div>

          <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
            <div className="text-base font-bold">
              {isHindi ? "डॉक्टर की पर्ची अपलोड करें" : "Upload Doctor's Prescription"}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-teal-200/70' : 'text-slate-500'} mt-1 max-w-sm mx-auto`}>
              {isHindi 
                ? "कैमरा से फोटो खींचें या गैलरी से पर्ची चुनें" 
                : "Take a photo with your camera or choose a prescription image from your gallery"}
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md inline-flex items-center space-x-2"
          >
            <Camera className="w-4 h-4 text-emerald-200" />
            <span>{isHindi ? "📷 फोटो खींचें / अपलोड करें" : "Snap / Upload Prescription"}</span>
          </button>

          {/* Interactive Sample Prescriptions Section */}
          <div className="pt-2 w-full flex flex-col items-center space-y-2.5">
            <div className={`text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1.5 ${isDarkMode ? 'text-teal-400' : 'text-teal-700'}`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>INTERACTIVE SAMPLE PRESCRIPTIONS</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSampleRx && onSelectSampleRx('rx-1');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs flex items-center space-x-1.5 ${
                  isDarkMode 
                    ? 'bg-[#0e302a] border-[#1f574d] text-teal-200 hover:bg-[#14423b] hover:border-teal-400' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-800'
                }`}
              >
                <span>💊</span>
                <span>Fever & Infection Rx</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSampleRx && onSelectSampleRx('rx-2');
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs flex items-center space-x-1.5 ${
                  isDarkMode 
                    ? 'bg-[#0e302a] border-[#1f574d] text-teal-200 hover:bg-[#14423b] hover:border-teal-400' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-teal-600 hover:text-teal-800'
                }`}
              >
                <span>❤️</span>
                <span>Cardiology Care Rx</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Active Photo Box */}
          <div className={`${subCardBg} rounded-2xl border overflow-hidden`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 ${isDarkMode ? 'bg-[#0f2c27]' : 'bg-white'} border-b border-[#e8e6df]/50 text-xs gap-2`}>
              <div className="flex items-center space-x-2 text-emerald-800 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isHindi ? "पर्ची लोड हो गई है" : "Prescription Image Loaded"}</span>
                {totalDetectedMeds > 0 && (
                  <span className="text-slate-500 text-[11px] font-mono">
                    ({totalDetectedMeds} {totalDetectedMeds === 1 ? 'medicine' : 'medicines'} detected)
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer font-bold text-xs shadow-xs"
                  title="Remove prescription image"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isHindi ? "हटाएं" : "Remove"}</span>
                </button>
              </div>
            </div>

            {/* Rendered Document Photo */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img 
                src={uploadedImage} 
                alt="Prescription document" 
                className="w-full h-full object-contain"
              />

              {/* Scanning Loader */}
              {isScanning && (
                <div className="absolute inset-0 bg-[#0f3e3a]/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 z-20 space-y-2 text-white">
                  <RefreshCw className="w-8 h-8 text-emerald-300 animate-spin" />
                  <span className="text-sm font-bold">
                    {scanStatusText || "Reading doctor's prescription text lines..."}
                  </span>
                  <span className="text-xs text-emerald-200 font-mono">
                    Validating medical markers & dosage frequencies...
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-slate-400 hover:text-emerald-500 cursor-pointer underline font-medium"
            >
              Upload another prescription photo
            </button>

            <button
              type="button"
              onClick={onTriggerScan}
              disabled={isScanning}
              className="px-4 py-2 rounded-xl bg-[#0f3e3a] hover:bg-[#134e4a] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              {isScanning ? "Reading..." : "Re-Scan Image"}
            </button>
          </div>
        </div>
      )}

      {/* Decoded Category Badge */}
      {decodedCategory && totalDetectedMeds > 0 && !errorMessage && (
        <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Prescription Document Status:</span>
              <span className="text-[#0f3e3a] font-bold text-xs sm:text-sm">
                {decodedCategory} ({totalDetectedMeds} Formulations Extracted)
              </span>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-emerald-800 bg-white border border-emerald-200 px-2.5 py-1 rounded-xl hidden sm:inline shadow-xs">
            {doctorSpecialty || "General Medicine"}
          </span>
        </div>
      )}

    </div>
  );
}
