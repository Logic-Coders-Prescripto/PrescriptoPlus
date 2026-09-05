// Drug Database & Safety Engine Rules

export const CLINICAL_DOSAGE_LIMITS = {
  paracetamol: { maxSingleDoseMg: 1000, maxDailyDoseMg: 4000, unit: "mg" },
  amoxicillin: { maxSingleDoseMg: 1000, maxDailyDoseMg: 3000, unit: "mg" },
  ibuprofen: { maxSingleDoseMg: 800, maxDailyDoseMg: 2400, unit: "mg" },
  metformin: { maxSingleDoseMg: 1000, maxDailyDoseMg: 2550, unit: "mg" },
  telmisartan: { maxSingleDoseMg: 80, maxDailyDoseMg: 80, unit: "mg" },
  atorvastatin: { maxSingleDoseMg: 80, maxDailyDoseMg: 80, unit: "mg" }
};

export const JAN_AUSHADHI_EQUIVALENTS = {
  "Augmentin 625 Duo": {
    genericName: "Amoxycillin & Potassium Clavulanate Tablets IP (500mg+125mg)",
    pmjayCode: "PMBJP-0021",
    brandPrice: 204.50,
    pmjayPrice: 42.00,
    savingPercent: 79.5
  },
  "Dolo 650": {
    genericName: "Paracetamol Tablets IP (650mg)",
    pmjayCode: "PMBJP-0112",
    brandPrice: 34.00,
    pmjayPrice: 9.50,
    savingPercent: 72.1
  },
  "Pan-D": {
    genericName: "Pantoprazole & Domperidone SR Capsules (40mg+30mg)",
    pmjayCode: "PMBJP-0341",
    brandPrice: 198.00,
    pmjayPrice: 38.00,
    savingPercent: 80.8
  },
  "Montair-LC": {
    genericName: "Montelukast & Levocetirizine Tablets (10mg+5mg)",
    pmjayCode: "PMBJP-0489",
    brandPrice: 175.00,
    pmjayPrice: 32.00,
    savingPercent: 81.7
  },
  "Telma-40": {
    genericName: "Telmisartan Tablets IP (40mg)",
    pmjayCode: "PMBJP-0182",
    brandPrice: 220.00,
    pmjayPrice: 32.00,
    savingPercent: 85.5
  },
  "Ecosprin-AV 75": {
    genericName: "Aspirin & Atorvastatin Capsules (75mg+10mg)",
    pmjayCode: "PMBJP-0519",
    brandPrice: 112.00,
    pmjayPrice: 28.00,
    savingPercent: 75.0
  },
  "Glycomet-GP 1": {
    genericName: "Metformin & Glimepiride Tablets (500mg+1mg)",
    pmjayCode: "PMBJP-0245",
    brandPrice: 145.00,
    pmjayPrice: 35.00,
    savingPercent: 75.8
  },
  "Sizodon Plus": {
    genericName: "Risperidone & Trihexyphenidyl Tablets IP (3mg+2mg)",
    pmjayCode: "PMBJP-0782",
    brandPrice: 95.00,
    pmjayPrice: 22.00,
    savingPercent: 76.8
  },
  "Qutipin 200mg": {
    genericName: "Quetiapine Tablets IP (200mg)",
    pmjayCode: "PMBJP-0814",
    brandPrice: 240.00,
    pmjayPrice: 45.00,
    savingPercent: 81.3
  },
  "Ativan 2mg": {
    genericName: "Lorazepam Tablets IP (2mg)",
    pmjayCode: "PMBJP-0651",
    brandPrice: 85.00,
    pmjayPrice: 18.00,
    savingPercent: 78.8
  },
  "Rivotril 0.5mg": {
    genericName: "Clonazepam Tablets IP (0.5mg)",
    pmjayCode: "PMBJP-0598",
    brandPrice: 62.00,
    pmjayPrice: 14.00,
    savingPercent: 77.4
  },
  "Serta 50mg": {
    genericName: "Sertraline Tablets IP (50mg)",
    pmjayCode: "PMBJP-0711",
    brandPrice: 135.00,
    pmjayPrice: 28.00,
    savingPercent: 79.3
  }
};
