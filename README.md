# ARAM — Comprehensive IPV Intervention & Support Platform

A state-of-the-art, healthcare-integrated digital ecosystem engineered for Intimate Partner Violence (IPV) detection, assessment, anonymous evidence preservation, real-time crisis dispatch, and structured clinical support.

---

## 🌟 Executive Summary & Vision
Standard digital forms often fail survivors of intimate partner violence by leaving vulnerable browser footprints, ignoring acute physical danger, and lacking integration with professional healthcare triage. **ARAM** bridges the gap between community bystanders, vulnerable survivors, clinical medical teams, and emergency intervention agencies. 

By combining **real-time WebSocket broadcasting (Socket.IO)** with **Explainable AI (XAI) clinical risk scoring** and strict **Role-Based Access Control (RBAC)**, ARAM transforms standard web application architecture into an active lifesaving platform designed for zero-latency crisis intervention and forensic data integrity.

---

## 🚀 Standout Technical & Architectural Features

### 1. 🚨 Real-Time Emergency SOS & Live Location Streaming
* **WebSockets & HTML5 Geolocation:** Powered by **Socket.IO** and HTML5 Geolocation APIs, when an urgent distress signal is triggered, the backend spins up an active `EmergencySession` and broadcasts live `LocationPing` updates (including GPS coordinates and horizontal accuracy) in real-time to trusted responders and dispatchers.
* **Rate-Limiting Exemption:** Emergency routing endpoints are protected by dedicated, high-throughput rate limiters (`120 req/min`) to guarantee continuous geolocation streaming during crisis pursuits without triggering traditional DDoS API throttling.

### 2. 🛡️ Survivor Safety & "Quick Exit" Engineering (`useQuickExit`)
Designed specifically to protect survivors whose digital devices may be physically observed or monitored by abusers:
* **Global Keyboard Trigger:** In addition to conspicuous UI exit buttons, an ambient React custom hook (`useQuickExit.js`) monitors global DOM keyboard events. If a user rapidly presses the **Escape key three times (`Esc × 3`) within a 500ms window**, emergency escape procedures execute instantaneously without requiring mouse navigation.
* **Session Decapitation:** On high-risk secure pages like the Evidence Vault, executing Quick Exit intercepts and destroys authenticated local/session storage credentials (`localStorage.removeItem('userInfo')`) *before* redirecting. Even if an abuser manages to restore or reopen the browser window, they hit an authenticated login wall with zero persistent cached data.
* **Browser History Stack Replacement:** Instead of a standard redirect (`window.location.href`), core dashboards utilize **`window.location.replace("https://www.google.com/search?q=weather+today")`**. In browser DOM mechanics, `.replace()` overwrites the active entry in the browser's session history stack. If an suspicious intruder hits the browser **Back Arrow (←)**, they skip ARAM entirely and drop onto whatever external website was visited prior to our platform.

### 3. 🔐 Secure Evidence Vault & Cryptographic Chain of Custody
Survivors often lack a safe location to store documentation of abuse without risk of device discovery:
* **Zero-Trace Local Footprint:** Allows survivors to upload photographs, audio voice recordings, injury logs, and PDFs directly to cloud infrastructure without storing hazardous files locally inside their mobile device gallery or desktop cache.
* **Obfuscated File Storage:** Using customized Express `multer` middleware, original filenames (which often expose identifying metadata) are completely stripped and re-encoded using cryptographic timestamped randomization (`evidence-<timestamp>-<random_id>.<extension>`).
* **Attack Surface Hardening:** Implements rigorous MIME-type validation whitelisting (permitting only verified image, video, audio, and PDF formats) and strict file size caps (`20MB`) to eliminate script injection and storage exhaustion attacks.
* **SHA-256 Tamper-Proofing (Court Admissibility):** For digital proof to survive rigorous scrutiny in legal protective orders and trials, you must demonstrate a secure **Chain of Custody**. Our Mongoose schemas explicitly bind a **SHA-256 cryptographic digest (`fileHash`)** to every single uploaded item alongside an immutable UTC creation timestamp (`uploadedAt`). Any post-capture bit-level manipulation breaks the hash, guaranteeing absolute mathematical certainty of evidence integrity in court.

### 4. 🤖 Explainable AI (XAI) Clinical Risk Assessment Engine
Rather than relying on black-box external LLMs that introduce extreme latency and violate healthcare data privacy mandates (HIPAA / GDPR), ARAM embeds a **native JavaScript Rule-Based Clinical Expert System & Synthetic Logistic Regression model** directly in the Node.js server (`backend/utils/riskScoringEngine.js`).

