import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractPrescriptionData } from './services/aiExtractionService.js';
import { generateHindiMedicineInstruction, generateFullScheduleHindiAudioTranscript } from './services/hindiVoiceService.js';
import { USER_ROLES, DOCTOR_STATUS, PRESCRIPTION_STATUS } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

function loadDatabase() {
  const defaultDb = {
    users: [
      {
        id: 'usr-1',
        name: 'Dev Soni',
        email: 'prescriptoplus@customersupport.com',
        role: USER_ROLES.PATIENT,
        age: 20,
        gender: 'Male',
        phone: '9876543210',
        abhaId: '91-4521-8930-1124',
        createdAt: '2026-09-01T00:00:00.000Z'
      },
      {
        id: 'doc-1',
        name: 'Dr. Rajesh Sharma',
        email: 'rajesh@apollo.com',
        role: USER_ROLES.DOCTOR,
        qualification: 'MBBS, MD (Medicine)',
        specialty: 'General Physician & Pulmonologist',
        regNo: 'MCI-48291',
        medicalCouncil: 'Medical Council of India',
        state: 'Delhi',
        hospital: 'Apollo Hospitals, New Delhi',
        status: DOCTOR_STATUS.VERIFIED,
        verificationDate: '2024-01-15',
        experience: '14 Years',
        fee: 800,
        slots: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'],
        earnings: 45600,
        totalPatients: 142
      },
      {
        id: 'doc-2',
        name: 'Dr. Anjali Nair',
        email: 'anjali@max.com',
        role: USER_ROLES.DOCTOR,
        qualification: 'MBBS, DCH, MD (Pediatrics)',
        specialty: 'Pediatrician & Child Healthcare',
        regNo: 'MCI-39102',
        medicalCouncil: 'Medical Council of India',
        state: 'Karnataka',
        hospital: 'Max Healthcare, Bengaluru',
        status: DOCTOR_STATUS.VERIFIED,
        verificationDate: '2024-02-10',
        experience: '11 Years',
        fee: 700,
        slots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:00 PM'],
        earnings: 38500,
        totalPatients: 98
      },
      {
        id: 'doc-3',
        name: 'Dr. Vikram Sethi',
        email: 'vikram@fortis.com',
        role: USER_ROLES.DOCTOR,
        qualification: 'MBBS, MS (Ortho), MCh',
        specialty: 'Orthopedics & Spine Surgeon',
        regNo: 'MCI-52019',
        medicalCouncil: 'Delhi Medical Council',
        state: 'Delhi',
        hospital: 'Fortis Memorial, Gurugram',
        status: DOCTOR_STATUS.PENDING,
        verificationDate: null,
        experience: '16 Years',
        fee: 1000,
        slots: ['11:00 AM', '01:00 PM', '04:00 PM'],
        earnings: 0,
        totalPatients: 0
      },
      {
        id: 'admin-1',
        name: 'Dr. Alok Verma (Admin)',
        email: 'admin@prescripto.com',
        role: USER_ROLES.ADMIN
      }
    ],
    prescriptions: [],
    dosageRoutines: [],
    appointments: [
      {
        id: 'apt-101',
        patientId: 'usr-1',
        patientName: 'Dev Soni',
        doctorId: 'doc-1',
        doctorName: 'Dr. Rajesh Sharma',
        specialty: 'General Physician & Pulmonologist',
        date: '2026-09-25',
        time: '10:30 AM',
        amount: 800,
        status: 'Confirmed',
        isCompleted: false
      }
    ],
    auditLogs: []
  };

  if (!fs.existsSync(DB_FILE)) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
      return defaultDb;
    } catch (e) {
      console.error('Failed to initialize DB file:', e);
      return defaultDb;
    }
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    parsed.users = parsed.users || defaultDb.users;
    parsed.prescriptions = parsed.prescriptions || [];
    parsed.dosageRoutines = parsed.dosageRoutines || [];
    parsed.appointments = parsed.appointments || defaultDb.appointments;
    parsed.auditLogs = parsed.auditLogs || [];
    return parsed;
  } catch (err) {
    console.error('Error reading DB_FILE, falling back to default:', err);
    return defaultDb;
  }
}

