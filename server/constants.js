// Server-side database models and schemas for Prescripto Full Stack Platform

export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin'
};

export const DOCTOR_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
};

export const PRESCRIPTION_STATUS = {
  UPLOADED: 'uploaded',
  AI_EXTRACTED: 'ai_extracted',
  VERIFICATION_REQUESTED: 'verification_requested',
  DOCTOR_VERIFIED: 'doctor_verified',
  DOCTOR_REJECTED: 'doctor_rejected',
  UNREADABLE: 'unreadable'
};

export const CONFIDENCE_LEVELS = {
  HIGH: 'green',     // 85-100%
  MEDIUM: 'yellow',  // 60-84%
  LOW: 'red'         // <60%
};
