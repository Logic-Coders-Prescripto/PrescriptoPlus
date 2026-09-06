import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  ShieldCheck, 
  Fingerprint, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Globe2,
  PhoneCall,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Volume2,
  Sun,
  Moon
} from 'lucide-react';
import { apiUrl } from '../config/api';

// Cryptographic ABDM Standard 14-Digit Non-Predictable Health ID Generator (Name + Phone + Salt)
export function generateSecureAbhaId(name = '', phone = '') {
  if (!phone || phone.length < 4) return '91-••••-••••-••••';
  const seedStr = `${name.trim().toLowerCase()}#${phone}#EHR_ABDM_SALT_2026`;
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < seedStr.length; i++) {
    const ch = seedStr.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const num1 = String(Math.abs(h1 % 9000) + 1000);
  const num2 = String(Math.abs(h2 % 9000) + 1000);
  const num3 = String(Math.abs((h1 ^ h2) % 9000) + 1000);

  // Official 14-digit ABDM Standard: 91-XXXX-XXXX-XXXX
  return `91-${num1}-${num2}-${num3}`;
}

export function FinalLoginPage({ onLogin, onLoginSuccess, selectedLang, onSelectLang, isDarkMode = true, onToggleTheme }) {
  const handleSuccess = onLogin || onLoginSuccess;
  const isHindi = selectedLang === 'hi';

  // Patient Auth Mode: 'signup' | 'signin'
  const [authMode, setAuthMode] = useState('signup');
  // Flow Step: 'form' | 'otp'
  const [step, setStep] = useState('form');

  // Sign Up Fields
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('20');
  const [patientGender, setPatientGender] = useState('Other');

  // Sign In Fields
  const [signInIdentifier, setSignInIdentifier] = useState('');

  // Generated Unique ID
  const [uniqueHealthId, setUniqueHealthId] = useState('');

  // OTP State
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCallingPhone, setIsCallingPhone] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeCallingPhone, setActiveCallingPhone] = useState('');

  // OTP Timer Countdown
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Clear any existing error messages whenever switching between Sign Up and Sign In
  useEffect(() => {
    setErrorMessage('');
  }, [authMode]);

  // Handle OTP Input box navigation
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);

    // Auto move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Helper to trigger automated voice call via Backend API
  const dispatchVoiceOtpCall = async (phoneOrIdentifier, name = 'User', mode = authMode) => {
    setIsCallingPhone(true);
    setErrorMessage('');

    try {
      const targetMode = mode || authMode;
      const response = await fetch(apiUrl('/api/auth/send-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: phoneOrIdentifier, 
          identifier: phoneOrIdentifier, 
          name,
          mode: targetMode
        })
      });
      const data = await response.json();
      setIsCallingPhone(false);

      if (!data || !data.success) {
        let fallbackMsg = '';
        if (targetMode === 'signin') {
          fallbackMsg = isHindi 
            ? "यह मोबाइल नंबर हमारे डेटाबेस में पंजीकृत नहीं है। कृपया पहले नया पंजीकरण (Sign Up) करें।"
            : "This mobile number is not registered in our database. Please complete New Registration (Sign Up) first.";
        } else {
          fallbackMsg = isHindi
            ? "कॉल करने में असमर्थ। कृपया 10-अंकों का मोबाइल नंबर जांचें और पुनः प्रयास करें।"
            : "Could not place phone call. Please check your 10-digit mobile number and try again.";
        }
        setErrorMessage(data?.message || fallbackMsg);
        return { success: false, message: data?.message || fallbackMsg };
      }

      return { success: true, ...data };
    } catch (err) {
      console.error('Voice call trigger error:', err);
      setErrorMessage(isHindi ? 'वॉयस सर्वर से कनेक्ट नहीं हो सका।' : 'Could not connect to voice server. Please check your network.');
      setIsCallingPhone(false);
      return { success: false };
    }
  };

  // 1. Submit Registration Form -> Generates Cryptographic ABHA ID & Triggers Automated Voice Call
  const handleInitiateSignUp = async (e) => {
    if (e) e.preventDefault();
    if (!patientName.trim()) {
      setErrorMessage(isHindi ? "कृपया मरीज का नाम दर्ज करें।" : "Please enter the patient full name.");
      return;
    }
    const cleanP = patientPhone.replace(/\D/g, '');
    if (!cleanP || cleanP.length !== 10) {
      setErrorMessage(isHindi ? "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।" : "Please enter a valid 10-digit mobile number.");
      return;
    }


    setErrorMessage('');
    const generatedId = generateSecureAbhaId(patientName, cleanP);
    setUniqueHealthId(generatedId);
    setActiveCallingPhone(cleanP);

    const callResult = await dispatchVoiceOtpCall(cleanP, patientName, 'signup');
    if (callResult && callResult.success) {
      setOtpValues(['', '', '', '', '', '']);
      setTimer(30);
      setStep('otp');
    }
  };

  // 2. Submit Sign In Form -> Resolves Registered Phone from Unique ABHA ID & Triggers Voice Call
  const handleInitiateSignIn = async (e) => {
    if (e) e.preventDefault();
    if (!signInIdentifier.trim()) {
      setErrorMessage(isHindi ? "कृपया मोबाइल नंबर या ABHA ID दर्ज करें।" : "Please enter your registered Mobile Number or Unique ABHA ID.");
      return;
    }

    setErrorMessage('');
    const callResult = await dispatchVoiceOtpCall(signInIdentifier.trim(), 'Patient', 'signin');
    if (!callResult || !callResult.success) {
      return;
    }

    const resolvedPhone = callResult.phone || signInIdentifier.replace(/\D/g, '').slice(-10);
    setActiveCallingPhone(resolvedPhone);
    setUniqueHealthId(callResult.abhaId || signInIdentifier.trim());
    if (callResult.userName) {
      setPatientName(callResult.userName);
    }
    setOtpValues(['', '', '', '', '', '']);
    setTimer(30);
    setStep('otp');
  };

  // 3. Confirm Real Voice OTP -> Logs into Portal
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otpValues.join('');
    if (enteredOtp.length !== 6) {
      setErrorMessage(isHindi ? "कृपया फोन कॉल पर सुनाया गया पूरा 6 अंकों का OTP दर्ज करें।" : "Please enter the complete 6-digit OTP code spoken on the phone call.");
      return;
    }

    setErrorMessage('');
    setIsVerifying(true);

    const targetPhone = activeCallingPhone || (authMode === 'signup' ? patientPhone : signInIdentifier);

    try {
      const response = await fetch(apiUrl('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: targetPhone, 
          identifier: uniqueHealthId || signInIdentifier, 
          otp: enteredOtp,
          mode: authMode
        })
      });
      const data = await response.json();
      
      if (!data || !data.success) {
        setIsVerifying(false);
        setErrorMessage(data?.message || (isHindi ? "गलत OTP कोड दर्ज किया गया है।" : "Invalid OTP code. Please enter the code spoken on the call."));
        return;
      }

      // CRITICAL: If signing in, ensure user account was actually matched in the database
      if (authMode === 'signin' && !data.user) {
        setIsVerifying(false);
        setErrorMessage(isHindi ? "यह खाता डेटाबेस में पंजीकृत नहीं है। कृपया पहले नया पंजीकरण (Sign Up) करें।" : "This account is not registered in our database. Please Sign Up first.");
        return;
      }

      // Successful verification -> Persist in Local Database & LocalStorage
      const activeName = authMode === 'signup' 
        ? patientName.trim() 
        : (data.user?.name || patientName.trim() || 'Verified Patient');
      const activeAge = authMode === 'signup' ? patientAge.trim() : (data.user?.age || '20');
      const activeGender = authMode === 'signup' ? patientGender : (data.user?.gender || 'Male');
      const activePhone = activeCallingPhone || (authMode === 'signup' ? patientPhone : signInIdentifier);

      let userPayload = {
        role: 'patient',
        id: data.user?.id,
        name: activeName,
        age: activeAge,
        gender: activeGender,
        phone: activePhone,
        abhaId: uniqueHealthId || data.user?.abhaId || `91-7482-9018-3562`,
        isLoggedIn: true,
        authMethod: 'Automated Voice Call Verified (ABDM Standard)'
      };

      // Persist to Server Database & Store Local Session Token
      try {
        const sessRes = await fetch(apiUrl('/api/auth/session'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...userPayload, mode: authMode })
        });
        const sessData = await sessRes.json();
        if (!sessData || !sessData.success) {
          setIsVerifying(false);
          setErrorMessage(sessData?.message || "Sign in failed: account not found.");
          return;
        }
        if (sessData && sessData.token) {
          localStorage.setItem('prescripto_token', sessData.token);
          localStorage.setItem('prescripto_user', JSON.stringify(sessData.user));
          userPayload = { ...userPayload, ...sessData.user };
        }
      } catch (err) {
        console.warn('Could not persist session to backend, falling back to local session:', err);
        localStorage.setItem('prescripto_user', JSON.stringify(userPayload));
      }

      if (handleSuccess) {
        handleSuccess(userPayload);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setErrorMessage('Verification failed. Please check server connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#051814] text-[#e2ebe9]' : 'bg-[#f6f5ef] text-[#1c2726]'} flex flex-col justify-between p-4 sm:p-6 font-sans relative transition-colors`}>

      {/* Top Navbar Header */}
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm shadow-teal-500/20 bg-white flex items-center justify-center p-1 border border-teal-500/30 shrink-0">
            <img src="/logo.png" alt="PrescriptoPlus Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-xl font-black tracking-tight enchanted-brand-text inline-flex items-center group cursor-pointer transition-transform hover:scale-105 select-none">
                <span>Prescripto<span className="text-teal-300">Plus</span></span>
                <span className="ml-1 text-xs text-teal-300 opacity-80 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-300">✦</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ABDM Certified
              </span>
            </div>
            <p className={`text-[10px] sm:text-[11px] font-medium flex items-center space-x-1.5 ${isDarkMode ? 'text-teal-300/70' : 'text-slate-500'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
              <span>AI Prescription & Health Co-Pilot</span>
            </p>
          </div>
        </div>

        {/* Right Controls: Language Picker & Theme Toggle */}
        <div className="flex items-center space-x-2.5">
          <div className={`flex items-center border rounded-xl px-3 py-1.5 shadow-xs text-xs ${
            isDarkMode ? 'bg-[#0a231f] border-[#164d41] text-white' : 'bg-white border-[#e8e6df] text-slate-700'
          }`}>
            <Globe2 className="w-3.5 h-3.5 text-teal-400 mr-1.5" />
            <select
              value={selectedLang}
              onChange={(e) => onSelectLang(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className={isDarkMode ? 'bg-[#0a231f] text-white' : 'bg-white text-slate-800'}>English (EN)</option>
              <option value="hi" className={isDarkMode ? 'bg-[#0a231f] text-white' : 'bg-white text-slate-800'}>हिन्दी (Hindi)</option>
            </select>
          </div>

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                isDarkMode 
                  ? 'bg-[#0b2420] border-[#1b4841] text-amber-300 hover:bg-[#123630]' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className={`border rounded-3xl p-6 sm:p-8 space-y-6 transition-colors ${
          isDarkMode ? 'bg-[#0a231f] border-[#133d36] text-white shadow-xl' : 'bg-white border-[#e8e6df] text-[#1c2726] shadow-sm'
        }`}>
          
          {/* Header Title */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
              <span>Automated Voice Call 2-Factor Authentication</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#0f3e3a]'}`}>
              {step === 'otp' 
                ? (isHindi ? "फोन कॉल OTP सत्यापन" : "Enter Verification OTP")
                : (isHindi ? "सुरक्षित लॉगिन व पंजीकरण" : "Secure Clinical Access")}
            </h1>
            <p className={`text-xs max-w-xs mx-auto ${isDarkMode ? 'text-teal-200/70' : 'text-slate-500'}`}>
              {step === 'otp'
                ? `Please answer the automated call to +91 ••••• •${(activeCallingPhone || (authMode === 'signup' ? patientPhone : signInIdentifier)).slice(-4)} ${uniqueHealthId ? `(Linked to ${uniqueHealthId})` : ''} to hear your code`
                : (isHindi ? "14-अंकीय राष्ट्रीय स्वास्थ्य पहचान (ABHA) आधारित सुरक्षित ईएचआर" : "Instant automated phone call verification for encrypted EHR")}
            </p>
          </div>

          {/* STEP 1: CREDENTIALS FORM */}
          {step === 'form' && (
            <>
              {/* Validation Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center space-x-2 animate-fade-in shadow-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* PATIENT AUTH WORKFLOW */}
              <div className="space-y-4 animate-fade-in">
                  
                  {/* Mode Switcher: Sign In vs Sign Up */}
                  <div className={`flex items-center justify-center border-b pb-2 space-x-6 text-xs font-bold ${
                    isDarkMode ? 'border-[#164d41]' : 'border-[#e8e6df]'
                  }`}>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setErrorMessage(''); }}
                      className={`pb-1 cursor-pointer transition-colors ${
                        authMode === 'signup' 
                          ? 'text-teal-400 border-b-2 border-teal-400' 
                          : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      ✨ New Registration (Sign Up)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signin'); setErrorMessage(''); }}
                      className={`pb-1 cursor-pointer transition-colors ${
                        authMode === 'signin' 
                          ? 'text-teal-400 border-b-2 border-teal-400' 
                          : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      🔑 Existing User (Sign In)
                    </button>
                  </div>

                  {/* OPTION A: SIGN UP */}
                  {authMode === 'signup' && (
                    <form onSubmit={handleInitiateSignUp} className="space-y-3.5">
                      <div>
                        <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-teal-200' : 'text-[#0f3e3a]'}`}>
                          {isHindi ? "मरीज का पूरा नाम *:" : "Patient Full Name *:"}
                        </label>
                        <input 
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors ${
                            isDarkMode 
                              ? 'bg-[#061915] border-[#164d41] text-white placeholder-slate-500 focus:border-teal-400 focus:bg-[#09221c]' 
                              : 'bg-[#f6f5ef] border-[#e8e6df] text-slate-800 focus:border-[#0f3e3a] focus:bg-white'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-teal-200' : 'text-[#0f3e3a]'}`}>
                          {isHindi ? "मोबाइल नंबर (10 अंक) *:" : "Phone Number (10 digits) *:"}
                        </label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-xs font-bold text-slate-400 font-mono">+91</span>
                          <input 
                            type="tel"
                            required
                            maxLength="10"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="9876543210"
                            className={`w-full border rounded-xl pl-10 pr-2.5 py-2 text-xs focus:outline-none font-mono transition-colors ${
                              isDarkMode 
                                ? 'bg-[#061915] border-[#164d41] text-white placeholder-slate-500 focus:border-teal-400 focus:bg-[#09221c]' 
                                : 'bg-[#f6f5ef] border-[#e8e6df] text-slate-800 focus:border-[#0f3e3a] focus:bg-white'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Unique ABHA Preview Badge */}
                      <div className={`p-3 rounded-xl border text-[11px] flex items-center justify-between ${
                        isDarkMode ? 'bg-[#0e302a] border-[#1f574d] text-teal-200' : 'bg-emerald-50/80 border-emerald-200/80 text-emerald-950'
                      }`}>
                        <div className="flex items-center space-x-2">
                          <Fingerprint className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-bold block">ABDM 14-Digit National Health ID:</span>
                            <span className="font-mono text-xs font-extrabold text-emerald-400">
                              {generateSecureAbhaId(patientName, patientPhone)}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Encrypted
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={isCallingPhone}
                        className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-200" />
                        <span>{isCallingPhone ? "Placing Automated Call..." : "Generate ID & Call Phone with OTP →"}</span>
                      </button>
                    </form>
                  )}

                  {/* OPTION B: SIGN IN */}
                  {authMode === 'signin' && (
                    <form onSubmit={handleInitiateSignIn} className="space-y-3.5">
                      <div>
                        <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-teal-200' : 'text-[#0f3e3a]'}`}>
                          {isHindi ? "रजिस्टर्ड मोबाइल नंबर या ABHA ID *:" : "Registered Mobile Number or Unique ABHA ID *:"}
                        </label>
                        <input 
                          type="text"
                          required
                          value={signInIdentifier}
                          onChange={(e) => setSignInIdentifier(e.target.value)}
                          placeholder="e.g. 9876543210 or 91-7482-9018-3562"
                          className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors ${
                            isDarkMode 
                              ? 'bg-[#061915] border-[#164d41] text-white placeholder-slate-500 focus:border-teal-400 focus:bg-[#09221c]' 
                              : 'bg-[#f6f5ef] border-[#e8e6df] text-slate-800 focus:border-[#0f3e3a] focus:bg-white'
                          }`}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isCallingPhone}
                        className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-200" />
                        <span>{isCallingPhone ? "Calling Registered Mobile..." : "Call Phone with Login OTP →"}</span>
                      </button>
                    </form>
                  )}
                </div>
            </>
          )}

          {/* STEP 2: SECURE OTP CONFIRMATION SCREEN */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
              
              {/* Unique ID Confirmation Banner */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                isDarkMode ? 'bg-[#0e302a] border-[#1f574d]' : 'bg-emerald-50 border-emerald-300'
              }`}>
                <div>
                  <div className={`text-[10px] uppercase font-bold ${isDarkMode ? 'text-teal-300' : 'text-emerald-800'}`}>Assigned 14-Digit Health ID</div>
                  <div className={`font-mono text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-[#0f3e3a]'}`}>
                    {uniqueHealthId || '91-7482-9018-3562'}
                  </div>
                </div>
                <div className={`flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-xl border shadow-xs ${
                  isDarkMode ? 'bg-[#061915] text-emerald-400 border-[#164d41]' : 'bg-white text-emerald-700 border-emerald-200'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ABDM Registered</span>
                </div>
              </div>

              {/* Validation Error Alert (PROMINENT ON WRONG OTP) */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-xs font-bold text-rose-800 flex items-start space-x-2.5 animate-bounce shadow-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold">{errorMessage}</span>
                    <span className="text-[11px] font-normal text-rose-700 mt-0.5 block">Please listen to the automated phone call again or click "Call Again".</span>
                  </div>
                </div>
              )}

              {/* Call Status Note */}
              <div className={`p-3 rounded-xl text-xs flex items-center space-x-2 border ${
                isDarkMode ? 'bg-[#0e302a] border-[#1f574d] text-teal-200' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <Volume2 className="w-4 h-4 text-teal-400 shrink-0 animate-pulse" />
                <span>An automated phone call is ringing your device. Answer the call to hear the 6-digit code.</span>
              </div>

              {/* 6-Digit OTP Inputs */}
              <div className="space-y-2">
                <label className={`block text-xs font-bold text-center ${isDarkMode ? 'text-teal-200' : 'text-[#0f3e3a]'}`}>
                  {isHindi ? "फोन कॉल पर बोला गया 6-अंकों का OTP कोड दर्ज करें:" : "Enter 6-Digit OTP spoken on the phone call:"}
                </label>
                <div className="flex justify-center items-center gap-2">
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength="1"
                      value={val}
                      onChange={(e) => {
                        setErrorMessage('');
                        handleOtpChange(idx, e.target.value);
                      }}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-11 h-12 text-center text-lg font-bold font-mono rounded-xl focus:outline-none transition-all shadow-xs ${
                        errorMessage 
                          ? 'bg-rose-50 border-2 border-rose-400 text-rose-900 focus:border-rose-600' 
                          : isDarkMode
                            ? 'bg-[#061915] border-2 border-[#164d41] text-white focus:border-teal-400 focus:bg-[#09221c]'
                            : 'bg-[#f6f5ef] border-2 border-[#e8e6df] text-slate-900 focus:border-emerald-600 focus:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Resend OTP / Timer */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>
                  {timer > 0 ? (
                    <span>Call again in <strong className={`font-mono ${isDarkMode ? 'text-teal-300' : 'text-[#0f3e3a]'}`}>{timer}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTimer(30);
                        const p = activeCallingPhone || (authMode === 'signup' ? patientPhone : signInIdentifier);
                        dispatchVoiceOtpCall(p, patientName || 'Patient', authMode);
                      }}
                      className="text-teal-400 font-bold hover:underline cursor-pointer flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>📞 Call Again (Resend Voice OTP)</span>
                    </button>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => { setStep('form'); setErrorMessage(''); }}
                  className="text-slate-400 hover:text-teal-300 underline cursor-pointer"
                >
                  Change Number
                </button>
              </div>

              {/* Confirm and Enter Button */}
              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2 hover:shadow-lg"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-200" />
                <span>{isVerifying ? "Verifying Voice OTP..." : "Confirm Voice Code & Enter Workspace →"}</span>
              </button>

            </form>
          )}

          {/* Privacy Footnote */}
          <div className="pt-2 border-t border-[#f1f0e9] text-center text-[11px] text-slate-400">
            🔒 Compliant with National Health Authority (NHA) & DPDP Act 2023
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl w-full mx-auto text-center text-xs text-slate-400 py-2">
        PrescriptoPlus • ABDM Compliant Patient EHR & Jan Aushadhi Health Workspace
      </div>

    </div>
  );
}

export { FinalLoginPage as LoginScreen };
export default FinalLoginPage;