The scoring engine evaluates **4 distinct clinical dimensions** using weighted mathematical coefficients:
1. 📝 **Screening Response Score (40% Weight):** Psychometric test results from standardized hospital IPV diagnostic screening instruments.
2. 🏥 **Physical Injury Score (25% Weight):** Evaluates injury severity indicators (e.g., Bruises = `0.3`, Defensive wounds = `0.85`, Strangulation marks = `0.95`).
3. 🧠 **Behavioral Indicator Score (20% Weight):** Measures psychological distress indicators (e.g., Hypervigilance = `0.5`, Active suicidal ideation = `0.9`).
4. 💔 **Emotional State Score (15% Weight):** Assesses acute emotional vulnerability (e.g., Fearful, Agitated, Withdrawn).

* **Mathematical Inference & Sigmoid Activation:** Combines multi-variable weighted sums ($z = w \cdot x + b$) passed through a logistic regression sigmoid curve ($1 / (1 + e^{-z})$) to compute a microsecond-level probability index (`aiProbability`) and confidence coefficient (`aiConfidence`).
* **Deterministic Lethality Triggers:** Regardless of the baseline numerical score, if an established life-threatening factor is observed (such as **strangulation marks**, **head injury**, or **suicidal ideation**), the clinical engine executes an automated override forcing the evaluation directly to **`HIGH RISK — Immediate intervention recommended`**.
* **Court & Clinical Transparency:** Outputs exact, human-readable explanatory logs (`aiExplanation`) so medical professionals and legal advocates can clearly articulate *why* an emergency protective intervention was ordered.

---

# 👥 Role-Based Access & System Capabilities

The platform implements rigorous **Role-Based Access Control (RBAC)** across four specialized roles:

| Role | Core Purpose | Complete Capabilities & Features |
| :--- | :--- | :--- |
| **1. Witnesses & Bystanders** <br>*(Public & Anonymous Access)* | Empower neighbors, friends, and family to report suspected abuse safely without retaliatory risks. | • **Anonymous Incident Reporting:** Submit detailed incident reports without registering an account or exposing personal identity.<br>• **Report Management:** Access and update submitted case records via secure reference identification (`WitnessReportDetail` & `WitnessReportEdit`).<br>• **Interactive Educational Base:** Educational modules explaining *What is IPV*, *Types of Abuse*, *Recognize Witness Signs*, and the *Cycle of Violence*. |
| **2. Victims & Survivors** <br>*(Protected Role: `victim`)* | Provide a confidential, secure personal haven to screen for abuse, preserve evidence, and organize escape routes. | • **Trauma-Informed Self-Screening:** Guided evaluations to help users recognize subtle emotional, financial, digital, and physical abuse patterns.<br>• **Encrypted Evidence Vault:** Safely archive incident proofs and voice notes in the cloud without leaving traces on the local device.<br>• **Personal Journaling:** Maintain private, timestamped daily logs tracking experiences and emotional health.<br>• **Interactive Safety Planner:** Step-by-step interactive tools to prepare essential documents, emergency escape pack lists, and shelter networks.<br>• **Emergency SOS & Trusted Contacts:** Instant activation of live GPS location broadcasting to trusted support networks. |
| **3. Healthcare Workers** <br>*(Clinical Role: `healthcare_worker`)* | Equip nurses, physicians, and clinic providers to detect undisclosed abuse during routine medical checkups. | • **Clinical Patient Registry & Lookup:** Instant retrieval of medical histories and previous IPV screening logs (`PatientLookupForm`).<br>• **Standardized Clinical Screening:** Perform structured hospital evaluations to document domestic trauma (`IPVScreeningForm`).<br>• **🤖 AI Risk Score Review:** Automatic categorization of danger levels (*Low, Medium, High, Extreme*) with explainable risk breakdown (`AIRiskScoreForm`).<br>• **Multi-Disciplinary Care Plans:** Formulate and monitor personalized protective and clinical recovery strategies (`CarePlanForm`).<br>• **Agency & Shelter Referrals:** Direct routing of high-risk patients to specialized domestic violence shelters, legal counseling, and support partners (`ReferralForm`).<br>• **Medical-Legal Reports:** Generate formal, structured documentation usable for court protective orders or hospital legal departments (`PatientReportForm`). |
| **4. System Administrators** <br>*(System Role: `admin`)* | Oversee system health, regional geopolitical analytics, inter-agency triage, and security compliance. | • **Geopolitical Analytics Dashboard:** Visualized filtering of incidents, risk distribution, and engagement dynamically across *Country*, *State*, and *District*.<br>• **Threat Distribution Metrics:** Real-time analytical tracking of user populations currently facing *Extreme, High, Medium, or Low* risk levels.<br>• **Multi-Agency & Referral Oversight:** Monitor active referrals and social work intervention timelines across community partners.<br>• **Audit & Security Compliance:** Automated logging of sensitive read/write accesses, rate-limiting oversight, user governance, and server health uptime monitoring. |