const db = loadDatabase();

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB to disk:', err);
  }
}

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Helper: Add Audit Log
function logAction(userId, role, action, details) {
  db.auditLogs.unshift({
    id: `log-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    userId,
    role,
    action,
    details,
    timestamp: new Date().toISOString()
  });
  saveDb();
}

// In-Memory Temporary OTP Store
const otpStore = new Map();
const TWO_FACTOR_API_KEY = process.env.TWO_FACTOR_KEY || '';

if (!TWO_FACTOR_API_KEY) {
  console.warn('[WARNING] TWO_FACTOR_KEY environment variable is not set. OTP voice calls will fail until you set it (see .env.example).');
}

// -------------------------------------------------------------
// 1. AUTHENTICATION & AUTOMATED VOICE CALL OTP API (2Factor.in)
// -------------------------------------------------------------

app.post('/api/auth/send-otp', async (req, res) => {
  const { phone, identifier, name, mode = 'signin' } = req.body;
  const input = (identifier || phone || '').trim();

  if (!input) {
    return res.status(400).json({ success: false, message: 'Valid 10-digit Mobile Number or Unique ABHA ID is required.' });
  }

  let cleanPhone = '';
  let targetUser = null;
  const digitsOnly = input.replace(/\D/g, '');

  // 1. If input has formatting (like 91-xxxx or ABHA-) or doesn't match standard 10 digit, search by ABHA ID or user ID
  if (input.includes('-') || input.toLowerCase().startsWith('91-') || input.toLowerCase().startsWith('abha') || digitsOnly.length > 10) {
    const normalized = input.toLowerCase();
    targetUser = db.users.find(u => 
      (u.abhaId && u.abhaId.toLowerCase() === normalized) ||
      (u.abhaId && u.abhaId.replace(/\D/g, '') === digitsOnly) ||
      (u.id && u.id.toLowerCase() === normalized)
    );

    if (targetUser && targetUser.phone) {
      cleanPhone = targetUser.phone.replace(/\D/g, '').slice(-10);
    } else if (mode === 'signin') {
      return res.status(404).json({
        success: false,
        message: `No registered account found with Unique ID "${input}". Please complete New Registration (Sign Up) first.`
      });
    }
  } else {
    // 2. Input is a phone number (10 digits)
    cleanPhone = digitsOnly.slice(-10);
    if (cleanPhone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit mobile number or full Unique ABHA ID.' });
    }
    targetUser = db.users.find(u => u.phone && u.phone.replace(/\D/g, '').slice(-10) === cleanPhone);
  }

  // STRICT DATABASE VERIFICATION RULE:
  // If user is trying to Sign In, their mobile number/ABHA ID MUST already exist in the database!
  if (mode === 'signin' && !targetUser) {
    return res.status(404).json({
      success: false,
      message: `Mobile number +91 ${cleanPhone} is not registered in our database. Please complete New Registration (Sign Up) first.`
    });
  }

  // If user is trying to Sign Up (New Registration), prevent duplicate registration
  if (mode === 'signup' && targetUser) {
    return res.status(400).json({
      success: false,
      message: `Mobile number +91 ${cleanPhone} is already registered under patient name "${targetUser.name}". Please switch to "Existing User (Sign In)" to log in.`
    });
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(cleanPhone, {
    otp: generatedOtp,
    expiresAt: Date.now() + 5 * 60 * 1000,
    userId: targetUser?.id,
    abhaId: targetUser?.abhaId
  });

  console.log(`[AUTOMATED VOICE CALL] Triggering phone call with OTP ${generatedOtp} to registered number +91 ${cleanPhone} (Identifier: ${input}, Mode: ${mode})`);

  try {
    // Automated Voice Call Dispatch via 2Factor.in (Calls ANY phone number without DLT restriction)
    const voiceUrl = `https://2factor.in/API/V1/${TWO_FACTOR_API_KEY}/VOICE/${cleanPhone}/${generatedOtp}`;
    const response = await fetch(voiceUrl, { method: 'GET' });
    const data = await response.json();
    console.log('[2Factor.in Voice Response]:', data);

    if (data && data.Status === 'Success') {
      return res.json({ 
        success: true, 
        phone: cleanPhone,
        maskedPhone: `••••••${cleanPhone.slice(-4)}`,
        userName: targetUser?.name || name || 'Patient',
        abhaId: targetUser?.abhaId || input,
        userRole: targetUser?.role || 'patient',
        message: `Automated phone call placed to registered mobile +91 ••••• •${cleanPhone.slice(-4)}. Please answer the call to hear your OTP.`,
        provider: '2Factor.in Automated Voice Gateway',
        sessionId: data.Details,
        otp: generatedOtp 
      });
    } else {
      console.warn('Voice API response issue:', data);
      return res.status(400).json({
        success: false,
        message: data?.Details || 'Could not place phone call. Please check the mobile number format.'
      });
    }
  } catch (err) {
    console.warn('Voice call trigger error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to trigger automated phone call. Please try again.'
    });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, identifier, otp, mode = 'signin' } = req.body;
  let cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);

  // If cleanPhone is invalid but identifier is provided, resolve from DB
  if ((!cleanPhone || cleanPhone.length !== 10) && identifier) {
    const digitsOnly = identifier.replace(/\D/g, '');
    const normalized = identifier.toLowerCase();
    const targetUser = db.users.find(u => 
      (u.abhaId && u.abhaId.toLowerCase() === normalized) ||
      (u.abhaId && u.abhaId.replace(/\D/g, '') === digitsOnly) ||
      (u.id && u.id.toLowerCase() === normalized)
    );
    if (targetUser && targetUser.phone) {
      cleanPhone = targetUser.phone.replace(/\D/g, '').slice(-10);
    }
  }

  const record = otpStore.get(cleanPhone);

  if (!record) {
    return res.status(400).json({ success: false, message: 'No active OTP request found for this number. Please click Resend OTP.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanPhone);
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new OTP.' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP code. Please enter the exact 6-digit code received on the call.' });
  }

  // OTP is strictly verified - destroy from memory to prevent replay attacks
  otpStore.delete(cleanPhone);
  const matchedUser = db.users.find(u => u.phone && u.phone.replace(/\D/g, '').slice(-10) === cleanPhone);

  // Reject signin if not found in database
  if (mode === 'signin' && !matchedUser) {
    return res.status(404).json({
      success: false,
      message: 'Account not found in registered database. Please complete New Registration (Sign Up) first.'
    });
  }

  return res.json({ 
    success: true, 
    phone: cleanPhone,
    user: matchedUser,
    message: 'Phone number verified successfully!' 
  });
});

