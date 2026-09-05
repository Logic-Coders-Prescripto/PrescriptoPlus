// Prescripto Plus - Memory Prescriptions Store
// Sole verified prescription saved in memory as requested

export const SRINIVAS_PRESCRIPTION = {
  id: 'rx-srinivas-2024',
  title: 'Neuro-Psychiatric Prescription (Dr. Y. Nagendar Rao)',
  category: 'Neuro-Psychiatry',
  description: 'Consultation & Medication Regimen by Dr. Y. Nagendar Rao, MD (Psy).',
  doctor: {
    name: 'Dr. Y. NAGENDAR RAO',
    qualifications: 'M.B.B.S (Osm), M.D. (Psy), F.I.P.S',
    specialty: 'Consultant Neuro - Psychiatrist',
    regNo: '8373 (A.P.)',
    clinic: 'Neuro-Psychiatry Clinic',
    address: 'Plot # 89, Sardar Patel Colony, Hashmathpet Road, Trimulgherry / Tirumalagiri, SECUNDERABAD - 500 015',
    phone: 'Resi. 040-27796644',
    emergencyHospital: 'Asha Hospital, Road No. 14, Banjara Hills, Hyderabad (Tel: 66752222, 23542838)'
  },
  patient: {
    name: 'Mr. SRINIVAS',
    age: 41,
    gender: 'Male',
    date: '15-03-2024',
    consultationType: 'Counselled over Phone',
    diagnosis: 'Chr. Schizophrenia (Paranoid), DM, HTN & Hypercholesterolemia (Triglycerides)',
    clinicalNotes: 'Paranoid Dels (+), No Auditory Hallucinations (No AH). Bereavement: Mother expired 3 months back (sad).'
  },
  confidenceScore: 99.2,
  ocrEngine: 'Prescripto Plus DeepVision v3.2',
  imagePreview: '/prescription_srinivas.jpg',
  medications: [
    {
      id: 'med-1',
      brandName: 'Tab Sizodon Plus',
      genericName: 'Risperidone + Trihexyphenidyl',
      strength: 'Standard Duo',
      form: 'Tablet',
      frequency: 'Twice daily (1 - 0 - 1)',
      timing: 'Morning (8 AM) & Night (10 PM)',
      schedule: { morning: true, afternoon: false, evening: false, night: true },
      beforeFood: false,
      duration: '6 Months (Six)',
      instructions: 'Take 1 tablet in morning and 1 tablet at night after food.',
      avgPriceBrand: 8.50,
      avgPriceGeneric: 3.20
    },
    {
      id: 'med-2',
      brandName: 'Tab Qutipin 200mg',
      genericName: 'Quetiapine Fumarate',
      strength: '200 mg',
      form: 'Tablet',
      frequency: 'Once daily at bedtime (0 - 0 - 1)',
      timing: 'Night (10 PM)',
      schedule: { morning: false, afternoon: false, evening: false, night: true },
      beforeFood: false,
      duration: '6 Months (Six)',
      instructions: 'Take 1 tablet strictly at night before sleep.',
      avgPriceBrand: 14.00,
      avgPriceGeneric: 5.00
    },
    {
      id: 'med-3',
      brandName: 'Tab Ativan 2mg',
      genericName: 'Lorazepam',
      strength: '2 mg',
      form: 'Tablet',
      frequency: 'Once daily at bedtime (0 - 0 - 1)',
      timing: 'Night (10 PM)',
      schedule: { morning: false, afternoon: false, evening: false, night: true },
      beforeFood: false,
      duration: '6 Months (Six)',
      instructions: 'Take 1 tablet at night for anxiety and sleep regulation.',
      avgPriceBrand: 6.80,
      avgPriceGeneric: 2.10
    },
    {
      id: 'med-4',
      brandName: 'Tab Rivotril 0.5mg',
      genericName: 'Clonazepam',
      strength: '0.5 mg',
      form: 'Tablet',
      frequency: 'Once daily at bedtime (0 - 0 - 1)',
      timing: 'Night (10 PM)',
      schedule: { morning: false, afternoon: false, evening: false, night: true },
      beforeFood: false,
      duration: '6 Months (Six)',
      instructions: 'Take 1 tablet at night.',
      avgPriceBrand: 5.50,
      avgPriceGeneric: 1.80
    },
    {
      id: 'med-5',
      brandName: 'Tab SERTA 50mg',
      genericName: 'Sertraline Hydrochloride',
      strength: '50 mg',
      form: 'Tablet',
      frequency: 'Once daily at bedtime (0 - 0 - 1)',
      timing: 'Night (10 PM)',
      schedule: { morning: false, afternoon: false, evening: false, night: true },
      beforeFood: false,
      duration: '6 Months (Six)',
      instructions: 'Take 1 tablet at night after food for mood support.',
      avgPriceBrand: 11.20,
      avgPriceGeneric: 3.50
    }
  ],
  doctorNotes: 'Call me in between if any problem. Continue other BP / Sugar medicines etc. Duration: 6 months (Six).',
  emergencyInfo: 'In emergency / if doctor not available, please admit at Asha Hospital, Road No. 14, Banjara Hills, Hyderabad (Tel: 66752222, 23542838)'
};

export const SAMPLE_PRESCRIPTIONS = [SRINIVAS_PRESCRIPTION];
