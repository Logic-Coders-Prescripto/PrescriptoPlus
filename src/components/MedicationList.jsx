import React, { useState } from 'react';
import { 
  Pill, 
  Clock, 
  Calendar, 
  Utensils, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  Sparkles,
  TrendingDown,
  Info,
  Layers
} from 'lucide-react';

export default function MedicationList({ medications = [], onUpdateMedications }) {
  const [editingMed, setEditingMed] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formState, setFormState] = useState({
    brandName: '',
    genericName: '',
    strength: '',
    form: 'Tablet',
    frequency: 'Once daily',
    timing: 'Morning',
    morning: true,
    afternoon: false,
    evening: false,
    night: false,
    beforeFood: false,
    duration: '30 Days',
    refills: 1,
    instructions: '',
    foodInteractions: '',
    avgPriceBrand: 15,
    avgPriceGeneric: 4
  });

  const handleEditClick = (med) => {
    setEditingMed(med);
    setFormState({
      brandName: med.brandName,
      genericName: med.genericName,
      strength: med.strength,
      form: med.form || 'Tablet',
      frequency: med.frequency,
      timing: med.timing,
      morning: !!med.schedule?.morning,
      afternoon: !!med.schedule?.afternoon,
      evening: !!med.schedule?.evening,
      night: !!med.schedule?.night,
      beforeFood: !!med.beforeFood,
      duration: med.duration,
      refills: med.refills ?? 1,
      instructions: med.instructions,
      foodInteractions: med.foodInteractions || '',
      avgPriceBrand: med.avgPriceBrand || 15,
      avgPriceGeneric: med.avgPriceGeneric || 4
    });
  };

  const handleSaveForm = () => {
    const newMed = {
      id: editingMed ? editingMed.id : 'med-custom-' + Date.now(),
      brandName: formState.brandName || 'Untitled Medicine',
      genericName: formState.genericName || formState.brandName,
      strength: formState.strength || 'Standard Dose',
      form: formState.form,
      frequency: formState.frequency,
      timing: formState.timing,
      schedule: {
        morning: formState.morning,
        afternoon: formState.afternoon,
        evening: formState.evening,
        night: formState.night
      },
      beforeFood: formState.beforeFood,
      duration: formState.duration,
      refills: Number(formState.refills),
      instructions: formState.instructions || 'Take as directed by your physician.',
      foodInteractions: formState.foodInteractions,
      avgPriceBrand: Number(formState.avgPriceBrand),
      avgPriceGeneric: Number(formState.avgPriceGeneric),
      confidence: 99
    };

    if (editingMed) {
      const updated = medications.map(m => m.id === editingMed.id ? newMed : m);
      onUpdateMedications(updated);
    } else {
      onUpdateMedications([...medications, newMed]);
    }

    setEditingMed(null);
    setIsAdding(false);
  };

  const handleDeleteMed = (id) => {
    const updated = medications.filter(m => m.id !== id);
    onUpdateMedications(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-400" />
            Extracted Medication Regimen ({medications.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified chemical active ingredients, daily schedule slots, and generic cost savings.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAdding(true);
            setEditingMed(null);
            setFormState({
              brandName: '',
              genericName: '',
              strength: '500 mg',
              form: 'Tablet',
              frequency: 'Twice daily',
              timing: 'Morning & Night',
              morning: true,
              afternoon: false,
              evening: false,
              night: true,
              beforeFood: false,
              duration: '14 Days',
              refills: 1,
              instructions: 'Take with full glass of water.',
              foodInteractions: '',
              avgPriceBrand: 20,
              avgPriceGeneric: 5
            });
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-emerald-400" /> Add Medicine
        </button>
      </div>

      {/* Medication Modal / Drawer Form */}
      {(editingMed || isAdding) && (
        <div className="glass-panel rounded-3xl p-6 border-2 border-emerald-500/40 bg-slate-900/95 space-y-4 animate-fadeIn shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Pill className="w-4 h-4 text-emerald-400" />
              {editingMed ? 'Edit Medication Details' : 'Add New Prescription Item'}
            </h3>
            <span className="text-xs text-slate-400">Update dosage timings or pricing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Brand Name / Label</label>
              <input
                type="text"
                value={formState.brandName}
                placeholder="e.g. Lipitor"
                onChange={(e) => setFormState({ ...formState, brandName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Generic / Molecule</label>
              <input
                type="text"
                value={formState.genericName}
                placeholder="e.g. Atorvastatin"
                onChange={(e) => setFormState({ ...formState, genericName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Strength (Dosage)</label>
              <input
                type="text"
                value={formState.strength}
                placeholder="e.g. 20 mg / 500 mg"
                onChange={(e) => setFormState({ ...formState, strength: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Form</label>
              <select
                value={formState.form}
                onChange={(e) => setFormState({ ...formState, form: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup (Liquid)</option>
                <option value="Injection">Injection</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Drops">Drops</option>
                <option value="Ointment">Ointment / Gel</option>
              </select>
            </div>
          </div>

          {/* Time of day checkboxes */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-300 block">Daily Schedule Time Slots:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={formState.morning}
                  onChange={(e) => setFormState({ ...formState, morning: e.target.checked })}
                  className="accent-emerald-500 rounded"
                />
                <span>🌅 Morning (8 AM)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={formState.afternoon}
                  onChange={(e) => setFormState({ ...formState, afternoon: e.target.checked })}
                  className="accent-emerald-500 rounded"
                />
                <span>☀️ Afternoon (1 PM)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={formState.evening}
                  onChange={(e) => setFormState({ ...formState, evening: e.target.checked })}
                  className="accent-emerald-500 rounded"
                />
                <span>🌇 Evening (6 PM)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={formState.night}
                  onChange={(e) => setFormState({ ...formState, night: e.target.checked })}
                  className="accent-emerald-500 rounded"
                />
                <span>🌙 Night (10 PM)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Meal Relationship</label>
              <select
                value={formState.beforeFood ? 'before' : 'after'}
                onChange={(e) => setFormState({ ...formState, beforeFood: e.target.value === 'before' })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              >
                <option value="after">🍽️ After Food (Recommended)</option>
                <option value="before">🥣 Before Food (Empty Stomach)</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Duration</label>
              <input
                type="text"
                value={formState.duration}
                placeholder="e.g. 30 Days"
                onChange={(e) => setFormState({ ...formState, duration: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Refills Authorized</label>
              <input
                type="number"
                min="0"
                max="12"
                value={formState.refills}
                onChange={(e) => setFormState({ ...formState, refills: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Doctor's Specific Instructions</label>
              <input
                type="text"
                value={formState.instructions}
                placeholder="e.g. Take with warm water. Complete full course."
                onChange={(e) => setFormState({ ...formState, instructions: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Food / Dietary Interactions</label>
              <input
                type="text"
                value={formState.foodInteractions}
                placeholder="e.g. Avoid dairy or grapefruit within 2 hours."
                onChange={(e) => setFormState({ ...formState, foodInteractions: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setEditingMed(null);
                setIsAdding(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveForm}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> {editingMed ? 'Save Medication' : 'Add to Prescription'}
            </button>
          </div>
        </div>
      )}

      {/* Medication Cards List */}
      <div className="space-y-4">
        {medications.map((med, index) => {
          const savings = med.avgPriceBrand && med.avgPriceGeneric
            ? Math.round(((med.avgPriceBrand - med.avgPriceGeneric) / med.avgPriceBrand) * 100)
            : 65;

          return (
            <div
              key={med.id || index}
              className="glass-panel glass-panel-hover rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4 relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-md shadow-emerald-950/50">
                    <Pill className="w-5 h-5 text-emerald-400" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white">{med.brandName}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
                        {med.strength}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {med.form}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <span className="text-slate-500">Generic Formula:</span>
                      <span className="text-slate-300 font-medium">{med.genericName}</span>
                    </p>
                  </div>
                </div>

                {/* Edit / Delete Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleEditClick(med)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    title="Edit Medication"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMed(med.id)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800/60 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Timing Slots Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${
                  med.schedule?.morning
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}>
                  <span className="text-base">🌅</span>
                  <div>
                    <span className="font-bold block">Morning</span>
                    <span className="text-[10px]">{med.schedule?.morning ? '1 Dose (8 AM)' : 'Skip'}</span>
                  </div>
                </div>

                <div className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${
                  med.schedule?.afternoon
                    ? 'bg-orange-950/30 border-orange-500/40 text-orange-200'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}>
                  <span className="text-base">☀️</span>
                  <div>
                    <span className="font-bold block">Afternoon</span>
                    <span className="text-[10px]">{med.schedule?.afternoon ? '1 Dose (1 PM)' : 'Skip'}</span>
                  </div>
                </div>

                <div className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${
                  med.schedule?.evening
                    ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}>
                  <span className="text-base">🌇</span>
                  <div>
                    <span className="font-bold block">Evening</span>
                    <span className="text-[10px]">{med.schedule?.evening ? '1 Dose (6 PM)' : 'Skip'}</span>
                  </div>
                </div>

                <div className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${
                  med.schedule?.night
                    ? 'bg-purple-950/30 border-purple-500/40 text-purple-200'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
                }`}>
                  <span className="text-base">🌙</span>
                  <div>
                    <span className="font-bold block">Night</span>
                    <span className="text-[10px]">{med.schedule?.night ? '1 Dose (10 PM)' : 'Skip'}</span>
                  </div>
                </div>
              </div>

              {/* Instructions & Food Warning Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs pt-1">
                <div className="md:col-span-8 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold">
                    <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instructions:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      med.beforeFood ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                    }`}>
                      {med.beforeFood ? 'Before Food (Empty Stomach)' : 'After Meals'}
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed pl-5">{med.instructions}</p>
                  
                  {med.foodInteractions && (
                    <div className="flex items-start gap-2 pt-1 text-amber-300/90 pl-5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                      <span>{med.foodInteractions}</span>
                    </div>
                  )}
                </div>

                {/* Duration & Refills */}
                <div className="md:col-span-4 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" /> Duration
                    </span>
                    <span className="font-semibold text-white">{med.duration}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-slate-400">Refills Left</span>
                    <span className="font-semibold text-emerald-400">{med.refills} refills</span>
                  </div>

                  {/* Generic Savings Pill */}
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-emerald-400" /> Generic Swap
                    </span>
                    <span className="text-emerald-300 font-bold">Save ~{savings}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