---

## 🔒 Security Hardening & Privacy Best Practices
* **Helmet Security Headers & Custom CSP:** Implements Express **Helmet** (`^7.1.0`) to defend against Cross-Site Scripting (XSS), Clickjacking, Protocol Downgrades, and MIME-sniffing. Configured with a specialized **Content Security Policy (CSP)** permitting secure inline React component styling (`styleSrc: "'unsafe-inline'"`) and encrypted base64/HTTPS Evidence Vault images (`imgSrc: "data:", "https:"`) while forbidding unmitigated scripts.
* **JSON Web Tokens (JWT) & Authentication Middleware:** Protected API endpoints require strictly verified bearer tokens with granular role validation (`requireRole`).
* **Automated Audit Logging:** Sensitive API reads and updates (such as a clinician viewing a victim's risk score or patient profile) trigger automated middleware generating tamper-proof security audit trails (`auditLog`).
* **Rate Limiting Protection:** Dual-tier rate limiting defends general REST APIs against brutal brute-force attacks (`100 req / 15 mins`), while allocating generous throughput specifically to real-time emergency telemetry pings (`120 req / min`).
* **CORS & CORS Resource Protection:** Configured cross-origin resource sharing specifically aligned between distributed client and server hosting architectures.

---

## 💻 Technology Stack
* **Frontend:** React.js (v18), React Router DOM (v6), Lucide Icons, Vanilla CSS Design System with Trauma-Informed UI/UX principles.
* **Backend:** Node.js, Express.js (REST API Architecture & Custom Middleware).
* **Real-Time Engine:** WebSockets via Socket.IO for live emergency broadcasting.
* **Database & ODM:** MongoDB with Mongoose Schema modeling & Indexing.
* **Security & File Handling:** Helmet.js, Express Rate Limit, Multer (Obfuscated Uploads), Cryptographic SHA-256 Hashing, Bcrypt.js.
* **Testing & QA:** Jest (Backend testing suite), React Testing Library (Frontend UI validation).

---

## 🛠️ Installation & Setup Guide

### 1. Prerequisites
* Node.js (v16.x or higher recommended)
* MongoDB (Local daemon or MongoDB Atlas connection instance)
* Git & npm

### 2. Clone & Install Dependencies
Clone the repository and run the macro install script to set up both frontend and backend packages simultaneously:
```bash
git clone https://github.com/your-username/ARAM.git
cd ARAM
npm run install:all
```

### 3. Environment Configuration (`.env`)
Navigate to the backend directory, duplicate the environment template, and insert your local configuration:
```bash
cp backend/.env.example backend/.env
```
Inside `backend/.env`, configure the following critical variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ipv-system
JWT_SECRET=your_super_secret_jwt_key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Development & Running Locally
Start both the Express server and React development client concurrently from the project root:
```bash
npm run dev
```
Alternatively, launch them independently:
```bash
# Backend Server only (Defaults to http://localhost:5000)
npm run server

# Frontend Client only (Defaults to http://localhost:3000)
npm run client
```

---

## 🧪 Testing Suite
Execute automated unit and integration tests across both frontend components and backend middleware:
```bash
# Run all project tests
npm test

# Run isolated backend Jest test suites
npm run test:server

# Run isolated React component testing suite
npm run test:client
```

---

## 📡 API Endpoints Overview

| Route Prefix | Access Level | Description |
| :--- | :--- | :--- |
| `GET /api/health` | Public | System uptime check, DB connection health, and status monitor. |
| `POST /api/auth/*` | Public / Protected | User login, registration, and JWT token issuance. |
| `POST /api/witness/*` | Public / Optional Auth | Anonymous witness incident submission and secure case tracking. |
| `POST /api/victim/*` | Protected (`victim`) | Self-screening evaluations, evidence vault file upload, and personal journals. |
| `GET/POST /api/healthcare/*` | Protected (`healthcare_worker`) | Clinical IPV screening, patient search, AI risk calculation, referrals, & care plans. |
| `POST /api/emergency/*` | Protected (`victim`) | Trigger emergency SOS sessions, cancel alerts, and broadcast real-time GPS coordinates. |
| `GET /api/admin/*` | Protected (`admin`) | Geopolitical analytical queries, threat level distribution, referral monitoring, and system uptime stats. |

---

## ⚖️ Disclaimer & Compliance Note
ARAM is engineered as a technological innovation and clinical decision-support architecture for Intimate Partner Violence detection and prevention. All cryptographic evidence timestamps, SHA-256 digests, and algorithmically generated clinical risk scores should be utilized in tandem with certified clinical judgment and local formal legal evidentiary protocols.
