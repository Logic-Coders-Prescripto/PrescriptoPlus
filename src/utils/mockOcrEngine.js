import { SRINIVAS_PRESCRIPTION } from '../data/samplePrescriptions';

const STORAGE_KEY = 'prescripto_plus_memory_prescription';

export const getSavedPrescription = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SRINIVAS_PRESCRIPTION));
      return SRINIVAS_PRESCRIPTION;
    }
    return JSON.parse(raw);
  } catch {
    return SRINIVAS_PRESCRIPTION;
  }
};

export const savePrescriptionToStorage = (prescription) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prescription));
    return prescription;
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
    return prescription;
  }
};

export const parseCustomPrescription = (fileName, imagePreviewUrl) => {
  return {
    ...SRINIVAS_PRESCRIPTION,
    id: 'rx-scanned-' + Date.now().toString(36),
    title: `Scanned Prescription: ${fileName || 'Dr. Y. Nagendar Rao Rx'}`,
    imagePreview: imagePreviewUrl || '/prescription_srinivas.jpg'
  };
};
