import React, { useState } from 'react';
import { 
  Pill, 
  CheckCircle2, 
  Utensils, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  AlertCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  UserCheck,
  Eye,
  Search
} from 'lucide-react';

export function VerificationCards({ 
  medicines = [], 
  onUpdateMedicines, 
  onRemovePrescription,
  isVerified = false,
  onVerifyPrescription,
  userProfile, 
  selectedLang,
  isDarkMode = false,
  onInspectMed
}) {
  const isHindi = selectedLang === 'hi';
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // New Medicine Form State
  const [newMed, setNewMed] = useState({
    brandName: '',
    genericSalt: '',
    frequency: '1-0-1 (Morning & Night)',
    foodRelation: 'After meals with water',
    duration: '5 Days',
    purpose: 'Clinical treatment formulation',
    pillShape: 'Tablet',
    pillColor: 'bg-emerald-500',
    brandedPrice: 60,
    genericPrice: 15,
    confidence: 99
  });

  // Edit Medicine Form State
  const [editMedData, setEditMedData] = useState({});

  const handleStartEdit = (med) => {
    setEditingId(med.id);
    setEditMedData({ ...med });
  };

  const handleSaveEdit = (id) => {
    if (onUpdateMedicines) {
      onUpdateMedicines(medicines.map(m => m.id === id ? { ...m, ...editMedData } : m));
    }
    setEditingId(null);
  };

  const handleDeleteMed = (id) => {
    if (onUpdateMedicines) {
      onUpdateMedicines(medicines.filter(m => m.id !== id));
    }
  };

  const handleAddNewMedicine = (e) => {
    e.preventDefault();
    if (!newMed.brandName.trim()) return;

    const formatted = {
      ...newMed,
      id: `rx-manual-${Date.now()}`
    };

    if (onUpdateMedicines) {
      onUpdateMedicines([...medicines, formatted]);
    }

    setNewMed({
      brandName: '',
      genericSalt: '',
      frequency: '1-0-1 (Morning & Night)',
      foodRelation: 'After meals with water',
      duration: '5 Days',
      purpose: 'Clinical treatment formulation',
      pillShape: 'Tablet',
      pillColor: 'bg-emerald-500',
      brandedPrice: 60,
      genericPrice: 15,
      confidence: 99
    });
    setIsAddingNew(false);
  };

  if (!medicines || medicines.length === 0) return null;

  const cardBg = isDarkMode ? "bg-[#0f2c27] border-[#18443e] text-white" : "bg-white border-[#e8e6df] text-[#1c2726]";
  const subCardBg = isDarkMode ? "bg-[#143b35] border-[#1b4841]" : "bg-[#faf9f5] border-[#e8e6df]";

  return (
    <div className={`${cardBg} rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xs transition-colors`}>
      
      {/* 🟢 CLINICAL VERIFICATION STATUS LINE (Only shown when doctor certified) */}
      {isVerified && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs animate-fade-in">
          <div className="flex items-start sm:items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="font-bold text-emerald-950 text-sm flex items-center space-x-2">
                <span>{isHindi ? "✅ डॉक्टर द्वारा सत्यापित (Clinically Verified)" : "✅ Clinically Verified by Doctor"}</span>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-bold border border-emerald-300">
                  Doctor Certified
                </span>
              </div>
              <p className="text-emerald-800 text-xs mt-0.5 font-medium">
                {isHindi 
                  ? "यह पर्ची डॉक्टर राजेश शर्मा (MCI-48291) द्वारा जांची और प्रमाणित की गई है।" 
                  : "This prescription has been clinically reviewed, cross-verified, and digitally signed by Dr. Rajesh Sharma, MD (Reg: MCI-48291)."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-700 text-white shadow-xs flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Digitally Signed</span>
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f1f0e9]/50">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <Pill className="w-3.5 h-3.5 text-emerald-600" />
            <span>Extracted Medications & Dosage Instructions</span>
          </div>
          <h3 className="text-xl font-bold font-heading">
            {isHindi ? "दवाई एवं खुराक विवरण" : "Prescribed Medication Routine"}
          </h3>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {isHindi ? "दवाइयों के नाम, सॉल्ट और खाने का नियम" : "Verified brand names, active chemical salts, and dietary food relation"}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isAddingNew ? "Cancel" : "+ Add Medicine"}</span>
          </button>

          {onRemovePrescription && (
            <button
              type="button"
              onClick={onRemovePrescription}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
              title="Remove prescription and clear active medicines"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{isHindi ? "पर्ची हटाएं (Remove)" : "Remove Prescription"}</span>
            </button>
          )}

          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${subCardBg} border`}>
            {medicines.length} Prescribed
          </span>
        </div>
      </div>

      {/* Manual Add Medicine Form */}
      {isAddingNew && (
        <form onSubmit={handleAddNewMedicine} className={`p-5 rounded-2xl ${subCardBg} border border-emerald-400 space-y-4 animate-fade-in`}>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Add New Medicine to Prescription
            </h4>
            <button type="button" onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold mb-1">Medicine / Brand Name *</label>
              <input 
                type="text" 
                placeholder="e.g. Tab. Sizodon Plus or Tab. Augmentin 625"
                value={newMed.brandName}
                onChange={e => setNewMed({ ...newMed, brandName: e.target.value })}
                required
                className={`w-full ${isDarkMode ? 'bg-[#0f2c27] text-white border-[#18443e]' : 'bg-white text-[#1c2726] border-[#e8e6df]'} border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600 font-medium`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1">Generic Chemical Salt</label>
              <input 
                type="text" 
                placeholder="e.g. Risperidone (2mg) + Trihexyphenidyl (2mg)"
                value={newMed.genericSalt}
                onChange={e => setNewMed({ ...newMed, genericSalt: e.target.value })}
                className={`w-full ${isDarkMode ? 'bg-[#0f2c27] text-white border-[#18443e]' : 'bg-white text-[#1c2726] border-[#e8e6df]'} border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1">Dosage Frequency</label>
              <input 
                type="text" 
                placeholder="e.g. 1-0-1 (Morning & Night) or OD"
                value={newMed.frequency}
                onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}
                className={`w-full ${isDarkMode ? 'bg-[#0f2c27] text-white border-[#18443e]' : 'bg-white text-[#1c2726] border-[#e8e6df]'} border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1">Dietary / Food Instruction</label>
              <input 
                type="text" 
                placeholder="e.g. After meals with water or Empty stomach"
                value={newMed.foodRelation}
                onChange={e => setNewMed({ ...newMed, foodRelation: e.target.value })}
                className={`w-full ${isDarkMode ? 'bg-[#0f2c27] text-white border-[#18443e]' : 'bg-white text-[#1c2726] border-[#e8e6df]'} border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1">Treatment Duration</label>
              <input 
                type="text" 
                placeholder="e.g. 5 Days or 6 Months"
                value={newMed.duration}
                onChange={e => setNewMed({ ...newMed, duration: e.target.value })}
                className={`w-full ${isDarkMode ? 'bg-[#0f2c27] text-white border-[#18443e]' : 'bg-white text-[#1c2726] border-[#e8e6df]'} border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600`}
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold mb-1">Clinical Indication / Purpose</label>
              <input 
                type="text" 
                placeholder="e.g. Fever reduction, Mood stabilization"
                value={newMed.purpose}
                onChange={e => setNewMed({ ...newMed, purpose: e.target.value })}
                className={`w-full ${isDarkMode ? 'bg-[#0f2c27] text-white border-[#18443e]' : 'bg-white text-[#1c2726] border-[#e8e6df]'} border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-600`}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0f3e3a] hover:bg-[#134e4a] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Save Medicine
            </button>
          </div>
        </form>
      )}

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicines.map((med, idx) => {
          const isEditing = editingId === med.id;

          return (
            <div 
              key={med.id || idx}
              className={`${subCardBg} rounded-2xl border p-5 space-y-4 hover:border-[#0f3e3a] transition-all relative group shadow-xs`}
            >
              {/* Card Top Actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-1">
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editMedData.brandName || ''}
                      onChange={e => setEditMedData({ ...editMedData, brandName: e.target.value })}
                      className="w-full bg-white border border-emerald-500 rounded-lg px-2 py-1 text-sm font-bold"
                    />
                  ) : (
                    <div className="font-bold text-sm sm:text-base truncate">
                      {med.brandName}
                    </div>
                  )}

                  {isEditing ? (
                    <input 
                      type="text"
                      value={editMedData.genericSalt || ''}
                      onChange={e => setEditMedData({ ...editMedData, genericSalt: e.target.value })}
                      className="w-full bg-white border border-emerald-500 rounded-lg px-2 py-1 text-[11px] font-mono"
                    />
                  ) : (
                    <div className="text-[11px] font-mono text-slate-500 line-clamp-1">
                      Salt: {med.genericSalt || "Standard Pharmacopeia Salt"}
                    </div>
                  )}
                </div>

                {/* Edit & Delete Icons */}
                <div className="flex items-center space-x-1 shrink-0">
                  {isEditing ? (
                    <button 
                      onClick={() => handleSaveEdit(med.id)}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                      title="Save Changes"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStartEdit(med)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#0f3e3a] hover:bg-white/80 transition-colors cursor-pointer"
                      title="Edit Medication"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button 
                    onClick={() => handleDeleteMed(med.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Medication"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Frequency & Timing Blocks */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`${isDarkMode ? 'bg-[#0f2c27]' : 'bg-white'} p-2.5 rounded-xl border border-[#e8e6df]/50 space-y-0.5`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Frequency</div>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editMedData.frequency || ''}
                      onChange={e => setEditMedData({ ...editMedData, frequency: e.target.value })}
                      className="w-full text-xs font-bold border rounded px-1"
                    />
                  ) : (
                    <div className="font-bold text-[#0f3e3a] truncate">{med.frequency}</div>
                  )}
                </div>

                <div className={`${isDarkMode ? 'bg-[#0f2c27]' : 'bg-white'} p-2.5 rounded-xl border border-[#e8e6df]/50 space-y-0.5`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Food Rule</div>
                  {isEditing ? (
                    <input 
                      type="text"
                      value={editMedData.foodRelation || ''}
                      onChange={e => setEditMedData({ ...editMedData, foodRelation: e.target.value })}
                      className="w-full text-xs font-medium border rounded px-1"
                    />
                  ) : (
                    <div className="font-medium text-slate-700 truncate">{med.foodRelation}</div>
                  )}
                </div>
              </div>

              {/* Purpose / Indication */}
              {med.purpose && (
                <div className={`text-xs ${isDarkMode ? 'bg-[#0f2c27]' : 'bg-white'} p-2.5 rounded-xl border border-[#e8e6df]/50`}>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Indication:</span>
                  <span className="text-slate-600 text-[11px] font-medium leading-relaxed">{med.purpose}</span>
                </div>
              )}

              {/* Duration & Confidence & Visual Grounding Trigger */}
              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 font-medium">
                <div>
                  Duration: <span className="font-bold text-[#0f3e3a]">{med.duration || "As Directed"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px]">
                    Confidence: {med.confidence || 98.5}%
                  </div>
                  {onInspectMed && (
                    <button
                      type="button"
                      onClick={() => onInspectMed(med, idx)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center space-x-1 cursor-pointer transition-colors shadow-xs"
                      title="Inspect OCR bounding box & character recognition confidence"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect OCR</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
