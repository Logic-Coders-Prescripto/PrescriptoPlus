import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Stethoscope, 
  ShieldCheck, 
  User, 
  Calendar, 
  Upload, 
  FileCheck2, 
  Bell, 
  LogOut, 
  Globe, 
  Building2, 
  MapPin, 
  Sparkles, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Shield, 
  Layers, 
  FileText,
  Activity,
  Sun,
  Moon,
  Pill,
  Inbox
} from 'lucide-react';
import { PrescriptionUploadPage } from './components/PrescriptionUploadPage';
import { PrescriptionScanner } from './components/PrescriptionScanner';
import { VerificationCards } from './components/VerificationCards';
import { PriceComparisonSection } from './components/PriceComparisonSection';
import { SafetyMatrix } from './components/SafetyMatrix';
import { HindiVoiceAssistant } from './components/HindiVoiceAssistant';
import { DoctorBrowser } from './components/DoctorBrowser';
import { MyAppointments } from './components/MyAppointments';
import { MedicineReminders } from './components/MedicineReminders';
import { DoctorVerificationRequests } from './components/DoctorVerificationRequests';
import { JanAushadhiLocatorModal } from './components/JanAushadhiLocatorModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { LegalModal } from './components/LegalModal';
import { FinalLoginPage } from './components/FinalLoginPage';
import { parsePrescriptionImage } from './utils/prescriptionParser';

