import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  Pill, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  FileText
} from 'lucide-react';

export default function PrescriptionHistory({ 
  savedList = [], 
  onSelectPrescription, 
  onDeletePrescription, 
  onNewUpload 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Cardiovascular', 'Pulmonology / Infectious Disease', 'Endocrinology', 'General Medicine / Uploaded'];

  const filteredList = savedList.filter(item => {
    const matchesSearch = 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patient?.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.medications?.some(m => m.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) || m.genericName?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Prescription Medical Vault</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Archived digital prescriptions, past dosages, and doctor notes safely stored on your device.
          </p>
        </div>

        <button
          onClick={onNewUpload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Scan New Slip
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by medicine, diagnosis, patient name, doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/60 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Records' : cat.split('/')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Archived Prescriptions */}
      {filteredList.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 border border-slate-800">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Prescriptions Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or upload a new prescription.</p>
          </div>
          <button
            onClick={onNewUpload}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300"
          >
            Upload New Prescription
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => {
            return (
              <div
                key={item.id}
                className="glass-panel glass-panel-hover rounded-3xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Category & Confidence Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-300 border border-emerald-500/20">
                      {item.category?.split('/')[0]}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {item.confidenceScore}% OCR
                    </span>
                  </div>

                  {/* Title & Diagnosis */}
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-emerald-400/90 font-medium mt-0.5">
                      {item.patient?.diagnosis || 'Clinical Diagnosis'}
                    </p>
                  </div>

                  {/* Metadata preview */}
                  <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.patient?.name} ({item.patient?.age} yrs)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Date: {item.patient?.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Pill className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.medications?.length || 0} Prescribed Medicines</span>
                    </div>
                  </div>

                  {/* Medication pills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(item.medications || []).slice(0, 3).map((m, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {m.brandName}
                      </span>
                    ))}
                    {(item.medications || []).length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                        +{(item.medications || []).length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectPrescription(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View & Manage
                  </button>

                  <button
                    onClick={() => onDeletePrescription(item.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800/60 transition-colors"
                    title="Delete Prescription"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
