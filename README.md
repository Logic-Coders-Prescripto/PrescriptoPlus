# 🏥 PrescriptoPlus - AI-Powered Prescription & Clinical Healthcare Platform

PrescriptoPlus is an advanced, AI-driven healthcare intelligence and prescription digitization platform. It features instant OCR prescription analysis, automated medicine schedules, PMBJP Jan Aushadhi generic cost-saving comparisons, visual grounding inspection, Indian diet & ayurvedic contraindications, ABDM/FHIR compliant health record exports, and enchanting interactive interfaces.

---

## ✨ Key Capabilities & Features

- 📄 **Prescription OCR & Visual Grounding**: Upload or scan prescriptions to accurately extract drug names, dosages, durations, frequencies, and instructions with visual bounding-box audit inspection.
- 💊 **Jan Aushadhi (PMBJP) Generic Savings**: Intelligent price comparisons between branded drugs and government Pradhan Mantri Bhartiya Janaushadhi Pariyojana alternatives (saving up to 80%).
- 🗺️ **Live PMBJP Kendra Locator**: Interactive geospatial store locator with directions, stock availability, and phone contact for nearby Jan Aushadhi outlets.
- ⏰ **Dynamic Dosage Schedule & Reminders**: Visual timetable categorized by Morning, Afternoon, Evening, and Night routines.
- 🥗 **Indian Diet & Drug Matrix**: Comprehensive dietary guidelines customized to Indian culinary staples (dahi, citrus, haldi doodh, chai, leafy greens) cross-referenced against active prescriptions.
- 🛡️ **Bio-Chemical Safety & Interaction Matrix**: Drug-drug interaction checking, organ safety indicators, and clinical precautions.
- 📋 **ABDM & FHIR Standards Compliant**: One-click export of structured FHIR JSON health records aligned with Ayushman Bharat Digital Mission (ABDM).
- 🎙️ **Hindi Voice Assistant & Speech Guidance**: Built-in voice synthesizer providing dosage instructions in Hindi and English.
- ✨ **Enchanted Interactive Experience**: Crystalline frosted glassmorphism, responsive wellness mood pulse tracker, live chronometer, and ambient glowing aurora interfaces.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend**: Node.js, Express, CORS
- **AI & Computer Vision**: Tesseract.js OCR, Multi-modal extraction pipelines, Canvas image filtration
- **Data & Standards**: HL7 FHIR (ABDM), PMBJP Drug Registry, DDI Interaction Engine

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Start the Backend API Server** (in a separate terminal):
   ```bash
   npm run server
   ```
   Backend listens on [http://localhost:5001](http://localhost:5001).

---

## 📦 How to Push to Git

To push this repository to GitHub or GitLab:

```bash
# 1. Initialize git repository
git init

# 2. Stage all tracked project files (node_modules, build artifacts are automatically ignored via .gitignore)
git add .

# 3. Commit the project
git commit -m "Initial commit: PrescriptoPlus AI Healthcare Platform"

# 4. Rename default branch to main
git branch -M main

# 5. Add your remote repository URL (replace with your actual repository link)
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git

# 6. Push code to remote
git push -u origin main
```

---

## 📁 Project Directory Structure

```
├── index.html              # HTML entry point with enchanted typography & meta
├── vite.config.js          # Vite build configuration with Tailwind v4 plugin
├── package.json            # Dependencies, build scripts & metadata
├── .gitignore              # Configured ignore list (excludes node_modules, dist, zip)
├── README.md               # Project documentation & setup instructions
├── public/                 # Public assets (sample prescriptions, logos, icons)
│   ├── logo.png
│   └── prescriptions/      # High-resolution clinical prescription samples
├── server/                 # Express backend services
│   ├── server.js           # API server, endpoints & mock database
│   ├── constants.js        # Medical specialty & role configurations
│   ├── startAll.js         # Concurrent runner
│   ├── data/db.json        # Persistent application database
│   └── services/           # Extraction & Hindi voice service layers
└── src/                    # Frontend application source
    ├── main.jsx            # Application root mount
    ├── App.jsx             # Main dashboard shell & state router
    ├── index.css           # Global design system, glassmorphism & enchanted effects
    ├── components/         # Modular feature components
    │   ├── PrescriptionScanner.jsx
    │   ├── VerificationCards.jsx
    │   ├── PriceComparisonSection.jsx
    │   ├── JanAushadhiLocatorModal.jsx
    │   ├── MedicineReminders.jsx
    │   ├── IndianDietMatrix.jsx
    │   ├── VisualGroundingInspectorModal.jsx
    │   ├── AbdmFhirExportModal.jsx
    │   ├── BilingualDischargeReceiptModal.jsx
    │   ├── DoctorBrowser.jsx
    │   ├── MyAppointments.jsx
    │   ├── HindiVoiceAssistant.jsx
    │   └── FinalLoginPage.jsx
    ├── data/               # Clinical knowledge bases
    │   ├── drugDatabase.js
    │   ├── samplePrescriptions.js
    │   └── translations.js
    └── utils/              # Clinical algorithmic engines & helpers
        ├── prescriptionParser.js
        ├── ddiInteractionEngine.js
        ├── indianDietData.js
        ├── abdmFhirGenerator.js
        ├── visualGroundingData.js
        └── voiceSynthesizer.js
```

---

## 📜 License
MIT License. Built for Healthcare Innovation & Hackathons.