export function App() {
  // Global Theme State: Light / Dark Mode (Applied Everywhere)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "Dev Soni",
    age: 20,
    gender: "Male",
    phone: "9876543210",
    role: "patient",
    healthId: "ABHA-9102-4821",
    email: "devsoni@care.com"
  });

  // Navigation Portals: 'patient' | 'doctor'
  const [currentPortal, setCurrentPortal] = useState('patient');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLang, setSelectedLang] = useState('en');

  // Modals
  const [isLocatorOpen, setIsLocatorOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Prescriptions State (Starts completely clean with 0 lingering medicines)
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatusText, setScanStatusText] = useState('');
  const [scanErrorMessage, setScanErrorMessage] = useState('');
  const [currentMedicines, setCurrentMedicines] = useState([]);
  const [currentSafetyAlerts, setCurrentSafetyAlerts] = useState([]);
  const [overallConfidence, setOverallConfidence] = useState(98);
  const [decodedCategory, setDecodedCategory] = useState('');
  const [doctorSpecialty, setDoctorSpecialty] = useState('');

  // Daily Tasks State (Synchronized dynamically with active uploaded prescription)
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!currentMedicines || currentMedicines.length === 0) {
      setTasks([]);
      return;
    }

    const dynamicTasks = [];
    let taskId = 1;

    currentMedicines.forEach((med) => {
      const name = med.brandName || 'Medicine';
      const freq = (med.frequency?.value || med.frequency || '').toLowerCase();
      const sched = med.schedule || [];

      if (sched.includes('morning') || freq.includes('morning') || freq.includes('1-0-1') || freq.includes('1-0-0') || freq.includes('bd') || freq.includes('od')) {
        dynamicTasks.push({
          id: taskId++,
          text: `Morning: ${name}`,
          time: "08:00 AM",
          completed: false
        });
      }

      if (sched.includes('afternoon') || freq.includes('afternoon') || freq.includes('tds') || freq.includes('1-1-1')) {
        dynamicTasks.push({
          id: taskId++,
          text: `Afternoon: ${name}`,
          time: "01:30 PM",
          completed: false
        });
      }

      if (sched.includes('night') || freq.includes('night') || freq.includes('bedtime') || freq.includes('1-0-1') || freq.includes('0-0-1') || freq.includes('bd')) {
        dynamicTasks.push({
          id: taskId++,
          text: `Night: ${name}`,
          time: "09:30 PM",
          completed: false
        });
      }
    });

    if (dynamicTasks.length === 0 && currentMedicines.length > 0) {
      currentMedicines.forEach((med, idx) => {
        dynamicTasks.push({
          id: idx + 1,
          text: `Prescribed Dose: ${med.brandName}`,
          time: "As Directed",
          completed: false
        });
      });
    }

    setTasks(dynamicTasks);
  }, [currentMedicines]);

  // Appointments State
  const [appointments, setAppointments] = useState([
    {
      id: "apt-101",
      patientName: "Dev Soni",
      doctorName: "Dr. Rajesh Sharma",
      specialty: "General Medicine & Pulmonology",
      consultationType: "In-clinic consultation",
      date: "24 AUG",
      time: "10:30 AM",
      room: "Room 204",
      amount: 800,
      status: "Confirmed"
    }
  ]);

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------

  const handleLogin = (credentials) => {
    const userRole = credentials.role || "patient";
    setCurrentUser(prev => ({
      ...prev,
      name: credentials.name || (userRole === 'doctor' ? 'Dr. Rajesh Sharma, MD' : 'Dev Soni'),
      age: credentials.age || (userRole === 'doctor' ? 42 : 20),
      gender: credentials.gender || "Male",
      phone: credentials.phone || "9876543210",
      role: userRole,
      regNo: credentials.regNo || "MCI-48291",
      specialty: credentials.specialty || "Internal Medicine"
    }));

    if (userRole === 'doctor') {
      setCurrentPortal('doctor');
      setActiveTab('doctor-dashboard');
    } else {
      setCurrentPortal('patient');
      setActiveTab('overview');
    }

    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUploadedImage(null);
    setCurrentMedicines([]);
    setScanErrorMessage('');
  };

  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  // Real Image Upload / Camera Snap Handler (Pure OCR Reader with Strict Validation)
  const handleImageUploaded = async (imgData, fileName) => {
    setUploadedImage(imgData);
    setIsScanning(true);
    setScanErrorMessage('');
    setScanStatusText("Reading handwritten doctor lines via Optical OCR...");

    const parsed = await parsePrescriptionImage(imgData, (pct, status) => {
      setScanStatusText(status);
    }, fileName);

    if (parsed.isValid === false || parsed.error) {
      setScanErrorMessage(parsed.error || "The uploaded image is not a valid doctor's prescription. Please upload a clear photo of a medical prescription slip.");
      setCurrentMedicines([]);
      setCurrentSafetyAlerts([]);
      setDecodedCategory('');
      setDoctorSpecialty('');
    } else {
      setScanErrorMessage('');
      setCurrentMedicines(parsed.medicines || []);
      setCurrentSafetyAlerts(parsed.safetyAlerts || []);
      setOverallConfidence(parsed.confidence || 98);
      setDecodedCategory(parsed.category || "Doctor Prescription");
      setDoctorSpecialty(parsed.doctorSpecialty || "General Medicine");
    }

    setIsScanning(false);
  };

  // Clear / Remove Photo -> Immediately Clears All Detected Medications!
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setCurrentMedicines([]);
    setCurrentSafetyAlerts([]);
    setScanErrorMessage('');
    setDecodedCategory('');
    setDoctorSpecialty('');
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const remainingTasks = tasks.length - completedTasks;
  const taskPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // User Initials
  const userInitials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "DS";

  // If not logged in, render secure login screen
  if (!isAuthenticated) {
    return (
      <FinalLoginPage 
        onLogin={handleLogin} 
        onLoginSuccess={handleLogin}
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
      />
    );
  }

  // Dynamic Global Theme Classes
  const themeBg = isDarkMode ? "bg-[#0b1c19] text-[#e2ebe9]" : "bg-[#f6f5ef] text-[#1c2726]";
  const themeHeaderBg = isDarkMode ? "bg-[#091a17]/95 border-[#153a34]" : "bg-white/90 border-[#e8e6df]";
  const themeCardBg = isDarkMode ? "bg-[#0f2c27] border-[#18443e]" : "bg-white border-[#e8e6df]";

  return (
    <div className={`min-h-screen ${themeBg} flex font-sans transition-colors duration-300`}>
      
      {/* ================= LEFT SIDEBAR (Dark Forest Teal) ================= */}
      <aside className="w-64 mediflow-sidebar hidden md:flex flex-col justify-between p-5 border-r border-[#1a403b] shrink-0 sticky top-0 h-screen">
        
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-[#0d2b27] flex items-center justify-center font-extrabold text-sm shadow-sm">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">Prescripto</h1>
                <p className="text-[10px] text-[#8ea7a3]">Clinical workspace</p>
              </div>
            </div>
          </div>

          {/* Role Switcher (ONLY Visible if Doctor logs in. Hidden for Patients for Strict Security) */}
          {currentUser.role === 'doctor' ? (
            <div className="grid grid-cols-2 gap-1 bg-[#09221f] p-1 rounded-xl border border-[#163d37] text-[11px] font-semibold">
              <button
                onClick={() => { setCurrentPortal('doctor'); setActiveTab('doctor-dashboard'); }}
                className={`py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  currentPortal === 'doctor'
                    ? 'bg-white text-[#0d2b27] font-bold shadow-xs'
                    : 'text-[#8ea7a3] hover:text-white'
                }`}
              >
                🩺 Doctor
              </button>

              <button
                onClick={() => { setCurrentPortal('patient'); setActiveTab('overview'); }}
                className={`py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                  currentPortal === 'patient'
                    ? 'bg-white text-[#0d2b27] font-bold shadow-xs'
                    : 'text-[#8ea7a3] hover:text-white'
                }`}
              >
                👤 Patient View
              </button>
            </div>
          ) : (
            <div className="bg-[#09221f] px-3 py-2 rounded-xl border border-[#163d37] text-[11px] font-semibold text-emerald-300 flex items-center space-x-2">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Patient: {currentUser.name}</span>
            </div>
          )}

          {/* Navigation Workspace Menu */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#63847f] px-3 pb-1">
              Workspace
            </div>

            {currentPortal === 'patient' && (
              <>
                {/* 1. Overview */}
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-[#184640] text-white shadow-sm border border-[#235850]'
                      : 'text-[#b2cac6] hover:bg-[#113530] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <HeartPulse className="w-4 h-4 text-emerald-400" />
                    <span>Overview</span>
                  </div>
                </button>

                {/* 2. AI Prescription Scanner */}
                <button
                  onClick={() => setActiveTab('ai-prescription')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'ai-prescription'
                      ? 'bg-[#184640] text-white shadow-sm border border-[#235850]'
                      : 'text-[#b2cac6] hover:bg-[#113530] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span className="font-bold text-white">AI Prescription (OCR)</span>
                  </div>
                  <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                    SCAN
                  </span>
                </button>

                {/* 3. Jan Aushadhi & Savings */}
                <button
                  onClick={() => setActiveTab('price-comparison')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'price-comparison'
                      ? 'bg-[#184640] text-white shadow-sm border border-[#235850]'
                      : 'text-[#b2cac6] hover:bg-[#113530] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>Jan Aushadhi & Savings</span>
                  </div>
                </button>

                {/* 4. Find a Doctor */}
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'doctors'
                      ? 'bg-[#184640] text-white shadow-sm border border-[#235850]'
                      : 'text-[#b2cac6] hover:bg-[#113530] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Stethoscope className="w-4 h-4 text-[#8ea7a3]" />
                    <span>Find a doctor</span>
                  </div>
                </button>

                {/* 5. Appointments */}
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'appointments'
                      ? 'bg-[#184640] text-white shadow-sm border border-[#235850]'
                      : 'text-[#b2cac6] hover:bg-[#113530] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Calendar className="w-4 h-4 text-[#8ea7a3]" />
                    <span>Appointments</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#163d37] text-[#8ea7a3]">
                    {appointments.length}
                  </span>
                </button>

                {/* 6. Reminders */}
                <button
                  onClick={() => setActiveTab('reminders')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'reminders'
                      ? 'bg-[#184640] text-white shadow-sm border border-[#235850]'
                      : 'text-[#b2cac6] hover:bg-[#113530] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Bell className="w-4 h-4 text-[#8ea7a3]" />
                    <span>Dosage Reminders</span>
                  </div>
                  {currentMedicines.length > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-300">
                      {currentMedicines.length}
                    </span>
                  )}
                </button>
              </>
            )}

            {currentPortal === 'doctor' && (
              <>
                <button
                  onClick={() => setActiveTab('doctor-dashboard')}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-[#184640] text-white shadow-sm"
                >
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>Verification Requests</span>
                </button>
              </>
            )}
          </div>

        </div>

        {/* Bottom User Pill */}
        <div className="pt-4 border-t border-[#1a403b] space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center font-bold text-xs">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-[#8ea7a3] truncate">
                {currentUser.role === 'doctor' ? `MCI Reg: ${currentUser.regNo}` : (currentUser.email || "patient@care.com")}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8ea7a3] pt-1">
            <button onClick={() => setIsLegalOpen(true)} className="hover:text-white cursor-pointer">
              Privacy & safety
            </button>
            <button onClick={handleLogout} className="hover:text-rose-300 cursor-pointer">
              Sign out
            </button>
          </div>
        </div>

      </aside>

      {/* ================= MAIN CONTENT WORKSPACE ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Search & Global Status Bar */}
        <header className={`h-16 border-b ${themeHeaderBg} backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-colors`}>
          
          {/* Search Input */}
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients, doctors, or prescriptions..."
              className={`w-full ${isDarkMode ? 'bg-[#0f2c27] text-white border-[#18443e]' : 'bg-[#f6f5ef] text-slate-800 border-[#e8e6df]'} border rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500`}
            />
          </div>

          {/* Right Status Badges & Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Global Dark / Light Mode Switcher (Clean on Right Side) */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center space-x-1.5 text-xs font-semibold ${
                isDarkMode 
                  ? 'bg-[#0f2c27] border-[#18443e] text-amber-300 hover:bg-[#133731]' 
                  : 'bg-[#faf9f5] border-[#e8e6df] text-slate-700 hover:bg-slate-100'
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-emerald-700" />}
              <span className="hidden sm:inline">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>

            {/* Protected Status Pill */}
            <span className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected</span>
            </span>

            {/* Notification Bell */}
            <button 
              onClick={() => setActiveTab('reminders')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {currentMedicines.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1.5 right-1.5" />
              )}
            </button>

            {/* User Avatar Circle */}
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0f3e3a] border border-emerald-200 flex items-center justify-center font-bold text-xs">
              {userInitials}
            </div>

          </div>

        </header>

        {/* Dynamic Workspace Views */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          
          {/* ================= VIEW 1: OVERVIEW DASHBOARD ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Header Title Section */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-700">
                    {currentUser.role === 'doctor' ? "PHYSICIAN DASHBOARD" : "PATIENT PORTAL"}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-normal font-serif-heading tracking-tight">
                    Good morning, {currentUser.name}
                  </h1>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Here's what's happening with your care today.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('doctors')}
                  className="px-5 py-2.5 rounded-xl bg-[#0f3e3a] hover:bg-[#134e4a] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center space-x-1.5 hover:shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book appointment</span>
                </button>
              </div>

              {/* Top Row: Next Appointment & Today's Care Plan */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* CARD 1: NEXT APPOINTMENT (7 cols) */}
                <div className={`${themeCardBg} lg:col-span-7 rounded-3xl p-6 space-y-5 shadow-xs transition-colors`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700">
                      NEXT APPOINTMENT
                    </span>
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Confirmed</span>
                    </span>
                  </div>

                  <div className="flex items-start space-x-4">
                    {/* Calendar Date Block [ 24 AUG ] */}
                    <div className="w-14 h-16 rounded-2xl bg-[#0f3e3a] text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                      <span className="text-lg font-extrabold leading-none">24</span>
                      <span className="text-[10px] font-bold tracking-wider text-emerald-300 uppercase mt-0.5">AUG</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-bold">
                        Dr. Rajesh Sharma
                      </h3>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        General Medicine & Pulmonology • In-clinic consultation
                      </p>
                      <div className={`flex items-center space-x-3 text-xs pt-1 font-mono ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>10:30 AM</span>
                        </span>
                        <span>Room 204</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-2">
                    <button 
                      onClick={() => setActiveTab('appointments')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${isDarkMode ? 'bg-[#143b35] text-white border-[#1b4841]' : 'bg-[#f6f5ef] text-slate-800 border-[#e8e6df]'}`}
                    >
                      View details
                    </button>
                    <button 
                      onClick={() => alert("Appointment cancellation requested.")}
                      className="text-xs text-slate-400 hover:text-rose-500 cursor-pointer font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* CARD 2: TODAY'S CARE PLAN (5 cols - Synchronized with Prescription) */}
                <div className={`${themeCardBg} lg:col-span-5 rounded-3xl p-6 space-y-4 shadow-xs flex flex-col justify-between transition-colors`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700">
                        CARE PLAN ROUTINE
                      </span>
                      {tasks.length > 0 && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {completedTasks} / {tasks.length} Done ({taskPercent}%)
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold">
                      {tasks.length > 0 ? `${remainingTasks} doses remaining today` : "No active prescription loaded"}
                    </h3>

                    {/* Progress Bar */}
                    {tasks.length > 0 && (
                      <div className="w-full h-1.5 rounded-full bg-slate-200/50 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-300"
                          style={{ width: `${taskPercent}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Task List */}
                  {tasks.length > 0 ? (
                    <div className="space-y-2 text-xs max-h-48 overflow-y-auto pr-1">
                      {tasks.map((task) => (
                        <div 
                          key={task.id}
                          onClick={() => handleToggleTask(task.id)}
                          className="flex items-center space-x-3 cursor-pointer group select-none py-1 border-b border-slate-500/10"
                        >
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                            task.completed 
                              ? 'bg-[#0f3e3a] border-[#0f3e3a] text-white' 
                              : 'border-slate-400 group-hover:border-[#0f3e3a]'
                          }`}>
                            {task.completed && <CheckCircle2 className="w-3 h-3 text-emerald-300" />}
                          </div>
                          <div className="flex-1 flex items-center justify-between min-w-0">
                            <span className={`truncate font-medium ${task.completed ? 'line-through text-slate-400' : ''}`}>
                              {task.text}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{task.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-4">
                      Upload a doctor's slip in the AI Prescription tab to generate daily tasks.
                    </p>
                  )}
                </div>

              </div>

              {/* CARD 2: 📄 AI PRESCRIPTION VISION & OCR WORKSPACE */}
              <div className="space-y-6">
                
                {/* 1. PRESCRIPTION SCANNER (ON TOP) */}
                <PrescriptionScanner 
                  uploadedImage={uploadedImage}
                  onImageUploaded={handleImageUploaded}
                  onRemoveImage={handleRemoveImage}
                  isScanning={isScanning}
                  scanStatusText={scanStatusText}
                  errorMessage={scanErrorMessage}
                  onTriggerScan={() => handleImageUploaded(uploadedImage, "prescription-rescan.jpg")}
                  overallConfidence={overallConfidence}
                  totalDetectedMeds={currentMedicines.length}
                  decodedCategory={decodedCategory}
                  doctorSpecialty={doctorSpecialty}
                  userProfile={currentUser}
                  selectedLang={selectedLang}
                  isDarkMode={isDarkMode}
                />

                {/* 2. DYNAMIC MEDICATIONS LIST (RENDERS ONLY WHEN MEDICINES ARE SCANNED/ACTIVE) */}
                {currentMedicines.length > 0 ? (
                  <>
                    <VerificationCards 
                      medicines={currentMedicines}
                      onUpdateMedicines={setCurrentMedicines}
                      userProfile={currentUser}
                      selectedLang={selectedLang}
                    />

                    <HindiVoiceAssistant 
                      medicines={currentMedicines}
                      doctorName={doctorSpecialty}
                      userProfile={currentUser}
                      selectedLang={selectedLang}
                      isDarkMode={isDarkMode}
                    />

                    <SafetyMatrix 
                      safetyAlerts={currentSafetyAlerts}
                      selectedLang={selectedLang}
                    />

                    <PriceComparisonSection 
                      medicines={currentMedicines}
                      onOpenLocator={() => setIsLocatorOpen(true)}
                      selectedLang={selectedLang}
                    />
                  </>
                ) : (
                  <div className={`${themeCardBg} rounded-3xl p-8 text-center space-y-2 border border-dashed transition-colors`}>
                    <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
                    <h3 className="text-sm font-bold">No Active Prescription Decoded</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Upload or photograph a doctor's prescription slip above to transcribe medicines and schedules.
                    </p>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ================= VIEW 2: PRICE COMPARISON TAB ================= */}
          {activeTab === 'price-comparison' && (
            <div className="space-y-6 animate-fade-in">
              <PriceComparisonSection 
                medicines={currentMedicines}
                onOpenLocator={() => setIsLocatorOpen(true)}
                selectedLang={selectedLang}
              />
            </div>
          )}

          {/* ================= VIEW 3: FIND DOCTORS ================= */}
          {activeTab === 'doctors' && (
            <div className="animate-fade-in">
              <DoctorBrowser 
                onBookAppointment={(apt) => {
                  setAppointments(prev => [apt, ...prev]);
                  setActiveTab('appointments');
                }}
                selectedLang={selectedLang}
              />
            </div>
          )}

          {/* ================= VIEW 4: MY APPOINTMENTS ================= */}
          {activeTab === 'appointments' && (
            <div className="animate-fade-in">
              <MyAppointments 
                appointments={appointments}
                onCancelAppointment={(id) => setAppointments(prev => prev.filter(a => a.id !== id))}
                onBookNew={() => setActiveTab('doctors')}
              />
            </div>
          )}

          {/* ================= VIEW 5: AI PRESCRIPTION SCANNER TAB ================= */}
          {activeTab === 'ai-prescription' && (
            <div className="animate-fade-in space-y-6">
              <PrescriptionUploadPage 
                onProcessPrescription={async ({ fileData, fileName }) => {
                  await handleImageUploaded(fileData, fileName);
                  setActiveTab('overview');
                }}
                selectedLang={selectedLang}
                onOpenLegal={() => setIsLegalOpen(true)}
              />
            </div>
          )}

          {/* ================= VIEW 6: DOSAGE REMINDERS ================= */}
          {activeTab === 'reminders' && (
            <div className="animate-fade-in">
              <MedicineReminders 
                medicines={currentMedicines}
                onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
                selectedLang={selectedLang}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* ================= VIEW 7: DOCTOR VERIFICATION QUEUE ================= */}
          {currentPortal === 'doctor' && (
            <div className="animate-fade-in">
              <DoctorVerificationRequests 
                doctorProfile={{
                  name: currentUser.name || "Dr. Rajesh Sharma, MD",
                  specialty: currentUser.specialty || "General Medicine & Pulmonology",
                  regNo: currentUser.regNo || "MCI-48291",
                  hospital: "Apollo Hospitals"
                }}
                prescriptions={[
                  {
                    id: "rx-demo-queue-1",
                    uploadedFile: uploadedImage || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
                    extraction: {
                      patientInfo: { name: currentUser.name || "Dev Soni", age: currentUser.age || 20 },
                      medicines: currentMedicines
                    },
                    status: "verification_requested"
                  }
                ]}
                onVerifyPrescription={(rxId, details) => {
                  alert("Prescription digitally verified & signed by Dr. Rajesh Sharma!");
                }}
                selectedLang={selectedLang}
              />
            </div>
          )}

        </main>

      </div>

      {/* Global Modals */}
      <JanAushadhiLocatorModal 
        isOpen={isLocatorOpen}
        onClose={() => setIsLocatorOpen(false)}
        selectedLang={selectedLang}
      />

      <WhatsAppModal 
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        medicines={currentMedicines}
        patientName={currentUser.name}
        selectedLang={selectedLang}
      />

      <LegalModal 
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
      />

    </div>
  );
}
export default App;
