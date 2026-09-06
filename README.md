<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20&height=180&section=header&text=PrescriptoPlus&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=45" width="100%"/>



<br/>

<img src="https://readme-typing-svg.demolab.com/?font=Georgia&size=24&pause=1200&color=2DD4BF&center=true&vCenter=true&width=650&lines=AI+Reads+%E2%80%A2+Doctor+Verifies+%E2%80%A2+Patient+Listens;Turning+a+paper+prescription+into+a+verified+care+plan.;Built+at+IEEE+Hack+Synapse+2026" alt="Typing SVG"/>

[![Made for IEEE Hack Synapse 2026](https://img.shields.io/badge/IEEE-Hack%20Synapse%202026-6f42c1)](#)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](#)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38BDF8?logo=tailwindcss&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

[![Open Live Demo](https://img.shields.io/badge/Open%20Live%20Demo-2dd4bf?style=for-the-badge&logo=vercel&logoColor=black)](https://prescriptoplus.dpdns.org/)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [How It Works](#-how-it-works)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Safety & Privacy](#-safety--privacy)
- [Future Scope](#-future-scope)
- [Team](#-team--logiccoders)

---

## 🩺 About the Project

**PrescriptoPlus** is an AI-assisted, doctor-verified prescription companion built at **IEEE Hack Synapse 2026** (organized by IEEE IAS & IEEE RAS, MITS-DU Gwalior, in collaboration with HackIndia).

🔗 **Live app:** [prescriptoplus.dpdns.org](https://prescriptoplus.dpdns.org/)

A prescription can fail at four points — **reading, understanding, affordability, and follow-through**. PrescriptoPlus closes that gap with one safety-gated workflow: scan the slip, let AI extract the text, have a doctor verify and digitally sign it, and let the patient hear their routine explained in Hindi/English — with savings and reminders built in.

## ❗ The Problem

| Failure Point | Why it happens |
|---|---|
| **Hard to read** | Handwriting and dosage codes invite ambiguity |
| **Hard to follow** | Timings, food rules, and duration are easily forgotten |
| **Hard to afford** | Generic (Jan Aushadhi) savings and nearby kendras aren't visible |
| **Unsafe to automate** | OCR without doctor review creates false confidence |

> Patient risk begins **after** the slip is written — when instructions are misunderstood, unaffordable, or missed.

## 💡 Our Solution

One workflow turns a paper slip into a verified care plan:

1. **Scan** the prescription with optical OCR
2. **Reject** invalid images and **flag** uncertain text
3. **Doctor reviews**, corrects, and digitally signs
4. **Voice** (Hindi/English) explains the routine to the patient
5. **Reminders + Jan Aushadhi savings** make the care plan actionable

## 🔄 How It Works

```
 01. CAPTURE  →  02. EXTRACT  →  03. STRUCTURE  →  04. VERIFY  →  05. ACT
 Camera/File     Optical OCR     Medicine+Dose+     Doctor edits    Voice + Savings
                                 Timing             & signs         + Reminders
```

**Safety guard at every step:**
- 🚫 Rejects invalid uploads
- ⚠️ Flags low OCR confidence
- 🧹 Clears derived data when the source image is removed
- ❌ No invented medicines. No silent autocorrection.

## ✨ Key Features

- **AI Prescription OCR** — Upload or snap a photo of a handwritten/printed prescription; Tesseract.js extracts the text.
- **Doctor Directory & Appointments** — Browse doctors by specialty, pick a slot, and book a consultation.
- **Voice Routine Explainer** — Web Speech API narrates the confirmed schedule in Hindi and English.
- **Jan Aushadhi (PMBJP) Savings Engine** — Compares branded vs. generic medicine costs and locates nearby Jan Aushadhi Kendras.
- **Dosage Reminders (WhatsApp + In-app)** — Keeps patients on track with their medication timings.
- **ABDM / FHIR Export** — Export records in an ABDM-compliant FHIR format for interoperability.
- **Bilingual Discharge Receipts** — Generate hospital discharge summaries in English and Hindi.
- **Drug Safety & Interaction Graph** — Visual check for unsafe medicine combinations.
- **Indian Diet Matrix** — Diet guidance suited to the prescribed condition and Indian food habits.
- **Role-Based Workspaces** — Separate, permission-aware views for patients and doctors.

## 🛠 Tech Stack

**Product Experience**
- React 19 + Vite 6 — fast, component-based frontend
- Tailwind CSS 4 — responsive design system
- Lucide React — clinical iconography
- React State + RBAC — live, role-aware workflows

**Clinical & Trust Layer**
- Tesseract.js — prescription OCR / text extraction
- Web Speech API — Hindi + English voice narration
- PMBJP data + Maps — generic savings & Kendra discovery
- Doctor-in-the-loop review — review, edit, sign, or reject

**Trust & Compliance**
- DPDP-aligned patient consent
- Blank-login policy
- Derived data clears automatically when uploads are removed

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Logic-Coders-Prescripto/PrescriptoPlus.git
cd PrescriptoPlus

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Run the backend server (optional)

```bash
npm run server
# or run frontend + backend together
npm run dev:all
```

### Build for production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
PrescriptoPlus/
├── src/
│   ├── components/       # All UI + feature components (scanner, doctor browser,
│   │                      verification, reminders, ABDM export, etc.)
│   ├── data/              # Seed/sample data
│   ├── config/            # App configuration
│   ├── utils/             # OCR, voice, and helper utilities
│   └── assets/            # Icons, images
├── server/                # Express backend (API + services)
├── public/                # Static assets, sample prescriptions
├── package.json
└── README.md
```

## 🔐 Safety & Privacy

- Patient consent is required before AI optical extraction runs.
- All AI-extracted data is explicitly labeled **assistive** and must be confirmed by a doctor or pharmacist before being acted on.
- No medicine or dosage is invented — uncertain text is flagged, never guessed.
- Uploaded images and their derived data are cleared when removed by the user.

## 🗺 Future Scope

| Phase | Timeline | Focus |
|---|---|---|
| **Harden** | 0–3 months | Improve handwriting accuracy, build a medicine-salt database, add encryption & audit logs |
| **Pilot** | 3–6 months | Pilot with clinics & pharmacies, onboard verified doctors, connect live PMBJP data |
| **Scale** | 6–12 months | ABHA/EHR interoperability, more Indian languages, WhatsApp & caregiver support |

> **North Star:** Every verified prescription becomes easier to understand, afford, and follow.

## 👥 Team — Logiccoders

| Role | Name | GitHub |
|---|---|---|
| Team Leader | Dev Soni | [D3VSONI](https://github.com/D3VSONI) |
| Member | Prajan | [prajanexists-lang](https://github.com/prajanexists-lang) |
| Member | Abhay | [abhi-og](https://github.com/abhi-og) |
| Member | Navam | [ExponentL](https://github.com/ExponentL) |

Built for **IEEE Hack Synapse 2026** — a 36-hour offline hackathon organized by IEEE IAS & IEEE RAS, MITS-DU Gwalior, in collaboration with HackIndia.

---

<div align="center">
Made with ❤️ by Team Logic Coders
</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20&height=120&section=footer"/>