// -------------------------------------------------------------
// PERSISTENT USER SESSION ENDPOINTS (One-Time Login)
// -------------------------------------------------------------

app.post('/api/auth/session', (req, res) => {
  const { phone, name, abhaId, age, gender, role, mode = 'signin' } = req.body;
  const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);

  if (!cleanPhone && !abhaId && !name) {
    return res.status(400).json({ success: false, message: 'Phone, ABHA ID or Name is required' });
  }

  // Find existing user by phone or abhaId
  let user = db.users.find(u => 
    (cleanPhone && u.phone && u.phone.slice(-10) === cleanPhone) ||
    (abhaId && u.abhaId === abhaId)
  );

  // If signing in, do NOT automatically create a new user!
  if (mode === 'signin' && !user) {
    return res.status(404).json({
      success: false,
      message: 'Account not found in database. Sign in is only permitted for existing registered patients.'
    });
  }

  if (user) {
    // Update existing profile (avoid overriding with generic fallback)
    if (name && name.trim() && name.trim() !== 'Patient') user.name = name.trim();
    if (age) user.age = Number(age) || user.age;
    if (gender) user.gender = gender;
    if (abhaId && !user.abhaId) user.abhaId = abhaId;
    if (role) user.role = role;
  } else {
    // Create new registered user in disk database (only for signup)
    user = {
      id: `usr-${Date.now()}`,
      name: (name || 'Registered Patient').trim(),
      phone: cleanPhone || '9876543210',
      abhaId: abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      email: 'prescriptoplus@customersupport.com',
      age: Number(age) || 20,
      gender: gender || 'Male',
      role: role || USER_ROLES.PATIENT,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
  }

  // Create persistent session token
  const token = `sess_${user.id}_${Buffer.from(user.phone || 'prescripto').toString('base64')}`;
  user.sessionToken = token;
  user.lastActiveAt = new Date().toISOString();

  saveDb();
  logAction(user.id, user.role, 'SESSION_CREATED', `Persistent session created for ${user.name}`);

  return res.json({
    success: true,
    user,
    token,
    message: 'User session persisted successfully'
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer ')) 
    ? authHeader.split(' ')[1] 
    : req.query.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No session token provided' });
  }

  const tokenUserId = token.startsWith('sess_') ? token.split('_')[1] : null;
  const user = db.users.find(u => u.sessionToken === token || (tokenUserId && u.id === tokenUserId));
  if (!user) {
    return res.status(401).json({ success: false, message: 'Session expired or not found' });
  }

  user.lastActiveAt = new Date().toISOString();
  saveDb();

  return res.json({ success: true, user });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer ')) 
    ? authHeader.split(' ')[1] 
    : req.body?.token;

  if (token) {
    const user = db.users.find(u => u.sessionToken === token);
    if (user) {
      delete user.sessionToken;
      saveDb();
    }
  }

  return res.json({ success: true, message: 'Logged out successfully' });
});

// -------------------------------------------------------------
// PERSISTENT USER PRESCRIPTIONS & DOSAGE ROUTINES
// -------------------------------------------------------------

app.get('/api/prescriptions/user/:userId', (req, res) => {
  const { userId } = req.params;
  const list = db.prescriptions.filter(p => p.patientId === userId || p.userId === userId);
  return res.json({ success: true, data: list });
});

app.post('/api/prescriptions/save', (req, res) => {
  const { userId, prescription } = req.body;
  if (!prescription) {
    return res.status(400).json({ success: false, message: 'Prescription data required' });
  }

  const rxId = prescription.id || `rx-${Date.now()}`;
  const existingIdx = db.prescriptions.findIndex(p => p.id === rxId);

  const rxRecord = {
    ...prescription,
    id: rxId,
    patientId: userId || prescription.patientId || 'usr-1',
    userId: userId || prescription.userId || 'usr-1',
    updatedAt: new Date().toISOString(),
    createdAt: prescription.createdAt || new Date().toISOString()
  };

  if (existingIdx >= 0) {
    db.prescriptions[existingIdx] = rxRecord;
  } else {
    db.prescriptions.unshift(rxRecord);
  }

  saveDb();
  logAction(rxRecord.patientId, USER_ROLES.PATIENT, 'SAVE_PRESCRIPTION', `Prescription ${rxId} saved to database`);

  return res.json({ success: true, data: rxRecord });
});

app.get('/api/reminders/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userRoutines = db.dosageRoutines.filter(r => r.userId === userId);
  return res.json({ success: true, data: userRoutines });
});

