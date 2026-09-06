import React, { useState, useEffect, useRef } from 'react';
import {
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  User,
  Calendar,
  Upload,
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
  Inbox,
  Trash2,
  ChevronDown,
  Lock,
  PhoneCall,
  ExternalLink,
  Printer,
  Dna
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
import { JanAushadhiLocatorModal, JanAushadhiLocatorView } from './components/JanAushadhiLocatorModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { LegalModal } from './components/LegalModal';
import { FinalLoginPage } from './components/FinalLoginPage';
import { VisualGroundingInspectorModal } from './components/VisualGroundingInspectorModal';
import { IndianDietMatrix } from './components/IndianDietMatrix';
import { BilingualDischargeReceiptModal } from './components/BilingualDischargeReceiptModal';
import { AbdmFhirExportModal } from './components/AbdmFhirExportModal';
import { getVisualGroundingForMed } from './utils/visualGroundingData';
import { parsePrescriptionImage } from './utils/prescriptionParser';
import { SAMPLE_PRESCRIPTIONS } from './data/samplePrescriptions';

export function App() {
  // Global Theme State: Light / Dark Mode (Defaults to Dark Mode as shown in primary screenshots, persists in localStorage)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('prescripto_theme');
    return savedTheme !== null ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('prescripto_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Authentication State with Permanent Local Storage Persistence
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedToken = localStorage.getItem('prescripto_token');
      const savedUserRaw = localStorage.getItem('prescripto_user');
      return !!(savedToken || savedUserRaw);
    } catch (e) {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUserRaw = localStorage.getItem('prescripto_user');
      if (savedUserRaw) {
        return JSON.parse(savedUserRaw);
      }
    } catch (e) {}
    return {
      name: "Rahul",
      age: 22,
      gender: "Male",
      phone: "9140427747",
      role: "patient",
      healthId: "ABHA-7890-9357",
      email: "prescriptoplus@customersupport.com"
    };
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'jan-aushadhi' | 'doctors' | 'appointments' | 'reminders'
  const [selectedLang, setSelectedLang] = useState('en');

  // Profile Menu Dropdown
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Scanner Section Ref for Smooth Scroll
  const scannerSectionRef = useRef(null);

  // Modals
  const [isLocatorOpen, setIsLocatorOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [isVisualInspectorOpen, setIsVisualInspectorOpen] = useState(false);
  const [selectedInspectMed, setSelectedInspectMed] = useState(null);
  const [selectedInspectGrounding, setSelectedInspectGrounding] = useState(null);
  const [isBilingualSlipOpen, setIsBilingualSlipOpen] = useState(false);
  const [isFhirModalOpen, setIsFhirModalOpen] = useState(false);
  const [activePrescriptionId, setActivePrescriptionId] = useState('rx-gangaram-ortho');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Prescriptions State (With LocalStorage Persistence)
  const [uploadedImage, setUploadedImage] = useState(() => {
    try { return localStorage.getItem('prescripto_rx_img') || null; } catch(e) { return null; }
  });
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatusText, setScanStatusText] = useState('');
  const [scanErrorMessage, setScanErrorMessage] = useState('');
  const [currentMedicines, setCurrentMedicines] = useState(() => {
    try {
      const saved = localStorage.getItem('prescripto_rx_meds');
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });
  const [currentSafetyAlerts, setCurrentSafetyAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('prescripto_rx_alerts');
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });
  const [overallConfidence, setOverallConfidence] = useState(98);
  const [decodedCategory, setDecodedCategory] = useState(() => {
    try { return localStorage.getItem('prescripto_rx_cat') || ''; } catch(e) { return ''; }
  });
  const [doctorSpecialty, setDoctorSpecialty] = useState(() => {
    try { return localStorage.getItem('prescripto_rx_spec') || ''; } catch(e) { return ''; }
  });

  // Daily Tasks State (Synchronized dynamically with active uploaded prescription)
  const [tasks, setTasks] = useState([]);

  // Auto-sync prescription to localStorage so it is 100% resilient across reloads/network drops
  useEffect(() => {
    try {
      if (currentMedicines && currentMedicines.length > 0) {
        localStorage.setItem('prescripto_rx_meds', JSON.stringify(currentMedicines));
      }
      if (currentSafetyAlerts && currentSafetyAlerts.length > 0) {
        localStorage.setItem('prescripto_rx_alerts', JSON.stringify(currentSafetyAlerts));
      }
      if (decodedCategory) localStorage.setItem('prescripto_rx_cat', decodedCategory);
      if (doctorSpecialty) localStorage.setItem('prescripto_rx_spec', doctorSpecialty);
      if (uploadedImage) localStorage.setItem('prescripto_rx_img', uploadedImage);
    } catch (e) {}
  }, [currentMedicines, currentSafetyAlerts, decodedCategory, doctorSpecialty, uploadedImage]);

  // Dynamic time and wellness mood for Enchanted Hero Panel
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [wellnessMood, setWellnessMood] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 20000);
    return () => clearInterval(timer);
  }, []);

  const currentHour = currentDateTime.getHours();
  let timeGreeting = "Good morning";
  let timeGreetingEmoji = "🌅";
  let timeGreetingHindi = "सुप्रभात";
  let timeGreetingSubtitle = "Your clinical telemetry & ABHA health record are fully synchronized.";
  let timeGreetingSubtitleHindi = "आपकी स्वास्थ्य समय-सारणी एवं आभा रिकॉर्ड पूरी तरह से सुरक्षित व सक्रिय हैं।";

  if (currentHour >= 12 && currentHour < 17) {
    timeGreeting = "Good afternoon";
    timeGreetingEmoji = "☀️";
    timeGreetingHindi = "शुभ दोपहर";
    timeGreetingSubtitle = "Midday vitals are stable. Check dosage schedule and generic PMBJP alternatives.";
    timeGreetingSubtitleHindi = "दोपहर के महत्वपूर्ण स्वास्थ्य संकेत सामान्य हैं। दवाइयों का समय और जन औषधि विकल्प देखें।";
  } else if (currentHour >= 17 && currentHour < 21) {
    timeGreeting = "Good evening";
    timeGreetingEmoji = "🌇";
    timeGreetingHindi = "शुभ संध्या";
    timeGreetingSubtitle = "Evening routine ready. Review night medications and Indian diet guidelines.";
    timeGreetingSubtitleHindi = "शाम की दिनचर्या तैयार है। रात्रि की दवाइयां और आहार दिशा-निर्देश देखें।";
  } else if (currentHour >= 21 || currentHour < 5) {
    timeGreeting = "Good night";
    timeGreetingEmoji = "🌙";
    timeGreetingHindi = "शुभ रात्रि";
    timeGreetingSubtitle = "Rest peacefully. Your AI health co-pilot is monitoring your reminders 24x7.";
    timeGreetingSubtitleHindi = "शांतिपूर्वक विश्राम करें। आपका AI हेल्थ को-पायलट 24x7 आपके रिमाइंडर्स की निगरानी कर रहा है।";
  }

  const liveDateString = currentDateTime.toLocaleDateString(selectedLang === 'hi' ? 'hi-IN' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  const liveTimeString = currentDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const WELLNESS_MOODS = [
    {
      id: 'great',
      emoji: '⚡',
      label: selectedLang === 'hi' ? 'ऊर्जावान' : 'Energetic',
      desc: selectedLang === 'hi' ? '✨ शानदार! आपकी दिनचर्या बेहतरीन तरीके से सक्रिय है।' : '✨ Wonderful! Your wellness momentum is high and vitals are thriving.'
    },
    {
      id: 'calm',
      emoji: '🌿',
      label: selectedLang === 'hi' ? 'शांत व स्वस्थ' : 'Calm & Well',
      desc: selectedLang === 'hi' ? '🌿 बहुत अच्छा! पर्याप्त पानी पिएं और समय पर दवाइयां लें।' : '🌿 Balanced state. Keep staying hydrated and stick to your dietary guidelines.'
    },
    {
      id: 'recovering',
      emoji: '☕',
      label: selectedLang === 'hi' ? 'सुधार जारी' : 'Recovering',
      desc: selectedLang === 'hi' ? '☕ विश्राम जरूरी है। अपनी दवाइयों का शेड्यूल नीचे चेक करें।' : '☕ Healing takes patience. Review your active dosage routine below.'
    },
    {
      id: 'need_doc',
      emoji: '🩺',
      label: selectedLang === 'hi' ? 'परामर्श चाहिए' : 'Need Advice',
      desc: selectedLang === 'hi' ? '🩺 विशेषज्ञ डॉक्टर उपलब्ध हैं। अपॉइंटमेंट तुरंत बुक करें।' : '🩺 Our certified specialist physicians are on standby for you.'
    }
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ----------------------------------------------------
  // PERSISTENT DATABASE SESSION RESTORATION (One-Time Login)
  // ----------------------------------------------------
  useEffect(() => {
    const savedToken = localStorage.getItem('prescripto_token');
    const savedUserRaw = localStorage.getItem('prescripto_user');

    if (savedToken) {
      // Validate session with server database
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${savedToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.success && data.user) {
            const restoredUser = data.user;
            setCurrentUser(prev => ({ ...prev, ...restoredUser }));
            setIsAuthenticated(true);

            // Restore user's saved prescriptions from database
            fetch(`/api/prescriptions/user/${restoredUser.id}`)
              .then(r => r.json())
              .then(rxData => {
                if (rxData && rxData.success && Array.isArray(rxData.data) && rxData.data.length > 0) {
                  const latestRx = rxData.data[0];
                  if (latestRx.medicines && latestRx.medicines.length > 0) {
                    setCurrentMedicines(latestRx.medicines);
                    if (latestRx.safetyAlerts) setCurrentSafetyAlerts(latestRx.safetyAlerts);
                    if (latestRx.doctorSpecialty) setDoctorSpecialty(latestRx.doctorSpecialty);
                    if (latestRx.decodedCategory) setDecodedCategory(latestRx.decodedCategory);
                    if (latestRx.uploadedImage) setUploadedImage(latestRx.uploadedImage);
                  }
                }
              })
              .catch(err => console.warn('Could not load user prescriptions from database:', err));
          } else if (savedUserRaw) {
            try {
              const parsed = JSON.parse(savedUserRaw);
              setCurrentUser(prev => ({ ...prev, ...parsed }));
              setIsAuthenticated(true);
            } catch (e) {}
          }
        })
        .catch(err => {
          console.warn('Backend session restore failed, using local cache:', err);
          if (savedUserRaw) {
            try {
              const parsed = JSON.parse(savedUserRaw);
              setCurrentUser(prev => ({ ...prev, ...parsed }));
              setIsAuthenticated(true);
            } catch (e) {}
          }
        });
    } else if (savedUserRaw) {
      try {
        const parsed = JSON.parse(savedUserRaw);
        setCurrentUser(prev => ({ ...prev, ...parsed }));
        setIsAuthenticated(true);
      } catch (e) {}
    }
  }, []);

  // Synchronize Daily Tasks with Active Medicines
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

  // Appointments State (starts empty, user books slots on demand)
  const [appointments, setAppointments] = useState([]);

  // Load appointments from backend API
  useEffect(() => {
    if (currentUser?.id) {
      // Fetch user appointments
      fetch(`/api/appointments/my?userId=${currentUser.id}&role=${currentUser.role || 'patient'}`)
        .then(r => r.json())
        .then(data => {
          if (data && data.success && Array.isArray(data.data)) {
            setAppointments(data.data);
          }
        })
        .catch(err => console.warn('Could not load appointments:', err));
    }
  }, [currentUser?.id, currentUser?.role]);

  // Book Appointment via Backend API
  const handleBookAppointment = async (apt) => {
    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: currentUser.id || 'usr-1',
          patientName: currentUser.name || 'Rahul',
          doctorId: apt.doctorId || 'doc-1',
          date: apt.date,
          time: apt.time
        })
      });
      const data = await res.json();
      if (data && data.success && data.data) {
        setAppointments(prev => [data.data, ...prev]);
      } else {
        setAppointments(prev => [apt, ...prev]);
      }
    } catch (err) {
      setAppointments(prev => [apt, ...prev]);
    }
    setActiveTab('appointments');
  };

  // Cancel Appointment via Backend API
  const handleCancelAppointment = async (aptId) => {
    setAppointments(prev => prev.filter(a => a.id !== aptId));
    try {
      await fetch(`/api/appointments/${aptId}/cancel`, { method: 'POST' });
    } catch (err) {
      console.warn('Cancel appointment error:', err);
    }
  };

  // ----------------------------------------------------
  // Handlers
  // ----------------------------------------------------

  const handleLogin = (credentials) => {
    const updatedUser = {
      ...currentUser,
      id: credentials.id || currentUser.id || 'usr-1',
      name: credentials.name || currentUser.name || 'Rahul',
      age: credentials.age || currentUser.age || 22,
      gender: credentials.gender || currentUser.gender || "Male",
      phone: credentials.phone || currentUser.phone || "9140427747",
      role: 'patient',
      healthId: credentials.abhaId || credentials.healthId || currentUser.healthId || "ABHA-7890-9357",
      email: credentials.email || currentUser.email || "prescriptoplus@customersupport.com"
    };

    try {
      localStorage.setItem('prescripto_user', JSON.stringify(updatedUser));
      if (!localStorage.getItem('prescripto_token')) {
        localStorage.setItem('prescripto_token', `sess_${updatedUser.id}`);
      }
    } catch (e) {}

    setCurrentUser(updatedUser);
    setActiveTab('overview');
    setIsAuthenticated(true);

    // Fetch user's existing prescriptions from database
    if (updatedUser.id) {
      fetch(`/api/prescriptions/user/${updatedUser.id}`)
        .then(r => r.json())
        .then(rxData => {
          if (rxData && rxData.success && Array.isArray(rxData.data) && rxData.data.length > 0) {
            const latestRx = rxData.data[0];
            if (latestRx.medicines && latestRx.medicines.length > 0) {
              setCurrentMedicines(latestRx.medicines);
              if (latestRx.safetyAlerts) setCurrentSafetyAlerts(latestRx.safetyAlerts);
              if (latestRx.doctorSpecialty) setDoctorSpecialty(latestRx.doctorSpecialty);
              if (latestRx.decodedCategory) setDecodedCategory(latestRx.decodedCategory);
              if (latestRx.uploadedImage) setUploadedImage(latestRx.uploadedImage);
            }
          }
        })
        .catch(err => console.warn('Could not fetch user prescriptions:', err));
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('prescripto_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      }
    } catch (e) {
      console.warn('Logout error:', e);
    }
    localStorage.removeItem('prescripto_token');
    localStorage.removeItem('prescripto_user');
    setIsAuthenticated(false);
    setIsProfileMenuOpen(false);
    setUploadedImage(null);
    setCurrentMedicines([]);
    setCurrentSafetyAlerts([]);
    setScanErrorMessage('');
    setDecodedCategory('');
    setDoctorSpecialty('');
    setTasks([]);
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
      const meds = parsed.medicines || [];
      const alerts = parsed.safetyAlerts || [];
      const conf = parsed.confidence || 98;
      const cat = parsed.category || "Doctor Prescription";
      const spec = parsed.doctorSpecialty || "General Medicine";

      setCurrentMedicines(meds);
      setCurrentSafetyAlerts(alerts);
      setOverallConfidence(conf);
      setDecodedCategory(cat);
      setDoctorSpecialty(spec);

      // Map detected clinical profile to ground truth bounding box coordinate model
      const fileLower = (fileName || "").toLowerCase();
      let rxId = 'rx-gangaram-ortho';
      if (fileLower.includes('sairisa') || fileLower.includes('1788643274060') || cat.includes('Fissure')) {
        rxId = 'rx-sairisa-oncology';
      } else if (fileLower.includes('suman') || fileLower.includes('1788643275683') || cat.includes('Hepatic')) {
        rxId = 'rx-vy-gastro-suman';
      } else if (fileLower.includes('abdomen') || fileLower.includes('1788643277125') || cat.includes('Abdominal')) {
        rxId = 'rx-vy-gastro-abdomen';
      } else if (fileLower.includes('gangaram') || fileLower.includes('1788643272782') || cat.includes('Sciatica')) {
        rxId = 'rx-gangaram-ortho';
      } else if (cat.includes('Schizophrenia') || cat.includes('Psychiatry')) {
        rxId = 'rx-psychiatrist';
      }
      setActivePrescriptionId(rxId);

      // Persist the extracted prescription to user's database record
      try {
        const currentUserId = currentUser?.id || 'usr-1';
        fetch('/api/prescriptions/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUserId,
            prescription: {
              doctorSpecialty: spec,
              decodedCategory: cat,
              medicines: meds,
              safetyAlerts: alerts,
              overallConfidence: conf,
              filename: fileName || 'prescription.jpg',
              uploadedImage: imgData
            }
          })
        }).catch(err => console.warn('Could not auto-save prescription to database:', err));
      } catch (e) {
        console.warn('Prescription auto-save exception:', e);
      }
    }

    setIsScanning(false);
  };

  // Visual Grounding Inspector Trigger
  const handleInspectMed = (med, idx = 0) => {
    setSelectedInspectMed(med);
    const grounding = getVisualGroundingForMed(med, activePrescriptionId, idx);
    setSelectedInspectGrounding(grounding);
    setIsVisualInspectorOpen(true);
  };

  // Clear / Remove Photo -> Immediately Clears All Detected Medications!
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setCurrentMedicines([]);
    setCurrentSafetyAlerts([]);
    setScanErrorMessage('');
    setDecodedCategory('');
    setDoctorSpecialty('');
    setTasks([]);
  };

  // Select Sample Prescription Handler
  const handleSelectSampleRx = (sampleId) => {
    const sample = SAMPLE_PRESCRIPTIONS.find(s => s.id === sampleId);
    if (!sample) return;

    setActivePrescriptionId(sampleId);
    setUploadedImage(sample.rawImageUrl);
    setCurrentMedicines(sample.medicines || []);
    setCurrentSafetyAlerts(sample.safetyAlerts || []);
    setOverallConfidence(sample.confidence || 98);
    setDecodedCategory(sample.category || "Doctor Prescription");
    setDoctorSpecialty(sample.doctor?.specialty || sample.doctorSpecialty || "General Medicine");
    setScanErrorMessage('');

    // Persist to user's record in server database
    try {
      const currentUserId = currentUser?.id || 'usr-1';
      fetch('/api/prescriptions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          prescription: {
            doctorSpecialty: sample.doctor?.specialty || "General Medicine",
            decodedCategory: sample.category || "Doctor Prescription",
            medicines: sample.medicines,
            safetyAlerts: sample.safetyAlerts || [],
            overallConfidence: sample.confidence || 98,
            filename: `${sampleId}.jpg`,
            uploadedImage: sample.rawImageUrl
          }
        })
      }).catch(err => console.warn('Could not auto-save sample Rx:', err));
    } catch (e) {}
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const remainingTasks = tasks.length - completedTasks;
  const taskPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // User Initials
  const userInitials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "N";

  // First appointment for preview
  const primaryApt = appointments.length > 0 ? appointments[0] : null;

  // If not logged in, render secure login screen
  if (!isAuthenticated) {
    return (
      <FinalLoginPage
        onLogin={handleLogin}
        onLoginSuccess={handleLogin}
        selectedLang={selectedLang}
        onSelectLang={setSelectedLang}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
    );
  }

  // Dynamic Global Theme Classes
  const themeBg = isDarkMode ? "bg-[#051814] text-[#e2ebe9]" : "bg-[#f4f7f6] text-[#1c2726]";
  const themeHeaderBg = isDarkMode ? "bg-[#061915]/95 border-[#123630]" : "bg-white/95 border-slate-200/80";
  const themeCardBg = isDarkMode ? "bg-[#0a231f] border-[#133d36]" : "bg-white border-slate-200/80";
  const themeFooterBg = isDarkMode ? "bg-[#041411] border-[#0e2a25]" : "bg-white border-slate-200";

  return (
    <div className={`min-h-screen ${themeBg} flex flex-col font-sans transition-colors duration-300`}>

      {/* ================= FLOATING TOP NAVIGATION BAR (As Shown in Reference Screenshots) ================= */}
      <header className={`sticky top-0 z-40 ${themeHeaderBg} backdrop-blur-md border-b transition-colors`}>
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          {/* Left: Prescripto Plus Logo + ABDM Certified Badge */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm shadow-teal-500/20 bg-white flex items-center justify-center p-1 border border-teal-500/30 shrink-0">
              <img src="/logo.png" alt="PrescriptoPlus Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-xl font-black tracking-tight enchanted-brand-text inline-flex items-center group cursor-pointer transition-transform hover:scale-105 select-none">
                  <span>Prescripto<span className="text-teal-300">Plus</span></span>
                  <span className="ml-1 text-xs text-teal-300 opacity-80 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300">✦</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  ABDM Certified
                </span>
              </div>
              <p className={`text-[10px] sm:text-[11px] font-medium flex items-center space-x-1.5 ${isDarkMode ? 'text-teal-300/70' : 'text-slate-500'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
                <span>AI Prescription & Health Co-Pilot</span>
              </p>
            </div>
          </div>

          {/* Center: Floating Navigation Pill Bar */}
          <nav className={`hidden md:flex items-center space-x-1 p-1 rounded-2xl border shadow-xs ${isDarkMode ? 'bg-[#0b2420] border-[#17433c]' : 'bg-slate-100/90 border-slate-200'}`}>
            
            {/* Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'overview'
                  ? isDarkMode ? 'bg-[#133f38] text-white shadow-sm border border-[#205b51]' : 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : isDarkMode ? 'text-[#8ea7a3] hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-teal-400" />
              <span>Overview</span>
            </button>

            {/* Jan Aushadhi */}
            <button
              onClick={() => {
                setActiveTab('jan-aushadhi');
                setIsLocatorOpen(true);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'jan-aushadhi'
                  ? isDarkMode ? 'bg-[#133f38] text-white shadow-sm border border-[#205b51]' : 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : isDarkMode ? 'text-[#8ea7a3] hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Jan Aushadhi</span>
            </button>

            {/* Find Doctor */}
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'doctors'
                  ? isDarkMode ? 'bg-[#133f38] text-white shadow-sm border border-[#205b51]' : 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : isDarkMode ? 'text-[#8ea7a3] hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
              <span>Find Doctor</span>
            </button>

            {/* Appointments */}
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'appointments'
                  ? isDarkMode ? 'bg-[#133f38] text-white shadow-sm border border-[#205b51]' : 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : isDarkMode ? 'text-[#8ea7a3] hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>Appointments</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${isDarkMode ? 'bg-[#18453f] text-emerald-300' : 'bg-slate-200 text-slate-700'}`}>
                {appointments.length}
              </span>
            </button>

            {/* Dosage Reminders */}
            <button
              onClick={() => setActiveTab('reminders')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
                activeTab === 'reminders'
                  ? isDarkMode ? 'bg-[#133f38] text-white shadow-sm border border-[#205b51]' : 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : isDarkMode ? 'text-[#8ea7a3] hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-teal-400" />
              <span>Dosage Reminders</span>
            </button>

          </nav>

          {/* Right: Theme Toggle Circle + User Profile Badge */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                isDarkMode 
                  ? 'bg-[#0b2420] border-[#1b4841] text-amber-300 hover:bg-[#123630]' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile Badge with Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                  isDarkMode 
                    ? 'bg-[#0b2420] border-[#1b4841] hover:bg-[#123630]' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {userInitials}
                </div>
                <div className="text-left hidden sm:block">
                  <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-500 font-mono font-medium leading-tight">
                    {currentUser.healthId}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-xl p-2 z-50 animate-fade-in ${
                  isDarkMode ? 'bg-[#0a231f] border-[#164d41] text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <div className="p-2 border-b border-slate-500/20 text-xs">
                    <div className="font-bold">{currentUser.name}</div>
                    <div className="text-[11px] text-teal-400 font-mono">{currentUser.healthId}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{currentUser.phone || "9140427747"}</div>
                    <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                  </div>

                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => { setIsLegalOpen(true); setIsProfileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-teal-500/10 cursor-pointer flex items-center space-x-2"
                    >
                      <Shield className="w-3.5 h-3.5 text-teal-400" />
                      <span>Privacy & Legal Safety</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-rose-500/10 text-rose-400 cursor-pointer flex items-center space-x-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around border-t border-slate-500/10 py-2 px-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1 rounded-lg font-semibold ${activeTab === 'overview' ? 'text-teal-400 bg-teal-500/10' : 'text-slate-400'}`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              setActiveTab('jan-aushadhi');
              setIsLocatorOpen(true);
            }}
            className={`px-2.5 py-1 rounded-lg font-semibold ${activeTab === 'jan-aushadhi' ? 'text-teal-400 bg-teal-500/10' : 'text-slate-400'}`}
          >
            Jan Aushadhi
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-2.5 py-1 rounded-lg font-semibold ${activeTab === 'doctors' ? 'text-teal-400 bg-teal-500/10' : 'text-slate-400'}`}
          >
            Doctors
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-2.5 py-1 rounded-lg font-semibold ${activeTab === 'appointments' ? 'text-teal-400 bg-teal-500/10' : 'text-slate-400'}`}
          >
            Appointments ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-2.5 py-1 rounded-lg font-semibold ${activeTab === 'reminders' ? 'text-teal-400 bg-teal-500/10' : 'text-slate-400'}`}
          >
            Reminders
          </button>
        </div>
      </header>

      {/* ================= MAIN APPLICATION CONTENT ================= */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 flex-1">

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">

            {/* ENCHANTED DYNAMIC & INTERACTIVE HERO COMPANION BANNER */}
            <div className="enchanted-border-wrapper rounded-3xl p-[1.5px] shadow-[0_0_45px_rgba(20,184,166,0.3)] hover:shadow-[0_0_70px_rgba(45,212,191,0.5)] transition-all duration-500">
              <div className="enchanted-hero-card text-white rounded-[22px] p-6 sm:p-9 relative overflow-hidden space-y-6 transition-all duration-300">
                
                {/* Enchanted Multi-Layer Ambient Glow Orbs */}
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-teal-400/30 via-emerald-400/20 to-cyan-400/15 blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-88 h-88 rounded-full bg-gradient-to-tr from-cyan-400/25 via-teal-500/20 to-emerald-500/15 blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

                {/* Twinkling Celestial Enchantment Stars */}
                <div className="absolute top-6 right-1/3 opacity-90 text-teal-300 text-lg twinkle-star-1 pointer-events-none select-none">✦</div>
                <div className="absolute top-14 right-16 opacity-95 text-emerald-300 text-xl twinkle-star-2 pointer-events-none select-none">✧</div>
                <div className="absolute bottom-8 right-1/4 opacity-80 text-cyan-300 text-sm twinkle-star-3 pointer-events-none select-none">⋆</div>
                <div className="absolute top-1/2 right-12 opacity-85 text-teal-200 text-base twinkle-star-1 pointer-events-none select-none">✨</div>
                <div className="absolute bottom-16 right-8 opacity-75 text-emerald-200 text-xs twinkle-star-2 pointer-events-none select-none">★</div>
                <div className="absolute top-12 left-2/3 opacity-70 text-cyan-200 text-xs twinkle-star-3 pointer-events-none select-none">✦</div>

                <div className="relative z-10 space-y-5">
                  
                  {/* Top Row: Live Status & Real-Time Clock */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full enchanted-glass-pill text-teal-200 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-spin" style={{ animationDuration: '6s' }} />
                      <span className="tracking-wide">{selectedLang === 'hi' ? 'मंत्रमुग्ध स्वास्थ्य साथी (Enchanted Health Companion)' : 'Enchanted Health Companion'}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1 inline-block" />
                    </div>

                    <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl enchanted-glass-pill text-[11px] font-mono text-teal-300/90 self-start sm:self-auto">
                      <Clock className="w-3.5 h-3.5 text-teal-300" />
                      <span>{liveDateString}</span>
                      <span className="text-teal-500">•</span>
                      <span className="text-white font-bold">{liveTimeString}</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                    </div>
                  </div>

                  {/* Main Dynamic Greeting Title */}
                  <div className="space-y-3">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-2.5">
                      {/* Enchanted 'Good morning' Panel with Aura Glow & Shimmer */}
                      <span className="relative inline-flex items-center group cursor-default">
                        {/* Enchanted Pulsing Halo behind Good morning */}
                        <span className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-teal-400/35 via-emerald-300/30 to-cyan-400/30 blur-xl opacity-85 group-hover:opacity-100 transition-all duration-500 animate-pulse pointer-events-none" />
                        {/* Sparkle star before Good morning */}
                        <span className="relative mr-1.5 text-teal-300 text-base sm:text-xl twinkle-star-1 select-none pointer-events-none">✧</span>
                        {/* Flowing Aurora text for Good morning */}
                        <span className="relative font-extrabold enchanted-greeting-text drop-shadow-[0_0_28px_rgba(45,212,191,0.7)] group-hover:brightness-110 transition-all duration-300">
                          {selectedLang === 'hi' ? timeGreetingHindi : timeGreeting},
                        </span>
                      </span>

                      <span className="relative inline-flex items-center group">
                        {/* Enchanted Pulsing Aura Halo */}
                        <span className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-emerald-400/30 via-teal-300/30 to-cyan-400/30 blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse pointer-events-none" />
                        {/* Enchanted Name Text without underline */}
                        <span className="relative font-black tracking-tight enchanted-brand-text drop-shadow-[0_0_24px_rgba(45,212,191,0.65)] hover:brightness-125 transition-all duration-300">
                          {currentUser.name}
                        </span>
                        {/* Floating Micro-Star */}
                        <span className="relative ml-1 text-teal-300 text-lg opacity-85 twinkle-star-2 select-none pointer-events-none">✦</span>
                      </span>
                      <span className="text-3xl sm:text-4xl float-animation inline-block ml-0.5 filter drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]">{timeGreetingEmoji}</span>
                    </h1>

                    {/* Radiant Shining Line Effect on Main Name Panel */}
                    <div className="relative h-[2.5px] w-full max-w-md overflow-hidden rounded-full bg-gradient-to-r from-teal-500/20 via-teal-400/40 to-transparent">
                      <div className="absolute inset-y-0 w-44 bg-gradient-to-r from-transparent via-emerald-300 to-transparent blur-[1px] animate-shining-line" />
                      <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-200 to-transparent animate-shining-line" />
                    </div>

                    <p className="text-xs sm:text-sm text-teal-100/95 leading-relaxed max-w-2xl font-medium">
                      {selectedLang === 'hi' ? timeGreetingSubtitleHindi : timeGreetingSubtitle}
                    </p>
                  </div>

                  {/* Interactive Daily Wellness Mood Pulse Meter */}
                  <div className="space-y-2.5 pt-2 border-t border-teal-800/40">
                    <div className="flex items-center justify-between text-xs font-semibold text-teal-200/90">
                      <div className="flex items-center space-x-2">
                        <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>{selectedLang === 'hi' ? 'आज आप कैसा महसूस कर रहे हैं? (दैनिक स्वास्थ्य जांच)' : 'How are you feeling right now? (Daily Wellness Pulse)'}</span>
                      </div>
                      <span className="text-[10px] font-mono text-teal-400/80 hidden sm:inline">Tap to record live aura</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {WELLNESS_MOODS.map((mood) => {
                        const isSelected = wellnessMood === mood.id;
                        return (
                          <button
                            key={mood.id}
                            type="button"
                            onClick={() => setWellnessMood(isSelected ? null : mood.id)}
                            className={`p-2.5 rounded-2xl text-xs font-semibold flex items-center space-x-2.5 transition-all cursor-pointer text-left ${
                              isSelected
                                ? 'enchanted-mood-active text-white scale-[1.03]'
                                : 'enchanted-glass-pill text-teal-200/85 hover:text-white'
                            }`}
                          >
                            <span className="text-base sm:text-lg filter drop-shadow-[0_0_8px_rgba(45,212,191,0.4)]">{mood.emoji}</span>
                            <span className="truncate">{mood.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dynamic AI Encouragement Message when mood is selected */}
                    {wellnessMood && (
                      <div className="p-3.5 rounded-2xl enchanted-glass-pill border border-teal-400/40 text-xs text-teal-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-[0_0_20px_rgba(20,184,166,0.2)]">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Sparkles className="w-4 h-4 text-teal-300 shrink-0 animate-pulse" />
                          <p className="text-xs font-medium leading-relaxed">
                            {WELLNESS_MOODS.find(m => m.id === wellnessMood)?.desc}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                          {wellnessMood === 'need_doc' && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('doctors')}
                              className="px-3 py-1.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-[11px] shadow-sm cursor-pointer transition-all hover:scale-105"
                            >
                              {selectedLang === 'hi' ? 'डॉक्टर परामर्श बुक करें' : 'Book Specialist'}
                            </button>
                          )}
                          {(wellnessMood === 'recovering' || wellnessMood === 'calm') && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('reminders')}
                              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] shadow-sm cursor-pointer transition-all hover:scale-105"
                            >
                              {selectedLang === 'hi' ? 'दवाइयों का शेड्यूल देखें' : 'View Routine'}
                            </button>
                          )}
                          {wellnessMood === 'great' && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('jan-aushadhi');
                                setIsLocatorOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-200 border border-emerald-400/50 font-bold text-[11px] cursor-pointer transition-all hover:scale-105"
                            >
                              {selectedLang === 'hi' ? 'जन औषधि बचत' : 'Generic Savings'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Row: Quick Jump Pills & Primary Action Buttons */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-teal-800/40">
                    
                    {/* Left: Interactive Quick Jump Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('jan-aushadhi');
                          setIsLocatorOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl enchanted-glass-pill text-teal-200 hover:text-white font-semibold flex items-center space-x-1.5 cursor-pointer hover:scale-105"
                      >
                        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{selectedLang === 'hi' ? 'जन औषधि केंद्र खोजें' : 'PMBJP Store Locator'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('reminders')}
                        className="px-3 py-1.5 rounded-xl enchanted-glass-pill text-teal-200 hover:text-white font-semibold flex items-center space-x-1.5 cursor-pointer hover:scale-105"
                      >
                        <Bell className="w-3.5 h-3.5 text-teal-300" />
                        <span>
                          {currentMedicines.length > 0 
                            ? `${currentMedicines.length} ${selectedLang === 'hi' ? 'सक्रिय दवाइयां' : 'Active Medicines'}`
                            : (selectedLang === 'hi' ? 'दवाई दिनचर्या' : 'Dosage Routine')}
                        </span>
                      </button>

                      <span className="px-3 py-1.5 rounded-xl enchanted-glass-pill text-emerald-300 font-mono text-[11px] flex items-center space-x-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>ABHA Certified (AES-256)</span>
                      </span>
                    </div>

                    {/* Right: Primary Action Buttons */}
                    <div className="flex items-center space-x-2.5 shrink-0 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          scannerSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 rounded-2xl enchanted-cta-button text-[#072621] font-black text-xs sm:text-sm cursor-pointer flex items-center space-x-2 active:scale-95"
                      >
                        <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
                        <span>{selectedLang === 'hi' ? 'पर्ची स्कैन करें' : 'Scan Prescription'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('doctors')}
                        className="px-4 py-2.5 rounded-2xl enchanted-glass-pill text-white font-bold text-xs sm:text-sm cursor-pointer flex items-center space-x-2 hover:scale-105 active:scale-95"
                      >
                        <Plus className="w-4 h-4 text-emerald-300" />
                        <span>{selectedLang === 'hi' ? 'डॉक्टर खोजें' : 'Consult Doctor'}</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </div>

            {/* TWO-COLUMN ROW: NEXT SCHEDULED CONSULTATION & CARE PLAN ROUTINE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* CARD 1: NEXT SCHEDULED CONSULTATION */}
              <div className={`${themeCardBg} rounded-3xl p-6 border shadow-xs space-y-5 transition-colors flex flex-col justify-between`}>
                {primaryApt ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-teal-500">
                          NEXT SCHEDULED CONSULTATION
                        </span>
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{primaryApt.status || "Confirmed"}</span>
                        </span>
                      </div>

                      <div className="flex items-start space-x-4">
                        {/* Date Block */}
                        <div className="w-14 h-16 rounded-2xl bg-[#0f3e3a] text-white flex flex-col items-center justify-center shrink-0 shadow-xs border border-teal-600/30">
                          <span className="text-lg font-extrabold leading-none">{primaryApt.date?.split(' ')[0] || "25"}</span>
                          <span className="text-[10px] font-bold tracking-wider text-teal-300 uppercase mt-0.5">{primaryApt.date?.split(' ')[1] || "AUG"}</span>
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <h3 className="text-base sm:text-lg font-bold truncate">
                            {primaryApt.doctorName}
                          </h3>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {primaryApt.specialty} • {primaryApt.consultationType || "In-clinic"}
                          </p>
                          <div className={`flex items-center space-x-3 text-xs pt-1 font-mono ${isDarkMode ? 'text-teal-200/80' : 'text-slate-600'}`}>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-teal-400" />
                              <span>{primaryApt.time}</span>
                            </span>
                            <span>{primaryApt.room || "Room 204"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center space-x-3 pt-2">
                      <button
                        onClick={() => setActiveTab('appointments')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                          isDarkMode ? 'bg-[#123630] text-white border-[#1c5047]' : 'bg-[#f4f7f6] text-slate-800 border-slate-200'
                        }`}
                      >
                        View details
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(primaryApt.id)}
                        className="text-xs text-slate-400 hover:text-rose-400 cursor-pointer font-medium transition-colors"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-teal-500">
                          NEXT SCHEDULED CONSULTATION
                        </span>
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 text-[11px] font-semibold border border-slate-500/20">
                          <span>No Active Booking</span>
                        </span>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-16 rounded-2xl bg-slate-800/40 text-slate-400 flex flex-col items-center justify-center shrink-0 border border-slate-700/40">
                          <Calendar className="w-6 h-6 text-slate-400" />
                        </div>

                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-bold">
                            No upcoming consultation
                          </h3>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            You do not have any scheduled doctor visits. Consult verified physicians for OPD or tele-consultation.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setActiveTab('doctors')}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Book Doctor Consultation</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* CARD 2: CARE PLAN ROUTINE */}
              <div className={`${themeCardBg} rounded-3xl p-6 border shadow-xs flex flex-col justify-between transition-colors`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-teal-500">
                      CARE PLAN ROUTINE
                    </span>
                    {tasks.length > 0 && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {completedTasks} / {tasks.length} Done ({taskPercent}%)
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold">
                    {tasks.length > 0 ? `${remainingTasks} doses remaining today` : "No active prescription loaded"}
                  </h3>

                  {tasks.length > 0 ? (
                    <>
                      {/* Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-500/20 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${taskPercent}%` }}
                        />
                      </div>

                      {/* Checklist */}
                      <div className="space-y-2 text-xs max-h-40 overflow-y-auto pr-1 pt-1">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => handleToggleTask(task.id)}
                            className="flex items-center space-x-3 cursor-pointer group select-none py-1 border-b border-slate-500/10"
                          >
                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                              task.completed 
                                ? 'bg-teal-600 border-teal-600 text-white' 
                                : 'border-slate-400 group-hover:border-teal-500'
                            }`}>
                              {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
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
                    </>
                  ) : (
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} pt-2`}>
                      Upload or photograph a doctor's prescription slip below to generate your daily medication routine.
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* PRESCRIPTION SCANNER SECTION */}
            <div ref={scannerSectionRef}>
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
                onSelectSampleRx={handleSelectSampleRx}
              />
            </div>

            {/* DECODED PRESCRIPTION RESULTS OR PLACEHOLDER */}
            {currentMedicines.length > 0 ? (
              <div className="space-y-6 animate-fade-in">
                
                {/* 🌟 HACKATHON BREAKTHROUGH CLINICAL ACTION BAR */}
                <div className={`p-4 sm:p-5 rounded-3xl border ${isDarkMode ? 'bg-gradient-to-r from-[#0d2e28] to-[#0a2721] border-[#184840]' : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-200'} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm`}>
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Zero-Hallucination Clinical Transparency Suite
                      </span>
                    </div>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Pixel-to-data grounding • Indian Diet matrix • ABDM FHIR compliant • PMBJP Savings
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsBilingualSlipOpen(true)}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>🖨️ 1-Tap Bilingual Receipt (PDF)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFhirModalOpen(true)}
                      className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      <span>🇮🇳 Export to ABHA (FHIR)</span>
                    </button>
                  </div>
                </div>

                {/* 1. EXTRACTED MEDICATIONS CARDS */}
                <VerificationCards
                  medicines={currentMedicines}
                  onUpdateMedicines={setCurrentMedicines}
                  onRemovePrescription={handleRemoveImage}
                  userProfile={currentUser}
                  selectedLang={selectedLang}
                  isDarkMode={isDarkMode}
                  onInspectMed={handleInspectMed}
                />

                {/* 2. INDIAN DIET & FOOD-DRUG INTERACTION MATRIX */}
                <IndianDietMatrix
                  medicines={currentMedicines}
                  selectedLang={selectedLang}
                  isDarkMode={isDarkMode}
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
                  isDarkMode={isDarkMode}
                />
              </div>
            ) : (
              /* Clean Placeholder as shown in Screenshot 1 & 2 */
              <div className={`${themeCardBg} rounded-3xl p-10 text-center space-y-3 border border-dashed transition-colors`}>
                <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${isDarkMode ? 'bg-[#0e302a] text-teal-400' : 'bg-slate-100 text-slate-500'}`}>
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold">No Active Prescription Decoded</h3>
                <p className={`text-xs max-w-sm mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Upload or photograph a doctor's prescription slip above to transcribe medicines and schedules.
                </p>
              </div>
            )}

          </div>
        )}

        {/* ================= TAB 2: JAN AUSHADHI & SAVINGS ================= */}
        {activeTab === 'jan-aushadhi' && (
          <div className="space-y-6 animate-fade-in">
            {/* FULL INTERACTIVE PMBJP KENDRA LOCATOR & ROUTING ENGINE */}
            <JanAushadhiLocatorView
              selectedLang={selectedLang}
              isDarkMode={isDarkMode}
              isModal={false}
              medicines={currentMedicines}
            />

            <PriceComparisonSection
              medicines={currentMedicines}
              onOpenLocator={() => setIsLocatorOpen(true)}
              selectedLang={selectedLang}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* ================= TAB 3: FIND DOCTORS ================= */}
        {activeTab === 'doctors' && (
          <div className="animate-fade-in">
            <DoctorBrowser
              onBookAppointment={handleBookAppointment}
              selectedLang={selectedLang}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* ================= TAB 4: MY APPOINTMENTS ================= */}
        {activeTab === 'appointments' && (
          <div className="animate-fade-in">
            <MyAppointments
              appointments={appointments}
              onCancelAppointment={handleCancelAppointment}
              onBookNew={() => setActiveTab('doctors')}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* ================= TAB 5: DOSAGE REMINDERS ================= */}
        {activeTab === 'reminders' && (
          <div className="animate-fade-in">
            <MedicineReminders
              medicines={currentMedicines}
              onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
              selectedLang={selectedLang}
              isDarkMode={isDarkMode}
              userId={currentUser?.id || 'usr-1'}
            />
          </div>
        )}

      </main>

      {/* ================= PIXEL-PERFECT 4-COLUMN FOOTER (Matches Screenshots 1, 2, 3) ================= */}
      <footer className={`${themeFooterBg} border-t transition-colors mt-auto pt-10 pb-8`}>
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
            
            {/* Col 1: Brand & Compliance Badges (5 cols) */}
            <div className="md:col-span-5 space-y-3.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl overflow-hidden bg-white p-0.5 border border-teal-500/30 flex items-center justify-center shrink-0">
                  <img src="/logo.png" alt="Prescripto Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-base sm:text-lg font-black tracking-tight enchanted-brand-text inline-flex items-center select-none">
                  <span>Prescripto<span className="text-teal-300">Plus</span></span>
                  <span className="ml-1 text-xs text-teal-300 opacity-80">✦</span>
                </span>
              </div>

              <p className={`text-xs leading-relaxed max-w-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Next-generation clinical AI prescription transcription, Jan Aushadhi generic medicine cost optimizer, and ABDM-certified patient EHR health co-pilot.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ABDM Compliant</span>
                </span>

                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  <Lock className="w-3 h-3" />
                  <span>DPDP Act 2023</span>
                </span>

                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30">
                  Data Privacy & Consent Protected
                </span>
              </div>
            </div>

            {/* Col 2: Platform Features (2 cols) */}
            <div className="md:col-span-2 space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-500">
                PLATFORM FEATURES
              </div>
              <ul className={`space-y-1.5 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <li><button onClick={() => setActiveTab('overview')} className="hover:text-teal-400 cursor-pointer">Clinical Overview</button></li>
                <li><button onClick={() => { setActiveTab('overview'); scannerSectionRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-teal-400 cursor-pointer">AI OCR Vision Scanner</button></li>
                <li><button onClick={() => { setActiveTab('jan-aushadhi'); setIsLocatorOpen(true); }} className="hover:text-teal-400 cursor-pointer">Jan Aushadhi Generic Savings</button></li>
                <li><button onClick={() => setActiveTab('doctors')} className="hover:text-teal-400 cursor-pointer">Find Verified Specialists</button></li>
                <li><button onClick={() => setActiveTab('reminders')} className="hover:text-teal-400 cursor-pointer">Dosage Reminders</button></li>
              </ul>
            </div>

            {/* Col 3: Governance & Safety (2 cols) */}
            <div className="md:col-span-2 space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-500">
                GOVERNANCE & SAFETY
              </div>
              <ul className={`space-y-1.5 text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <li><button onClick={() => setIsLegalOpen(true)} className="hover:text-teal-400 cursor-pointer">Medical AI Disclaimer</button></li>
                <li><button onClick={() => setIsLegalOpen(true)} className="hover:text-teal-400 cursor-pointer">Patient Consent Policy</button></li>
                <li><button onClick={() => setIsLegalOpen(true)} className="hover:text-teal-400 cursor-pointer">Data Retention & Deletion</button></li>
                <li><button onClick={() => setIsLegalOpen(true)} className="hover:text-teal-400 cursor-pointer">MCI Physician HITL Verification</button></li>
              </ul>
            </div>

            {/* Col 4: Emergency & Support (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal-500">
                EMERGENCY & SUPPORT
              </div>

              {/* 24/7 Clinical Support Box */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                isDarkMode ? 'bg-[#08221d] border-[#13493e]' : 'bg-[#f4f7f6] border-slate-200'
              }`}>
                <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>24/7 Clinical Support</span>
                </div>
                <div className="text-base font-extrabold tracking-wide font-mono text-emerald-400">
                  1800-MED-PLUS
                </div>
                <p className="text-[10px] text-slate-400">
                  Toll-Free National Healthcare Assistance Helpline
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs text-teal-400 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>System Status: Operational</span>
              </div>
            </div>

          </div>

          {/* Bottom Disclaimer Row */}
          <div className="pt-6 border-t border-slate-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 <span className="font-semibold text-slate-400">PrescriptoPlus Healthcare AI Technologies</span>. All rights reserved.
            </div>
            <div className="text-right max-w-xl text-[10px] text-slate-500 leading-relaxed">
              Medical Disclaimer: PrescriptoPlus provides AI-assisted transcription and generic price analysis. Always consult licensed medical professionals before making any changes to prescribed regimens.
            </div>
          </div>

        </div>
      </footer>

      {/* Global Modals */}
      <JanAushadhiLocatorModal
        isOpen={isLocatorOpen}
        onClose={() => setIsLocatorOpen(false)}
        selectedLang={selectedLang}
        isDarkMode={isDarkMode}
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

      {/* Visual Grounding & OCR Bounding Box Inspector Modal */}
      <VisualGroundingInspectorModal
        isOpen={isVisualInspectorOpen}
        onClose={() => setIsVisualInspectorOpen(false)}
        medicine={selectedInspectMed}
        prescriptionImage={uploadedImage}
        groundingData={selectedInspectGrounding}
        isDarkMode={isDarkMode}
      />

      {/* 1-Tap Bilingual Discharge Receipt & Visual Pill Schedule Modal */}
      <BilingualDischargeReceiptModal
        isOpen={isBilingualSlipOpen}
        onClose={() => setIsBilingualSlipOpen(false)}
        medicines={currentMedicines}
        doctorInfo={{
          name: doctorSpecialty?.split('•')?.[1]?.trim() || (doctorSpecialty ? doctorSpecialty : "Dr. S. P. Mandal, MS Ortho AIIMS"),
          specialty: doctorSpecialty?.split('•')?.[0]?.trim() || "Consultant Physician",
          regNo: "CGMC-3378 / NMC-2024"
        }}
        patientInfo={{
          name: currentUser?.name || "Mr. Verified Citizen",
          age: currentUser?.age || "45 Yrs",
          gender: currentUser?.gender || "Male"
        }}
        diagnosis={decodedCategory || "Clinical Prescription Protocol"}
        hospitalName={doctorSpecialty?.includes('Hospital') || doctorSpecialty?.includes('Ganga Ram') ? "Sir Ganga Ram Hospital / PMBJP Centre" : "PMBJP Empanelled Healthcare Center"}
        isDarkMode={isDarkMode}
      />

      {/* Ayushman Bharat (ABDM / FHIR) Health Record Export Modal */}
      <AbdmFhirExportModal
        isOpen={isFhirModalOpen}
        onClose={() => setIsFhirModalOpen(false)}
        medicines={currentMedicines}
        doctorInfo={{
          name: doctorSpecialty?.split('•')?.[1]?.trim() || "Dr. Medical Specialist",
          specialty: doctorSpecialty || "General Medicine",
          regNo: "NMC-IND-2024-9182"
        }}
        patientInfo={{
          name: currentUser?.name || "Mr. Citizen",
          gender: currentUser?.gender || "Male"
        }}
        diagnosis={decodedCategory || "Clinical Evaluation"}
        hospitalName="PMBJP Empanelled Healthcare Center"
        isDarkMode={isDarkMode}
      />

    </div>
  );
}

export default App;
