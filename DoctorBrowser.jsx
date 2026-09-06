import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Building2,
  Phone,
  CalendarDays
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SEED_DOCTORS = [
  {
    id: "doc-1",
    name: "Dr. Rajesh Sharma",
    qualification: "MBBS, MD (Internal Medicine)",
    specialty: "General Medicine & Pulmonology",
    experience: "14+ Years Exp",
    hospital: "Apollo Hospitals, New Delhi",
    rating: 4.9,
    reviews: 218,
    fee: "₹800",
    availableSlots: ["10:30 AM", "12:00 PM", "04:30 PM", "06:00 PM"],
    regNo: "MCI-48291",
    image: "/doctors/doc-1.svg"
  },
  {
    id: "doc-2",
    name: "Dr. Anjali Nair",
    qualification: "MBBS, DCH, MD (Pediatrics)",
    specialty: "Pediatrician & Child Specialist",
    experience: "11+ Years Exp",
    hospital: "Max Healthcare, Bengaluru",
    rating: 4.9,
    reviews: 312,
    fee: "₹750",
    availableSlots: ["09:30 AM", "11:00 AM", "03:00 PM", "05:30 PM"],
    regNo: "MCI-39102",
    image: "/doctors/doc-2.svg"
  },
  {
    id: "doc-3",
    name: "Dr. Vikram Sethi",
    qualification: "MBBS, MS (Orthopedics), MCh",
    specialty: "Orthopedic & Joint Surgeon",
    experience: "18+ Years Exp",
    hospital: "Fortis Memorial, Gurugram",
    rating: 4.8,
    reviews: 189,
    fee: "₹1,000",
    availableSlots: ["11:30 AM", "02:00 PM", "04:00 PM"],
    regNo: "MCI-52019",
    image: "/doctors/doc-3.svg"
  },
  {
    id: "doc-4",
    name: "Dr. Priya Deshmukh",
    qualification: "MBBS, MD (Dermatology)",
    specialty: "Dermatologist & Skin Specialist",
    experience: "9+ Years Exp",
    hospital: "Lilavati Hospital, Mumbai",
    rating: 4.9,
    reviews: 164,
    fee: "₹900",
    availableSlots: ["10:00 AM", "01:30 PM", "05:00 PM"],
    regNo: "MCI-61042",
    image: "/doctors/doc-4.svg"
  }
];

function DoctorAvatar({ doc }) {
  const [hasError, setHasError] = useState(false);
  const initials = doc.name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2);

  if (hasError) {
    return (
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-700 to-emerald-800 text-white flex flex-col items-center justify-center font-black border border-teal-500/40 shadow-xs shrink-0">
        <Stethoscope className="w-4 h-4 text-emerald-300 mb-0.5" />
        <span className="text-xs tracking-wider">{initials}</span>
      </div>
    );
  }

  return (
    <img 
      src={doc.image} 
      alt={doc.name}
      onError={() => setHasError(true)}
      className="w-16 h-16 rounded-2xl object-cover border border-teal-600/30 dark:border-teal-700/50 shrink-0 bg-teal-950/40 shadow-xs" 
    />
  );
}

// Helper to generate next 5 upcoming days
const getUpcomingDays = () => {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const label = i === 0 
      ? `Today, ${d.getDate()} ${monthNames[d.getMonth()]}` 
      : i === 1 
      ? `Tomorrow, ${d.getDate()} ${monthNames[d.getMonth()]}` 
      : `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]}`;
    
    const shortFormatted = `${d.getDate()} ${monthNames[d.getMonth()].toUpperCase()}`;
    const dateKey = d.toISOString().split('T')[0];

    days.push({
      key: dateKey,
      label,
      shortFormatted,
      fullDate: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    });
  }
  return days;
};