app.post('/api/reminders/sync', (req, res) => {
  const { userId, schedulePeriods, routines } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required' });
  }

  // Remove previous routines for user and replace with updated state
  db.dosageRoutines = db.dosageRoutines.filter(r => r.userId !== userId);
  const newRecord = {
    id: `routine-${Date.now()}`,
    userId,
    schedulePeriods: schedulePeriods || routines || [],
    updatedAt: new Date().toISOString()
  };
  db.dosageRoutines.push(newRecord);

  saveDb();
  logAction(userId, USER_ROLES.PATIENT, 'SYNC_ROUTINES', `Dosage routines updated for ${userId}`);

  return res.json({ success: true, data: newRecord });
});

app.get('/api/doctors', (req, res) => {
  const doctors = db.users.filter(u => u.role === USER_ROLES.DOCTOR && u.status === DOCTOR_STATUS.VERIFIED);
  res.json({ success: true, data: doctors });
});

app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  const user = db.users.find(u => u.email === email || u.role === role);
  if (user) {
    logAction(user.id, user.role, 'LOGIN_SUCCESS', `User ${user.name} logged in`);
    return res.json({ success: true, user, token: 'mock-jwt-token-' + user.id });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// -------------------------------------------------------------
// 2. APPOINTMENTS API
// -------------------------------------------------------------

app.get('/api/appointments/my', (req, res) => {
  const { userId, role } = req.query;
  let list = [];
  if (role === USER_ROLES.DOCTOR) {
    list = db.appointments.filter(a => a.doctorId === userId);
  } else {
    list = db.appointments.filter(a => (a.patientId === userId || !userId) && a.status !== 'Cancelled');
  }
  res.json({ success: true, data: list });
});

app.post('/api/appointments/book', (req, res) => {
  const { patientId, patientName, doctorId, date, time } = req.body;
  const doctor = db.users.find(u => u.id === doctorId);
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

  const newAppointment = {
    id: 'apt-' + Date.now(),
    patientId: patientId || 'usr-1',
    patientName: patientName || 'Patient',
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    date,
    time,
    amount: doctor.fee || 750,
    status: 'Confirmed',
    isCompleted: false
  };

  db.appointments.unshift(newAppointment);
  logAction(patientId, USER_ROLES.PATIENT, 'BOOK_APPOINTMENT', `Booked with ${doctor.name} for ${date} at ${time}`);
  res.json({ success: true, data: newAppointment });
});

app.post('/api/appointments/:id/cancel', (req, res) => {
  const { id } = req.params;
  const apt = db.appointments.find(a => a.id === id);
  if (apt) {
    apt.status = 'Cancelled';
    logAction(apt.patientId, USER_ROLES.PATIENT, 'CANCEL_APPOINTMENT', `Cancelled appointment ${id}`);
    return res.json({ success: true, message: 'Appointment cancelled successfully' });
  }
  res.status(404).json({ success: false, message: 'Appointment not found' });
});

// -------------------------------------------------------------
// 3. PRESCRIPTION UPLOAD & AI EXTRACTION API
// -------------------------------------------------------------

app.post('/api/prescriptions/upload', async (req, res) => {
  try {
    const { patientId, uploadedFile, consent, filename } = req.body;

    if (!consent) {
      return res.status(400).json({
        success: false,
        message: 'Mandatory patient consent is required before processing health prescriptions.'
      });
    }

    if (!uploadedFile) {
      return res.status(400).json({ success: false, message: 'No prescription file provided.' });
    }

    // Call AI Extraction Service with Confidence Classifications
    const extractionResult = await extractPrescriptionData(uploadedFile, { filename });

    const newPrescription = {
      id: 'rx-' + Date.now(),
      patientId: patientId || 'usr-1',
      uploadedFile,
      filename: filename || 'prescription.jpg',
      consent: true,
      consentTimestamp: new Date().toISOString(),
      extraction: extractionResult,
      overallConfidence: extractionResult.overallConfidence,
      status: PRESCRIPTION_STATUS.AI_EXTRACTED,
      patientCorrections: null,
      verificationRequest: null,
      verifiedData: null,
      verifiedBy: null,
      verifiedAt: null,
      createdAt: new Date().toISOString()
    };

    db.prescriptions.unshift(newPrescription);
    logAction(patientId, USER_ROLES.PATIENT, 'UPLOAD_PRESCRIPTION', `Prescription ${newPrescription.id} extracted with ${extractionResult.overallConfidence}% confidence`);

    res.json({ success: true, data: newPrescription });
  } catch (err) {
    console.error('Prescription processing error:', err);
    res.status(500).json({ success: false, message: 'AI Extraction Service Error' });
  }
});

app.get('/api/prescriptions/:id', (req, res) => {
  const rx = db.prescriptions.find(p => p.id === req.params.id);
  if (rx) return res.json({ success: true, data: rx });
  res.status(404).json({ success: false, message: 'Prescription not found' });
});

// Request Doctor Verification
app.post('/api/prescriptions/:id/request-verification', (req, res) => {
  const rx = db.prescriptions.find(p => p.id === req.params.id);
  if (!rx) return res.status(404).json({ success: false, message: 'Prescription not found' });

  rx.status = PRESCRIPTION_STATUS.VERIFICATION_REQUESTED;
  rx.verificationRequest = {
    requestedAt: new Date().toISOString(),
    assignedDoctorId: 'doc-1', // Default queue assignment
    assignedDoctorName: 'Dr. Rajesh Sharma'
  };

  logAction(rx.patientId, USER_ROLES.PATIENT, 'REQUEST_DOCTOR_VERIFICATION', `Prescription ${rx.id} queued for doctor verification`);
  res.json({ success: true, message: 'Verification request submitted to verified doctor queue.', data: rx });
});

// -------------------------------------------------------------
// 4. DOCTOR VERIFICATION WORKFLOW API
// -------------------------------------------------------------

app.get('/api/doctor/verification-requests', (req, res) => {
  const list = db.prescriptions.filter(p => p.status === PRESCRIPTION_STATUS.VERIFICATION_REQUESTED || p.status === PRESCRIPTION_STATUS.DOCTOR_VERIFIED);
  res.json({ success: true, data: list });
});

app.post('/api/doctor/verify/:id', (req, res) => {
  const { id } = req.params;
  const { doctorId, decision, correctedMedicines, doctorNote, rejectionReason } = req.body;
  const rx = db.prescriptions.find(p => p.id === id);
  if (!rx) return res.status(404).json({ success: false, message: 'Prescription not found' });

  const doctor = db.users.find(u => u.id === (doctorId || 'doc-1'));

  if (decision === 'approve') {
    rx.status = PRESCRIPTION_STATUS.DOCTOR_VERIFIED;
    rx.verifiedData = {
      medicines: correctedMedicines || rx.extraction.medicines,
      doctorNote: doctorNote || 'Prescription transcription verified against original document.',
      approvedBy: doctor.name,
      qualification: doctor.qualification,
      medicalCouncil: doctor.medicalCouncil,
      regNo: doctor.regNo,
      hospital: doctor.hospital,
      signedAt: new Date().toISOString()
    };
    rx.verifiedBy = doctor.name;
    rx.verifiedAt = new Date().toISOString();

    // Generate verified Hindi Audio transcript
    rx.verifiedData.hindiTranscript = generateFullScheduleHindiAudioTranscript(rx.verifiedData.medicines, rx.extraction.patientInfo?.name || 'मरीज');

    logAction(doctor.id, USER_ROLES.DOCTOR, 'APPROVE_PRESCRIPTION', `Doctor ${doctor.name} digitally verified prescription ${rx.id}`);
  } else if (decision === 'unreadable') {
    rx.status = PRESCRIPTION_STATUS.UNREADABLE;
    rx.rejectionReason = rejectionReason || 'Handwriting is unclear. Please upload a clearer photo.';
    logAction(doctor.id, USER_ROLES.DOCTOR, 'MARK_UNREADABLE', `Marked prescription ${rx.id} unreadable`);
  } else {
    rx.status = PRESCRIPTION_STATUS.DOCTOR_REJECTED;
    rx.rejectionReason = rejectionReason || 'Prescription contains safety contraindications.';
    logAction(doctor.id, USER_ROLES.DOCTOR, 'REJECT_PRESCRIPTION', `Rejected prescription ${rx.id}: ${rejectionReason}`);
  }

  res.json({ success: true, message: `Prescription verification updated to ${rx.status}`, data: rx });
});

// -------------------------------------------------------------
// 5. MEDICINE STRIP MATCHING API (/scan-medicine)
// -------------------------------------------------------------

app.post('/api/medicine-strip/match', (req, res) => {
  const { stripImageText, verifiedPrescriptionId } = req.body;
  const rx = db.prescriptions.find(p => p.id === verifiedPrescriptionId) || db.prescriptions[0];

  const query = (stripImageText || '').toLowerCase();
  
  if (!rx || !rx.verifiedData) {
    return res.json({
      success: true,
      result: 'Possible Match — Manual Confirmation Required',
      matchStatus: 'warning',
      message: 'Verified prescription not found. Please confirm with your doctor or pharmacist.',
      detectedStripName: 'Paracetamol 650mg'
    });
  }

  const verifiedMeds = rx.verifiedData.medicines || [];
  const found = verifiedMeds.find(m => {
    const name = (m.name?.value || m.brandName || '').toLowerCase();
    const salt = (m.strength?.value || m.genericSalt || '').toLowerCase();
    return query.includes(name) || name.includes(query) || query.includes(salt);
  });

  if (found) {
    res.json({
      success: true,
      result: 'MATCHED ✓',
      matchStatus: 'success',
      matchedMedicine: found.name?.value || found.brandName,
      message: `The scanned strip matches '${found.name?.value || found.brandName}' on your verified prescription.`,
      schedule: found.frequency?.value || found.frequency
    });
  } else {
    res.json({
      success: true,
      result: 'NOT MATCHED ❌',
      matchStatus: 'danger',
      message: 'This medicine does not match your doctor-verified prescription. Do not take this medicine without consulting your doctor or pharmacist.'
    });
  }
});

// -------------------------------------------------------------
// 6. ADMIN PORTAL API
// -------------------------------------------------------------

app.get('/api/admin/doctors/pending', (req, res) => {
  const pending = db.users.filter(u => u.role === USER_ROLES.DOCTOR);
  res.json({ success: true, data: pending });
});

app.post('/api/admin/doctors/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;
  const doc = db.users.find(u => u.id === id);
  if (!doc) return res.status(404).json({ success: false, message: 'Doctor not found' });

  doc.status = status;
  if (rejectionReason) doc.rejectionReason = rejectionReason;
  if (status === DOCTOR_STATUS.VERIFIED) doc.verificationDate = new Date().toISOString().split('T')[0];

  logAction('admin-1', USER_ROLES.ADMIN, 'DOCTOR_STATUS_UPDATE', `Updated ${doc.name} status to ${status}`);
  res.json({ success: true, message: `Doctor status updated to ${status}`, data: doc });
});

app.get('/api/admin/audit-logs', (req, res) => {
  res.json({ success: true, data: db.auditLogs });
});

// -------------------------------------------------------------
// 7. SERVE UNIFIED FRONTEND (Single Website with Everything Connected)
// -------------------------------------------------------------

const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

// Start Express Server
app.listen(PORT, () => {
  console.log(`Prescripto Enterprise Server running on port ${PORT}`);
});

