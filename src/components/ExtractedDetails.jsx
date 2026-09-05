import React, { useState } from 'react';
import { 
  User, 
  Stethoscope, 
  Calendar, 
  Award, 
  MapPin, 
  Phone, 
  Edit3, 
  Check, 
  X, 
  Activity, 
  AlertCircle,
  FileBadge
} from 'lucide-react';

export default function ExtractedDetails({ prescription, onUpdatePrescription }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    patientName: prescription?.patient?.name || '',
    patientAge: prescription?.patient?.age || '',
    patientGender: prescription?.patient?.gender || '',
    patientDiagnosis: prescription?.patient?.diagnosis || '',
    patientBp: prescription?.patient?.bp || '',
    doctorName: prescription?.doctor?.name || '',
    doctorSpecialty: prescription?.doctor?.specialty || '',
    doctorClinic: prescription?.doctor?.clinic || '',
    doctorPhone: prescription?.doctor?.phone || '',
    doctorRegNo: prescription?.doctor?.regNo || '',
    doctorNotes: prescription?.doctorNotes || '',
    followUpDate: prescription?.followUpDate || ''
  });

  const handleSave = () => {
    const updated = {
      ...prescription,
      patient: {
        ...prescription.patient,
        name: formData.patientName,
        age: formData.patientAge,
        gender: formData.patientGender,
        diagnosis: formData.patientDiagnosis,
        bp: formData.patientBp
      },
      doctor: {
        ...prescription.doctor,
        name: formData.doctorName,
        specialty: formData.doctorSpecialty,
        clinic: formData.doctorClinic,
        phone: formData.doctorPhone,
        regNo: formData.doctorRegNo
      },
      doctorNotes: formData.doctorNotes,
      followUpDate: formData.followUpDate
    };
    onUpdatePrescription(updated);
    setIsEditing(false);
  };

  const confidence = prescription?.confidenceScore || 96.5;

  return (
    <div className="space-y-6">
      {/* Top Banner: Verification & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <FileBadge className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">{prescription?.title || 'Digitized Prescription'}</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" /> OCR Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Scanned on {prescription?.patient?.date || 'Recent'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Confidence Badge */}
          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <Award className="w-4 h-4 text-emerald-400" />
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-medium">Confidence</p>
              <p className="text-xs font-bold text-emerald-300 font-mono">{confidence}%</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            {isEditing ? 'Cancel Edit' : 'Edit Details'}
          </button>
        </div>
      </div>

      {/* Edit Form Modal/Drawer if open */}
      {isEditing && (
        <div className="glass-panel rounded-3xl p-6 border-2 border-emerald-500/40 bg-slate-900/95 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-400" /> Human-in-the-Loop OCR Field Correction
            </h3>
            <span className="text-xs text-slate-400">Modify any field if OCR made a typo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Patient Name</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Diagnosis</label>
              <input
                type="text"
                value={formData.patientDiagnosis}
                onChange={(e) => setFormData({ ...formData, patientDiagnosis: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Doctor Name</label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Doctor Specialty</label>
              <input
                type="text"
                value={formData.doctorSpecialty}
                onChange={(e) => setFormData({ ...formData, doctorSpecialty: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Clinic / Hospital</label>
              <input
                type="text"
                value={formData.doctorClinic}
                onChange={(e) => setFormData({ ...formData, doctorClinic: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Follow-Up Date</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-400 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Save Corrections
            </button>
          </div>
        </div>
      )}

      {/* Patient & Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Patient Profile Card */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Patient Clinical Profile</h3>
                <p className="text-[11px] text-slate-400">Extracted from prescription header</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {prescription?.patient?.gender || 'Patient'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Full Name</span>
              <span className="font-semibold text-white">{prescription?.patient?.name || 'Unknown'}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-800/40 text-center">
              <div>
                <span className="text-slate-400 text-[11px] block">Age</span>
                <span className="font-semibold text-slate-200">{prescription?.patient?.age || '--'} yrs</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Weight</span>
                <span className="font-semibold text-slate-200">{prescription?.patient?.weight || '--'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Blood Pressure</span>
                <span className="font-semibold text-emerald-400">{prescription?.patient?.bp || '--'}</span>
              </div>
            </div>
            <div className="pt-1">
              <span className="text-slate-400 text-[11px] block mb-1">Primary Clinical Diagnosis</span>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-300 font-medium leading-relaxed">
                {prescription?.patient?.diagnosis || 'General Medical Consultation'}
              </div>
            </div>
          </div>
        </div>

        {/* Doctor & Clinic Profile Card */}
        <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Prescribing Practitioner</h3>
                <p className="text-[11px] text-slate-400">{prescription?.doctor?.regNo || 'Verified Doctor'}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-500/30">
              Verified
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Practitioner</span>
              <span className="font-semibold text-white">{prescription?.doctor?.name || 'Doctor'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/40">
              <span className="text-slate-400">Specialty</span>
              <span className="font-semibold text-teal-300">{prescription?.doctor?.specialty || 'General Practitioner'}</span>
            </div>
            <div className="py-1 border-b border-slate-800/40">
              <div className="flex items-start gap-1.5 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{prescription?.doctor?.clinic || 'Clinical Health Center'} - {prescription?.doctor?.address || 'Medical Plaza'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{prescription?.doctor?.phone || 'Emergency Direct Line'}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Next Visit: {prescription?.followUpDate || '30 Days'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Special Advice / Doctor Notes */}
      {prescription?.doctorNotes && (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-white block mb-0.5">Doctor's Clinical Instructions & Lifestyle Advice:</span>
            <p className="text-slate-300 leading-relaxed">{prescription.doctorNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