export function DoctorBrowser({ onBookAppointment, selectedLang, isDarkMode = false }) {
  const isHindi = selectedLang === 'hi';
  const upcomingDays = getUpcomingDays();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  
  // Custom day per doctor: map docId -> day object
  const [selectedDays, setSelectedDays] = useState(() => {
    const initial = {};
    SEED_DOCTORS.forEach(doc => {
      // Default to Tomorrow or Today
      initial[doc.id] = upcomingDays[1] || upcomingDays[0];
    });
    return initial;
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const specialties = ["All", "General Medicine", "Pediatrician", "Orthopedic", "Dermatologist"];

  const filteredDoctors = SEED_DOCTORS.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpec = selectedSpecialty === 'All' || doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpec;
  });

  const handleConfirmBooking = (doc) => {
    const currentDay = selectedDays[doc.id] || upcomingDays[1] || upcomingDays[0];
    
    if (!selectedSlot || selectedDoctor?.id !== doc.id) {
      alert("Please select a time slot for " + doc.name + " first.");
      return;
    }

    const newApt = {
      id: "apt-" + Math.floor(1000 + Math.random() * 9000),
      doctorId: doc.id,
      doctorName: doc.name,
      specialty: doc.specialty,
      consultationType: "In-clinic consultation",
      date: currentDay.shortFormatted,
      fullDate: currentDay.fullDate,
      dayLabel: currentDay.label,
      time: selectedSlot,
      room: "Room " + (100 + Math.floor(Math.random() * 200)),
      amount: parseInt(doc.fee.replace(/[^0-9]/g, '')),
      status: "Confirmed"
    };

    onBookAppointment(newApt);
    setBookingSuccess(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setSelectedDoctor(null);
      setSelectedSlot('');
      setBookingSuccess(false);
    }, 2000);
  };

  // Color tokens based on isDarkMode
  const headerBg = isDarkMode ? "bg-[#0a231f] border-[#133d36] text-white" : "bg-white border-[#e8e6df] text-[#1c2726]";
  const cardBg = isDarkMode ? "bg-[#0a231f] border-[#133d36] text-white hover:border-teal-500/50" : "bg-white border-[#e8e6df] text-[#1c2726] hover:border-[#0f3e3a]";
  const searchInputBg = isDarkMode ? "bg-[#071d19] border-[#133d36] text-white placeholder:text-slate-500 focus:border-teal-500" : "bg-[#f6f5ef] border-[#e8e6df] text-slate-800 focus:border-[#0f3e3a]";
  const dividerBorder = isDarkMode ? "border-[#133d36]" : "border-[#f1f0e9]";

  return (
    <div className={`space-y-6 animate-fade-in ${isDarkMode ? 'text-slate-100' : 'text-[#1c2726]'}`}>
      
      {/* Header Banner */}
      <div className={`${headerBg} rounded-3xl border p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors`}>
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Verified Physician Network</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-normal font-serif-heading ${isDarkMode ? 'text-white' : 'text-[#0f3e3a]'}`}>
            Book a Doctor Consultation
          </h2>
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-teal-200/70' : 'text-slate-500'}`}>
            Certified Medical Council registered specialists for OPD visits and tele-verification.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor or specialty..."
            className={`w-full ${searchInputBg} rounded-xl pl-10 pr-4 py-2 text-xs transition-colors focus:outline-none`}
          />
        </div>
      </div>

      {/* Specialty Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              selectedSpecialty === spec
                ? isDarkMode 
                  ? 'bg-teal-600 text-white shadow-xs border border-teal-500'
                  : 'bg-[#0f3e3a] text-white shadow-xs'
                : isDarkMode
                  ? 'bg-[#0a231f] text-slate-300 border border-[#133d36] hover:border-teal-500/50'
                  : 'bg-white text-slate-600 border border-[#e8e6df] hover:border-slate-400'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDoctors.map((doc) => {
          const activeDay = selectedDays[doc.id] || upcomingDays[1] || upcomingDays[0];

          return (
            <div 
              key={doc.id}
              className={`${cardBg} rounded-3xl border p-6 space-y-4 shadow-xs transition-all flex flex-col justify-between`}
            >
              <div className="space-y-4">
                {/* Doctor Bio Row */}
                <div className="flex items-start space-x-4">
                  <DoctorAvatar doc={doc} />

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-base font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#0f3e3a]'}`}>
                        {doc.name}
                      </h3>
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        ★ {doc.rating}
                      </span>
                    </div>

                    <p className={`text-xs font-medium ${isDarkMode ? 'text-teal-300' : 'text-slate-600'}`}>{doc.specialty}</p>
                    <p className={`text-[11px] font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>{doc.qualification} • {doc.experience}</p>
                    
                    <div className={`flex items-center space-x-2 text-[11px] pt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.hospital}</span>
                    </div>
                  </div>
                </div>

                {/* 1. CUSTOMIZABLE DAY SELECTOR (Above Time Slots) */}
                <div className={`space-y-2 pt-2 border-t ${dividerBorder}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold block uppercase tracking-wider ${isDarkMode ? 'text-teal-300' : 'text-[#0f3e3a]'}`}>
                      1. Select Consultation Day:
                    </span>
                    <span className={`text-[11px] font-medium font-mono ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      {activeDay.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                    {upcomingDays.map((day) => {
                      const isDaySelected = activeDay.key === day.key;
                      return (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => {
                            setSelectedDays(prev => ({ ...prev, [doc.id]: day }));
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer font-medium border ${
                            isDaySelected
                              ? isDarkMode
                                ? 'bg-teal-600 border-teal-500 text-white font-bold shadow-xs'
                                : 'bg-[#0f3e3a] border-[#0f3e3a] text-white font-bold shadow-xs'
                              : isDarkMode
                                ? 'bg-[#071d19] border-[#133d36] text-slate-300 hover:border-teal-500/50'
                                : 'bg-[#faf9f5] border-[#e8e6df] text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. TIME SLOTS SELECTOR */}
                <div className="space-y-2 pt-1">
                  <span className={`text-[11px] font-bold block uppercase tracking-wider ${isDarkMode ? 'text-teal-300' : 'text-[#0f3e3a]'}`}>
                    2. Available Time Slots ({activeDay.shortFormatted}):
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
                    {doc.availableSlots.map((slot) => {
                      const isSelected = selectedDoctor?.id === doc.id && selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setSelectedSlot(slot);
                          }}
                          className={`py-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? isDarkMode
                                ? 'bg-emerald-600 text-white font-bold border-emerald-500 shadow-xs'
                                : 'bg-[#0f3e3a] text-white font-bold border-[#0f3e3a]'
                              : isDarkMode
                                ? 'bg-[#071d19] border-[#133d36] text-slate-300 hover:border-teal-500/50'
                                : 'bg-[#faf9f5] border-[#e8e6df] text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Price and Book Action */}
              <div className={`pt-3 border-t ${dividerBorder} flex items-center justify-between`}>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Consultation Fee</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#0f3e3a]'}`}>{doc.fee}</span>
                </div>

                <button
                  onClick={() => handleConfirmBooking(doc)}
                  className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-all cursor-pointer shadow-xs flex items-center space-x-1.5 ${
                    isDarkMode 
                      ? 'bg-teal-600 hover:bg-teal-500' 
                      : 'bg-[#0f3e3a] hover:bg-[#134e4a]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Book for {activeDay.shortFormatted}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
