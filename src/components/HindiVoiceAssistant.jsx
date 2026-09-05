import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, FastForward, Globe2, FileText, CheckCircle2 } from 'lucide-react';
import { generateHindiMedicineInstruction, generateFullScheduleHindiAudioTranscript } from '../utils/hindiVoiceService';

export function HindiVoiceAssistant({ 
  medicines = [], 
  doctorName, 
  userProfile, 
  selectedLang,
  isDarkMode = false
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [activeLang, setActiveLang] = useState(selectedLang || 'hi');
  const [selectedMedIndex, setSelectedMedIndex] = useState(-1); // -1 = Full schedule

  const userName = userProfile?.name || "Dev";

  // Web Speech Synthesis
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getAudioText = () => {
    if (activeLang === 'hi') {
      if (selectedMedIndex >= 0 && medicines[selectedMedIndex]) {
        return `नमस्ते ${userName} जी, ` + generateHindiMedicineInstruction(medicines[selectedMedIndex]);
      }
      return generateFullScheduleHindiAudioTranscript(medicines, userName);
    } else {
      if (selectedMedIndex >= 0 && medicines[selectedMedIndex]) {
        const med = medicines[selectedMedIndex];
        return `Hello ${userName}, for ${med.name?.value || med.brandName}: take ${med.dose?.value || med.strength?.value || 'standard dose'} ${med.frequency?.value || med.frequency}, ${med.foodRelation?.value || med.foodRelation}. Duration is ${med.duration?.value || med.duration}.`;
      }
      return `Hello ${userName}, here is your doctor-verified medication schedule. ` + medicines.map((m, i) => `Medicine ${i+1}: Take ${m.name?.value || m.brandName}, ${m.frequency?.value || m.frequency}, ${m.foodRelation?.value || m.foodRelation}.`).join(' ') + ` Verified by ${doctorName || 'Doctor'}.`;
    }
  };

  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert("Browser speech synthesis not supported on this device.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const text = getAudioText();
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = playbackSpeed;
    utterance.lang = activeLang === 'hi' ? 'hi-IN' : 'en-IN';

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const cardBg = isDarkMode ? "bg-[#0f2c27] border-[#18443e] text-white" : "bg-white border-[#e8e6df] text-[#1c2726]";
  const subCardBg = isDarkMode ? "bg-[#143b35] border-[#1b4841]" : "bg-[#faf9f5] border-[#e8e6df]";

  return (
    <div className={`${cardBg} rounded-3xl border p-6 sm:p-8 space-y-5 shadow-xs transition-colors`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f0e9]/50">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accessible Voice Assistant (Audio Guide)</span>
          </div>
          <h3 className="text-xl font-bold font-heading">
            Listen to Doctor-Approved Schedule
          </h3>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Clear dosage, timing, and dietary rules spoken aloud in simple Hindi or English
          </p>
        </div>

        {/* Language & Speed Selector */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className={`${subCardBg} border rounded-xl px-2.5 py-1 flex items-center text-xs`}>
            <Globe2 className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={activeLang}
              onChange={(e) => { setActiveLang(e.target.value); if (isPlaying) window.speechSynthesis.cancel(); setIsPlaying(false); }}
              className="bg-transparent font-bold text-emerald-600 focus:outline-none cursor-pointer"
            >
              <option value="hi" className="text-slate-800">हिन्दी (Hindi)</option>
              <option value="en" className="text-slate-800">English</option>
            </select>
          </div>

          <div className={`${subCardBg} border rounded-xl px-2 py-1 flex items-center space-x-1 text-xs font-mono`}>
            {[0.75, 1.0, 1.25].map(spd => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${playbackSpeed === spd ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-700'}`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Play Audio Player Bar */}
      <div className={`${subCardBg} border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4`}>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handleTogglePlay}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0 ${
              isPlaying 
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' 
                : 'bg-[#0f3e3a] hover:bg-[#134e4a] text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <div>
            <div className="text-xs font-bold">
              {isPlaying ? "Speaking Prescription Routine..." : "Audio Guide Ready"}
            </div>
            <div className="text-[11px] text-slate-500">
              {activeLang === 'hi' ? `नमस्ते ${userName} जी (Hindi Audio Guide)` : `Hello ${userName} (English Voice Assistant)`}
            </div>
          </div>
        </div>

        {/* Medicine Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => { setSelectedMedIndex(-1); if (isPlaying) window.speechSynthesis.cancel(); setIsPlaying(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              selectedMedIndex === -1 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : `${cardBg} border text-slate-400 hover:text-slate-800`
            }`}
          >
            All Medicines
          </button>

          {medicines.map((med, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedMedIndex(idx); if (isPlaying) window.speechSynthesis.cancel(); setIsPlaying(false); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 truncate max-w-[140px] ${
                selectedMedIndex === idx 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : `${cardBg} border text-slate-400 hover:text-slate-800`
              }`}
            >
              {med.brandName?.split(' ')[0] || `Rx ${idx+1}`}
            </button>
          ))}
        </div>
      </div>

      {/* Live Audio Transcript Box */}
      <div className={`${subCardBg} p-4 rounded-2xl border space-y-1.5`}>
        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
          <FileText className="w-3 h-3" />
          <span>Live Speech Transcript:</span>
        </div>
        <p className="text-xs leading-relaxed font-medium">
          "{getAudioText()}"
        </p>
      </div>

    </div>
  );
}
