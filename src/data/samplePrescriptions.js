export const SAMPLE_PRESCRIPTIONS = [
  {
    id: "rx-psychiatrist",
    title: "Neuro-Psychiatry Prescription (Dr. Y. Nagendar Rao)",
    tag: "Clinical Psychiatry & Neuro Rx",
    category: "Psychiatry / Neuro",
    doctor: {
      name: "Dr. Y. Nagendar Rao, MBBS (Osm), M.D. (Psy), F.I.P.S",
      specialty: "Consultant Neuro - Psychiatrist",
      regNo: "Regd. No. 8373 (A.P.)",
      clinic: "Plot #89, Sardar Patel Colony, Hashmathpet Road, Trimulgherry, Secunderabad - 500 015",
      phone: "040-27796644",
      date: "2024-03-15"
    },
    patient: {
      name: "Mr. Srinivas",
      age: "41 Yrs",
      gender: "Male"
    },
    diagnosis: "Chronic Schizophrenia (Paranoid), DM, HTN, Hypercholesterolemia (Trigly+)",
    clinicalNotes: "Paranoid Dels+, No AH, Mother expired 3 months back (sad). Continue other BP / Sugar medicines.",
    advice: "Call me in between, if any problem. Continue other BP / sugar medicines etc.",
    duration: "6 Months (Six)",
    rawImageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800",
    medicines: [
      {
        id: "rx-med-1",
        brandName: "Tab Sizodon Plus",
        genericSalt: "Risperidone (3mg) + Trihexyphenidyl (2mg)",
        type: "Tablet",
        frequency: "1 - 0 - 1 (Twice Daily - Morning & Night)",
        timingCode: "BD",
        foodRelation: "After Food",
        duration: "6 Months",
        purpose: "Antipsychotic + Extrapyramidal symptom management",
        brandedPrice: 95.00,
        genericPrice: 22.00,
        savingPercent: 76.8,
        handwritingText: "Tab. Sizodon Plus  1 - x - 1 (Morning / Night)"
      },
      {
        id: "rx-med-2",
        brandName: "Tab Qutipin 200mg",
        genericSalt: "Quetiapine (200mg)",
        type: "Tablet",
        frequency: "0 - 0 - 1 (Once Daily at Night)",
        timingCode: "HS",
        foodRelation: "At Bedtime / Night",
        duration: "6 Months",
        purpose: "Atypical antipsychotic for mood stabilization",
        brandedPrice: 240.00,
        genericPrice: 45.00,
        savingPercent: 81.3,
        handwritingText: "Tab. Qutipin 200mg  x - x - 1 (Night)"
      },
      {
        id: "rx-med-3",
        brandName: "Tab Ativan (Lorazepam) 2mg",
        genericSalt: "Lorazepam (2mg)",
        type: "Tablet",
        frequency: "0 - 0 - 1 (Once Daily at Night)",
        timingCode: "HS",
        foodRelation: "At Bedtime / Night",
        duration: "6 Months",
        purpose: "Benzodiazepine for anxiety, agitation & sleep regulation",
        brandedPrice: 85.00,
        genericPrice: 18.00,
        savingPercent: 78.8,
        handwritingText: "Tab. Ativan (Lorazepam) 2mg  x - x - 1 (Night)"
      },
      {
        id: "rx-med-4",
        brandName: "Tab Rivotril 0.5mg (Clonazepam)",
        genericSalt: "Clonazepam (0.5mg)",
        type: "Tablet",
        frequency: "0 - 0 - 1 (Once Daily at Night)",
        timingCode: "HS",
        foodRelation: "At Bedtime / Night",
        duration: "6 Months",
        purpose: "Anxiolytic & seizure prevention for sleep stabilization",
        brandedPrice: 62.00,
        genericPrice: 14.00,
        savingPercent: 77.4,
        handwritingText: "Tab. Rivotril 0.5mg (Clonazepam)  x - x - 1 (Night)"
      },
      {
        id: "rx-med-5",
        brandName: "Tab Serta 50mg",
        genericSalt: "Sertraline (50mg)",
        type: "Tablet",
        frequency: "0 - 0 - 1 (Once Daily at Night)",
        timingCode: "HS",
        foodRelation: "At Bedtime / Night",
        duration: "6 Months",
        purpose: "SSRI Antidepressant for mood regulation & depression",
        brandedPrice: 135.00,
        genericPrice: 28.00,
        savingPercent: 79.3,
        handwritingText: "Tab. SERTA 50mg  x - x - 1 (Night)"
      }
    ]
  },
  {
    id: "rx-1",
    title: "Acute Respiratory & Fever (Cursive Rx)",
    tag: "High Handwriting Complexity",
    category: "General Medicine",
    doctor: {
      name: "Dr. Rajesh Sharma, MD",
      specialty: "Internal Medicine & Pulmonology",
      regNo: "MCI-48291",
      clinic: "Apollo Clinic & Chest Care Center, Delhi",
      date: "2026-08-20"
    },
    patient: {
      name: "Aman Verma",
      age: "28 Yrs",
      gender: "Male",
      phone: "+91 98765-XXXXX",
      vitals: "BP: 120/80 mmHg | Pulse: 78 bpm | SpO2: 98%"
    },
    diagnosis: "Acute Bronchitis & High Grade Viral Pyrexia",
    rawImageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800",
    handwritingSnippets: {
      "Augmentin 625": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
      "Dolo 650": "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400",
      "Pan-D": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400",
      "Montair-LC": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400"
    },
    medicines: [
      {
        id: "med-1",
        brandName: "Augmentin 625 Duo",
        genericSalt: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
        type: "Tablet",
        strength: "625 mg",
        frequency: "1-0-1 (Twice daily)",
        timingCode: "BD",
        foodRelation: "Strictly after meals (to prevent gastric distress)",
        duration: "5 Days",
        confidence: 96.4,
        status: "verified",
        purpose: "Antibiotic for chest & bacterial infection",
        schedule: ["morning", "night"],
        brandedPrice: 204.50,
        genericPrice: 42.00,
        handwritingText: "Tab. Augmentin 625mg  1-0-1 x 5d (pc)"
      },
      {
        id: "med-2",
        brandName: "Dolo 650",
        genericSalt: "Paracetamol (Acetaminophen)",
        type: "Tablet",
        strength: "650 mg",
        frequency: "SOS / Max 1-1-1 (When fever > 100°F)",
        timingCode: "SOS",
        foodRelation: "After meals with full glass of water",
        duration: "3 Days / PRN",
        confidence: 98.8,
        status: "verified",
        purpose: "Fever reduction & body ache relief",
        schedule: ["as_needed"],
        brandedPrice: 34.00,
        genericPrice: 9.50,
        handwritingText: "Tab. Dolo 650mg SOS (Max TID)"
      },
      {
        id: "med-3",
        brandName: "Pan-D",
        genericSalt: "Pantoprazole (40mg) + Domperidone (30mg)",
        type: "Capsule",
        strength: "SR 40/30 mg",
        frequency: "1-0-0 (Once daily in morning)",
        timingCode: "OD",
        foodRelation: "Empty stomach 30 mins before breakfast",
        duration: "5 Days",
        confidence: 94.2,
        status: "verified",
        purpose: "Prevents acidity from strong antibiotics",
        schedule: ["morning"],
        brandedPrice: 198.00,
        genericPrice: 38.00,
        handwritingText: "Cap. Pan-D  1-0-0 (Before BF)"
      },
      {
        id: "med-4",
        brandName: "Montair-LC",
        genericSalt: "Montelukast (10mg) + Levocetirizine (5mg)",
        type: "Tablet",
        strength: "10/5 mg",
        frequency: "0-0-1 (Once daily at bedtime)",
        timingCode: "HS",
        foodRelation: "At bedtime (may cause mild drowsiness)",
        duration: "7 Days",
        confidence: 91.5,
        status: "verified",
        purpose: "Relieves allergic cough & airway wheezing",
        schedule: ["bedtime"],
        brandedPrice: 175.00,
        genericPrice: 32.00,
        handwritingText: "Tab. Montair LC  0-0-1 (HS)"
      }
    ],
    safetyAlerts: [
      {
        level: "warning",
        title: "Drowsiness Precaution",
        message: "Montair-LC contains Levocetirizine which causes mild sedation. Avoid driving or operating machinery at night.",
        drugsInvolved: ["Montair-LC"]
      },
      {
        level: "info",
        title: "Antibiotic Course Discipline",
        message: "Complete the full 5-day course of Augmentin 625 even if you feel better to prevent antimicrobial resistance (AMR).",
        drugsInvolved: ["Augmentin 625 Duo"]
      }
    ]
  },
  {
    id: "rx-2",
    title: "Cardio-Metabolic (High Interaction Risk Rx)",
    tag: "High-Risk Interaction Detected",
    category: "Cardiology & Endocrinology",
    doctor: {
      name: "Dr. Sunita Kulkarni, DM",
      specialty: "Senior Consultant Cardiologist",
      regNo: "MMC-93821",
      clinic: "Fortis Escorts Heart Institute, Mumbai",
      date: "2026-08-18"
    },
    patient: {
      name: "Rameshwar Patel",
      age: "62 Yrs",
      gender: "Male",
      phone: "+91 94250-XXXXX",
      vitals: "BP: 148/92 mmHg | Fasting Sugar: 164 mg/dL | HbA1c: 7.8%"
    },
    diagnosis: "Essential Hypertension + Type 2 Diabetes Mellitus + Post-Stent Care",
    rawImageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    handwritingSnippets: {
      "Ecosprin-AV 75": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
      "Telma-40": "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400",
      "Glycomet-GP 1": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400",
      "Brufen 400": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400"
    },
    medicines: [
      {
        id: "med-201",
        brandName: "Ecosprin-AV 75",
        genericSalt: "Aspirin (75mg) + Atorvastatin (10mg)",
        type: "Capsule",
        strength: "75/10 mg",
        frequency: "0-0-1 (Nightly after dinner)",
        timingCode: "OD (Night)",
        foodRelation: "After dinner to protect gastric lining",
        duration: "30 Days (Ongoing)",
        confidence: 97.2,
        status: "verified",
        purpose: "Blood thinner & cholesterol regulation",
        schedule: ["night"],
        brandedPrice: 112.00,
        genericPrice: 28.00,
        handwritingText: "Cap. Ecosprin-AV 75 0-0-1 post dinner"
      },
      {
        id: "med-202",
        brandName: "Telma-40",
        genericSalt: "Telmisartan",
        type: "Tablet",
        strength: "40 mg",
        frequency: "1-0-0 (Morning after breakfast)",
        timingCode: "OD",
        foodRelation: "Fixed time every morning",
        duration: "30 Days (Ongoing)",
        confidence: 98.1,
        status: "verified",
        purpose: "Blood pressure regulation",
        schedule: ["morning"],
        brandedPrice: 220.00,
        genericPrice: 32.00,
        handwritingText: "Tab. Telma 40mg 1-0-0 (Morning)"
      },
      {
        id: "med-203",
        brandName: "Glycomet-GP 1",
        genericSalt: "Metformin (500mg) + Glimepiride (1mg)",
        type: "Tablet",
        strength: "500/1 mg",
        frequency: "1-0-1 (Before breakfast and dinner)",
        timingCode: "BD",
        foodRelation: "15 mins before meals",
        duration: "30 Days (Ongoing)",
        confidence: 95.0,
        status: "verified",
        purpose: "Type 2 Diabetes glucose control",
        schedule: ["morning", "night"],
        brandedPrice: 145.00,
        genericPrice: 35.00,
        handwritingText: "Tab. Glycomet-GP 1  1-0-1 (AC)"
      },
      {
        id: "med-204",
        brandName: "Brufen 400 (Over-the-counter Painkiller added)",
        genericSalt: "Ibuprofen",
        type: "Tablet",
        strength: "400 mg",
        frequency: "1-0-1 (Self-medicated for knee pain)",
        timingCode: "BD",
        foodRelation: "After meals",
        duration: "3 Days",
        confidence: 88.5,
        status: "flagged_danger",
        purpose: "Pain relief (DETECTED AS DANGEROUS CONTRAINDICATION)",
        schedule: ["morning", "night"],
        brandedPrice: 40.00,
        genericPrice: 12.00,
        handwritingText: "Tab. Brufen 400 (Self Reported)"
      }
    ],
    safetyAlerts: [
      {
        level: "danger",
        title: "CRITICAL CONTRAINDICATION DETECTED",
        message: "Severe Drug Interaction: Ibuprofen (Brufen) taken concurrently with Aspirin (Ecosprin-AV) multiplies internal gastrointestinal bleeding risk by 4.2x and negates the cardioprotective benefits of Aspirin.",
        drugsInvolved: ["Ecosprin-AV 75", "Brufen 400"],
        actionRequired: "Stop Brufen immediately. Consult cardiologist for a safe alternative like Paracetamol."
      },
      {
        level: "warning",
        title: "Hypoglycemia (Low Sugar) Watch",
        message: "Glimepiride in Glycomet-GP can cause sudden sugar drops if meals are skipped. Always carry glucose/candy.",
        drugsInvolved: ["Glycomet-GP 1"]
      }
    ]
  },
  {
    id: "rx-3",
    title: "Pediatric & Gastro (Dosage Ceiling Anomaly)",
    tag: "Dosage Anomaly & Food Alert",
    category: "Pediatrics & Gastroenterology",
    doctor: {
      name: "Dr. Ananya Roy, DCH, MD",
      specialty: "Pediatric Specialist",
      regNo: "WBMC-66210",
      clinic: "Rainbow Children's Hospital, Kolkata",
      date: "2026-08-21"
    },
    patient: {
      name: "Kabir Roy (Child)",
      age: "6 Yrs (Weight: 20 kg)",
      gender: "Male",
      phone: "+91 97482-XXXXX",
      vitals: "Weight: 20 kg | Temp: 101.4°F"
    },
    diagnosis: "Acute Gastroenteritis with Mild Dehydration",
    rawImageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800",
    handwritingSnippets: {
      "Oflox-OZ Syrup": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400",
      "Econorm Sachet": "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=400",
      "ORS Electrolyte": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400"
    },
    medicines: [
      {
        id: "med-301",
        brandName: "Oflox-OZ Syrup",
        genericSalt: "Ofloxacin (50mg) + Ornidazole (125mg) / 5ml",
        type: "Syrup / Suspension",
        strength: "5 ml",
        frequency: "5 ml - 0 - 5 ml (Twice daily)",
        timingCode: "BD",
        foodRelation: "After meals. Avoid mixing with milk or dairy products.",
        duration: "3 Days",
        confidence: 93.6,
        status: "verified",
        purpose: "Antibiotic for bacterial & amoebic stomach infection",
        schedule: ["morning", "night"],
        brandedPrice: 95.00,
        genericPrice: 24.00,
        handwritingText: "Syp. Oflox-OZ  5ml BD x 3d"
      },
      {
        id: "med-302",
        brandName: "Econorm Sachet (250mg)",
        genericSalt: "Saccharomyces boulardii (Probiotic)",
        type: "Oral Powder Sachet",
        strength: "250 mg",
        frequency: "1 sachet once daily in lukewarm water",
        timingCode: "OD",
        foodRelation: "Dissolve in water/juice. Never mix with very hot liquids.",
        duration: "5 Days",
        confidence: 97.4,
        status: "verified",
        purpose: "Restores healthy gut flora and stops loose motions",
        schedule: ["afternoon"],
        brandedPrice: 85.00,
        genericPrice: 28.00,
        handwritingText: "Sachet Econorm  1 OD in water"
      },
      {
        id: "med-303",
        brandName: "Electral / WHO ORS Powder",
        genericSalt: "Oral Rehydration Salts (Sodium + Potassium + Glucose)",
        type: "Oral Solution",
        strength: "1 Sachet in 1 Liter clean boiled water",
        frequency: "Sip throughout the day after every loose stool",
        timingCode: "Ad libitum (Frequent sips)",
        foodRelation: "Continuous hydration",
        duration: "As needed",
        confidence: 99.1,
        status: "verified",
        purpose: "Prevents dangerous electrolyte imbalance & dehydration",
        schedule: ["as_needed"],
        brandedPrice: 22.00,
        genericPrice: 7.50,
        handwritingText: "ORS Sachet in 1L water sip frequently"
      }
    ],
    safetyAlerts: [
      {
        level: "warning",
        title: "Food/Dairy Chelation Warning",
        message: "Do not give Ofloxacin with milk, yogurt, or calcium-fortified juices. Calcium binds to Ofloxacin and reduces absorption by up to 60%. Give at least 2 hours before or after dairy.",
        drugsInvolved: ["Oflox-OZ Syrup"]
      },
      {
        level: "info",
        title: "Probiotic Preparation Guideline",
        message: "Never mix Econorm in boiling water, as heat destroys the live beneficial yeast cultures.",
        drugsInvolved: ["Econorm Sachet (250mg)"]
      }
    ]
  },
  {
    id: "rx-gangaram-ortho",
    title: "Sir Ganga Ram Hospital — Orthopedics (Dr. S. P. Mandal)",
    tag: "Spine Surgery & Radiculopathy Rx",
    category: "Orthopedics / Spine & Radiculopathy",
    doctor: {
      name: "Dr. S. P. Mandal, B.Sc., MBBS, M.S. (Ortho) AIIMS, M.Ch. (Orth.) Liverpool UK",
      specialty: "Department of Orthopedics & Spine Surgery (Padma Shree Awardee)",
      regNo: "Reg. No-30516 (WB) / 11808 (Delhi)",
      hospital: "Sir Ganga Ram Hospital, Rajinder Nagar, New Delhi - 110060",
      phone: "011-25750000 / 42251000",
      date: "2014-01-31"
    },
    patient: {
      name: "Mr. Jitender Kr.",
      age: "44 Yrs",
      gender: "Male"
    },
    diagnosis: "Low Back Pain (LBP) with Right Radiculopathy & Hyperuricemia (Uric Acid 7.57 mg/dL, Creatinine 1.28)",
    clinicalNotes: "c/o LBP c/o RT Radiculopathy. Symptomatically better. Uric acid: 7.57, Creatinine: 1.28. Review in 6 weeks.",
    advice: "Continue lumbar posture care, avoid lifting heavy weights, take Feburic with plenty of water.",
    duration: "6 Weeks",
    rawImageUrl: "/prescriptions/rx-gangaram-ortho.jpg",
    medicines: [
      {
        id: "med-mandal-1",
        brandName: "Cap. Altraday",
        genericSalt: "Aceclofenac (200mg SR) + Rabeprazole Sodium (20mg)",
        type: "Capsule",
        strength: "200mg / 20mg",
        frequency: "1 Capsule once daily (1 OD)",
        timingCode: "OD (Morning)",
        foodRelation: "Morning after breakfast with water",
        duration: "6 Weeks",
        confidence: 99.4,
        status: "verified",
        purpose: "24-hour continuous anti-inflammatory relief for lumbar pain & sciatica without stomach irritation",
        schedule: ["morning"],
        brandedPrice: 260.00,
        genericPrice: 52.00,
        savingPercent: 80.0,
        handwritingText: "Altraday  1 OD"
      },
      {
        id: "med-mandal-2",
        brandName: "Tab. Bio D3 Plus",
        genericSalt: "Calcitriol (0.25mcg) + Calcium Carbonate (500mg) + Zinc (7.5mg)",
        type: "Tablet",
        strength: "0.25mcg / 500mg",
        frequency: "1 Tablet once daily (1 OD)",
        timingCode: "OD (Afternoon)",
        foodRelation: "After lunch with water",
        duration: "6 Weeks",
        confidence: 98.9,
        status: "verified",
        purpose: "Active Vitamin D3 (Calcitriol) & Calcium for bone mineralization and spinal disc recovery",
        schedule: ["afternoon"],
        brandedPrice: 295.00,
        genericPrice: 58.00,
        savingPercent: 80.3,
        handwritingText: "Bio D3 Plus  1 OD"
      },
      {
        id: "med-mandal-3",
        brandName: "Cap. Goldcal D3 60K",
        genericSalt: "Cholecalciferol (Vitamin D3 60,000 IU)",
        type: "Capsule",
        strength: "60,000 IU",
        frequency: "1 Capsule once a week (60K once a week)",
        timingCode: "Once Weekly",
        foodRelation: "Once weekly after main meal",
        duration: "6 Weeks",
        confidence: 98.7,
        status: "verified",
        purpose: "Corrects systemic Vitamin D deficiency to promote nerve remyelination & bone density",
        schedule: ["morning"],
        brandedPrice: 180.00,
        genericPrice: 35.00,
        savingPercent: 80.5,
        handwritingText: "Goldcal D3  60k once a week"
      },
      {
        id: "med-mandal-4",
        brandName: "Tab. Feburic 80 (Febuxostat)",
        genericSalt: "Febuxostat IP (80mg)",
        type: "Tablet",
        strength: "80 mg",
        frequency: "1 Tablet once daily (1 OD)",
        timingCode: "OD (Morning)",
        foodRelation: "Morning after food with generous water",
        duration: "6 Weeks",
        confidence: 99.1,
        status: "verified",
        purpose: "Potent Xanthine Oxidase Inhibitor to lower elevated serum Uric Acid (Lab: 7.57 mg/dL)",
        schedule: ["morning"],
        brandedPrice: 240.00,
        genericPrice: 48.00,
        savingPercent: 80.0,
        handwritingText: "Feburic 80  1 OD"
      },
      {
        id: "med-mandal-5",
        brandName: "Cap. Dexite 10/20",
        genericSalt: "Dexrabeprazole (10mg) + Domperidone (20mg)",
        type: "Capsule",
        strength: "10mg / 20mg",
        frequency: "1 Capsule before food (1 BF)",
        timingCode: "1 BF (Morning)",
        foodRelation: "Morning 30 minutes before breakfast (Empty Stomach)",
        duration: "6 Weeks",
        confidence: 98.5,
        status: "verified",
        purpose: "Proton pump mucosal barrier against acid reflux and medication-induced gastritis",
        schedule: ["morning"],
        brandedPrice: 190.00,
        genericPrice: 38.00,
        savingPercent: 80.0,
        handwritingText: "Dexite 10/20  BF"
      },
      {
        id: "med-mandal-6",
        brandName: "Tab. Tryptomer 10mg",
        genericSalt: "Amitriptyline Hydrochloride IP (10mg)",
        type: "Tablet",
        strength: "10 mg",
        frequency: "1 Tablet at bedtime (1 HS)",
        timingCode: "1 HS (Night)",
        foodRelation: "Night before sleep",
        duration: "6 Weeks",
        confidence: 98.8,
        status: "verified",
        purpose: "Neuropathic pain modulator to relieve radicular shooting nerve pain down the right leg",
        schedule: ["night"],
        brandedPrice: 75.00,
        genericPrice: 16.00,
        savingPercent: 78.7,
        handwritingText: "Tryptomer 10mg  1 HS"
      }
    ],
    safetyAlerts: [
      {
        level: "warning",
        title: "High Uric Acid Management",
        message: "Uric acid is elevated at 7.57 mg/dL. Drink at least 2.5-3 liters of water daily while on Feburic to prevent urate crystal formation."
      },
      {
        level: "info",
        title: "Nocturnal Sedation Advisory",
        message: "Tryptomer 10mg causes mild drowsiness. Take strictly at bedtime; do not operate heavy machinery or drive at night."
      }
    ]
  },
  {
    id: "rx-sairisa-oncology",
    title: "VY Sairisa Cancer Care Center (Dr. Saurabh Jain)",
    tag: "Surgical Oncology & Post-RT Care",
    category: "Surgical Oncology / Colorectal",
    doctor: {
      name: "Dr. Saurabh Jain, MBBS, M.S. (General Surgery), DrNB (Surgical Oncology)",
      specialty: "Consultant Surgical Oncologist (Tata Memorial Hospital Mumbai Fellow)",
      regNo: "Reg. No. CGMC-12100/2022",
      hospital: "VY Sairisa Cancer Care Center, Sector 12, Kamal Vihar, Raipur (C.G.)",
      phone: "0771-4050200 / 2533338",
      date: "2025-06-28"
    },
    patient: {
      name: "Mr. Daniram Pal",
      age: "53 Yrs",
      gender: "Male"
    },
    diagnosis: "Acute Anal Fissure with Spasmodic Pain (Post-Radiation Patient)",
    clinicalNotes: "c/o Anal fissure. Advice laxative, sphincter muscle relaxant, strong analgesics. Resume RT (Radiotherapy) as soon as possible.",
    advice: "High-fiber diet, warm sitz baths twice daily, resume radiotherapy (RT) without interruption.",
    duration: "5 Days",
    rawImageUrl: "/prescriptions/rx-sairisa-oncology.jpg",
    medicines: [
      {
        id: "med-sairisa-1",
        brandName: "Syp. Lactihep Plus / Duphalac",
        genericSalt: "Lactulose (10g/15ml) + Liquid Paraffin (or Pure Lactulose Solution)",
        type: "Syrup / Oral Liquid",
        strength: "20 ml",
        frequency: "20ml Twice Daily (1 - 0 - 1)",
        timingCode: "1 - 0 - 1 (BD)",
        foodRelation: "Morning and Night after meals with warm water",
        duration: "3 Days",
        confidence: 99.2,
        status: "verified",
        purpose: "Osmotic stool softening to eliminate friction and tearing during bowel movements",
        schedule: ["morning", "night"],
        brandedPrice: 320.00,
        genericPrice: 65.00,
        savingPercent: 79.7,
        handwritingText: "Syp. Lactihep plus 20ml 1-0-1 or Syp. Duphalac 20ml 1-0-1 x 3 days"
      },
      {
        id: "med-sairisa-2",
        brandName: "Cremagel Ointment",
        genericSalt: "Diltiazem Hydrochloride (2% w/w) Topical Ointment",
        type: "Topical Ointment",
        strength: "2% w/w (30g tube)",
        frequency: "Apply twice daily (1 - 0 - 1)",
        timingCode: "1 - 0 - 1 (BD)",
        foodRelation: "Local anorectal application after cleaning & sitz bath",
        duration: "5 Days",
        confidence: 98.7,
        status: "verified",
        purpose: "Calcium channel blocker that relieves internal sphincter spasm, increasing local blood flow to heal fissure",
        schedule: ["morning", "night"],
        brandedPrice: 195.00,
        genericPrice: 42.00,
        savingPercent: 78.5,
        handwritingText: "Cremagel  1-0-1 x 5 days"
      },
      {
        id: "med-sairisa-3",
        brandName: "Tab. Ultracet",
        genericSalt: "Tramadol Hydrochloride (37.5mg) + Paracetamol (325mg)",
        type: "Tablet",
        strength: "37.5mg / 325mg",
        frequency: "1 Tablet three times a day (1 - 1 - 1)",
        timingCode: "1 - 1 - 1 (TDS)",
        foodRelation: "After meals (Breakfast, Lunch, Dinner)",
        duration: "3 Days",
        confidence: 99.1,
        status: "verified",
        purpose: "Dual-action opioid analgesic for controlling severe acute anorectal pain",
        schedule: ["morning", "afternoon", "night"],
        brandedPrice: 240.00,
        genericPrice: 48.00,
        savingPercent: 80.0,
        handwritingText: "T. Ultracet  1-1-1 x 3 days"
      }
    ],
    safetyAlerts: [
      {
        level: "warning",
        title: "Oncology Protocol Continuity",
        message: "Doctor advised: 'Resume RT (Radiotherapy) as soon as possible'. Ensure radiation therapy is resumed promptly."
      },
      {
        level: "info",
        title: "Topical Application Guidance",
        message: "Apply Cremagel gently 1-2 cm inside the anal canal after a warm water sitz bath for optimal sphincter relaxation."
      }
    ]
  },
  {
    id: "rx-vy-gastro-suman",
    title: "VY Hospital — Gastroenterology (Dr. Prashant Kumar Singh)",
    tag: "Gastroenterology & Metabolic Care",
    category: "Gastroenterology & Hepatology",
    doctor: {
      name: "Dr. Prashant Kumar Singh, MBBS, MD (General Medicine), DNB (Gastroenterology)",
      specialty: "Consultant Gastroenterology, Hepatology & Therapeutic Endoscopy",
      regNo: "Reg No. CGMC - 3378/2011",
      hospital: "VY Hospital, Kamal Vihar, New Dhamtari Road, Raipur (C.G.)",
      phone: "0771-4622222",
      date: "2025-07-20"
    },
    patient: {
      name: "Mrs. Suman Markam",
      age: "48 Yrs",
      gender: "Female"
    },
    diagnosis: "Known Case of Type 2 Diabetes (T2DM), Hypothyroidism, SU-Induced Hypoglycemia, Iron Deficiency Anemia (IDA)",
    clinicalNotes: "K/c/o T2DM, Hypothyroidism, Hypoglycemia (SU induced), IDA. Cap Rx IT empty stomach (खाली पेट), Syp Choliv BD.",
    advice: "Strict blood glucose monitoring; avoid sulfonylurea overdose. Take Cap Rx IT on completely empty stomach.",
    duration: "1 Month",
    rawImageUrl: "/prescriptions/rx-vy-gastro-suman.jpg",
    medicines: [
      {
        id: "med-suman-1",
        brandName: "Cap. Rx IT (Rabeprazole + Itopride)",
        genericSalt: "Rabeprazole Sodium (20mg) + Itopride Hydrochloride (150mg SR)",
        type: "Capsule",
        strength: "20mg / 150mg",
        frequency: "1 Capsule PO OD Before Breakfast (खाली पेट)",
        timingCode: "1 PO OD BBF",
        foodRelation: "Strictly empty stomach 30-45 minutes before breakfast (खाली पेट)",
        duration: "1 Month",
        confidence: 99.3,
        status: "verified",
        purpose: "Prokinetic and proton pump inhibitor to treat severe acid reflux and delayed gastric emptying",
        schedule: ["morning"],
        brandedPrice: 285.00,
        genericPrice: 58.00,
        savingPercent: 79.6,
        handwritingText: "Cap Rx IT  1 PO OD BBF (खाली पेट)"
      },
      {
        id: "med-suman-2",
        brandName: "Syp. Choliv (Tricholine Citrate + Sorbitol)",
        genericSalt: "Tricholine Citrate (550mg) + Sorbitol Solution 70% (7.15g) per 10ml",
        type: "Syrup / Oral Liquid",
        strength: "5 ml",
        frequency: "5ml Twice Daily (1 PO BD)",
        timingCode: "1 PO BD",
        foodRelation: "After morning and evening meals",
        duration: "1 Month",
        confidence: 98.8,
        status: "verified",
        purpose: "Lipotropic and hepatoprotective agent supporting liver metabolism and gallbladder bile flow",
        schedule: ["morning", "night"],
        brandedPrice: 190.00,
        genericPrice: 42.00,
        savingPercent: 77.9,
        handwritingText: "Syp Choliv  5ml PO BD"
      }
    ],
    safetyAlerts: [
      {
        level: "warning",
        title: "Hypoglycemia (Low Blood Sugar) Alert",
        message: "Patient has documented Sulfonylurea (SU)-induced hypoglycemia. Keep glucose tablets or sweet fruit juice handy at all times."
      },
      {
        level: "info",
        title: "Empty Stomach Compliance",
        message: "As written by the doctor ('खाली पेट'), Cap Rx IT MUST be taken 30-45 minutes before morning tea or breakfast for maximum efficacy."
      }
    ]
  },
  {
    id: "rx-vy-gastro-abdomen",
    title: "VY Hospital — Gastroenterology / Acute Abdomen (Dr. Prashant Kumar Singh)",
    tag: "Acute Abdominal Colic & Pancreatic Protocol",
    category: "Gastroenterology / Acute Care",
    doctor: {
      name: "Dr. Prashant Kumar Singh, MBBS, MD, DM (Gastroenterology)",
      specialty: "Consultant Gastroenterologist & Hepatologist",
      regNo: "Reg. No. CGMC-3378/2011",
      hospital: "VY Hospital, Kamal Vihar, New Dhamtari Road, Raipur (C.G.)",
      phone: "0771-4622222",
      date: "2025-11-28"
    },
    patient: {
      name: "Patient (Abdominal Pain)",
      age: "42 Yrs",
      gender: "Male"
    },
    diagnosis: "Acute Abdominal Pain Episode (3 Days duration), Suspected Pancreatitis / Spasmodic Colic",
    clinicalNotes: "c/o Pain abdomen - 1 Episode 3 days. Prescribed IM Tramadol SOS, Panlipase TDS for 1 month, Esomac D, Antoxipan BD.",
    advice: "Low-fat, easily digestible diet. Avoid alcohol and spicy/oily food. Review after 1 month or immediately if pain recurs.",
    duration: "1 Month",
    rawImageUrl: "/prescriptions/rx-vy-gastro-abdomen.jpg",
    medicines: [
      {
        id: "med-abdo-1",
        brandName: "Inj. Tramadol 75mg (1 amp)",
        genericSalt: "Tramadol Hydrochloride Injection IP (75mg / 2ml)",
        type: "Injectable Ampoule",
        strength: "75 mg / 2ml",
        frequency: "1 Ampoule IM SOS (As needed for severe pain)",
        timingCode: "IM SOS",
        foodRelation: "Intramuscular injection by nurse/doctor for acute colic",
        duration: "Single Dose / SOS",
        confidence: 99.4,
        status: "verified",
        purpose: "Emergency opioid analgesia for acute, severe abdominal pain episodes",
        schedule: ["as_needed"],
        brandedPrice: 45.00,
        genericPrice: 12.00,
        savingPercent: 73.3,
        handwritingText: "Inj. Tramadol 1 amp (75mg) IM SOS"
      },
      {
        id: "med-abdo-2",
        brandName: "Tab. Panlipase (Pancreatin 10000 IU)",
        genericSalt: "Pancreatin (Lipase 10,000 IU + Amylase + Protease)",
        type: "Tablet",
        strength: "10,000 IU",
        frequency: "1 Tablet PO Three Times Daily (1 - 1 - 1)",
        timingCode: "1 PO TDS",
        foodRelation: "With meals (Breakfast, Lunch, Dinner) - swallow whole",
        duration: "1 Month",
        confidence: 99.0,
        status: "verified",
        purpose: "Digestive enzyme supplement for pancreatic insufficiency to eliminate post-meal abdominal cramps and bloating",
        schedule: ["morning", "afternoon", "night"],
        brandedPrice: 620.00,
        genericPrice: 135.00,
        savingPercent: 78.2,
        handwritingText: "T. Panlipase  1 PO TDS x 1 Month"
      },
      {
        id: "med-abdo-3",
        brandName: "Cap. Esomac D",
        genericSalt: "Esomeprazole (40mg) + Domperidone (30mg SR)",
        type: "Capsule",
        strength: "40mg / 30mg",
        frequency: "1 Capsule PO Once Daily (1 PO OD)",
        timingCode: "1 PO OD",
        foodRelation: "Morning on empty stomach 30 minutes before food",
        duration: "1 Month",
        confidence: 98.9,
        status: "verified",
        purpose: "Acid suppression and prokinetic motility to reduce gastric distension and nausea",
        schedule: ["morning"],
        brandedPrice: 245.00,
        genericPrice: 48.00,
        savingPercent: 80.4,
        handwritingText: "Cap. Esomac D  1 PO OD"
      },
      {
        id: "med-abdo-4",
        brandName: "Tab. Antoxipan",
        genericSalt: "Antioxidants (Beta-Carotene + Selenium + Methionine + Vitamin C & E)",
        type: "Tablet",
        strength: "Antioxidant Formula",
        frequency: "1 Tablet PO Twice Daily (1 PO BD)",
        timingCode: "1 PO BD",
        foodRelation: "After morning and night meals",
        duration: "1 Month",
        confidence: 98.6,
        status: "verified",
        purpose: "Micronutrient antioxidant therapy reducing oxidative stress in pancreatic tissue",
        schedule: ["morning", "night"],
        brandedPrice: 380.00,
        genericPrice: 75.00,
        savingPercent: 80.3,
        handwritingText: "T. Antoxipan  1 PO BD"
      },
      {
        id: "med-abdo-5",
        brandName: "Tab. Drotin-M / Ultracet",
        genericSalt: "Drotaverine HCl (80mg) + Mefenamic Acid (250mg) / Tramadol-Paracetamol",
        type: "Tablet",
        strength: "80mg / 250mg",
        frequency: "1 Tablet PO SOS (When having pain)",
        timingCode: "1 PO SOS",
        foodRelation: "Take with water during sudden spasms",
        duration: "As needed",
        confidence: 98.5,
        status: "verified",
        purpose: "Smooth muscle antispasmodic for acute visceral colic and abdominal cramps",
        schedule: ["as_needed"],
        brandedPrice: 160.00,
        genericPrice: 32.00,
        savingPercent: 80.0,
        handwritingText: "T. Drotin-M / Ultracet  1 PO SOS"
      }
    ],
    safetyAlerts: [
      {
        level: "warning",
        title: "Pancreatic Enzyme Administration",
        message: "Panlipase must be taken with meals (not before or long after). Do not crush or chew the tablet as digestive enzymes must reach the small intestine intact."
      },
      {
        level: "info",
        title: "Injectable Tramadol Usage",
        message: "Inj. Tramadol is prescribed for acute emergency pain episodes (SOS). It should be administered only under professional clinical supervision."
      }
    ]
  }
];
