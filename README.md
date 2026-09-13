# MedProof — CooL SDK Reverse Hackathon Prototype

**MedProof** is a privacy-preserving evidence layer for AI-assisted clinical workflows.

It helps create **cryptographically verifiable evidence receipts** for AI-generated clinical events, allowing users to verify whether the recorded evidence has been modified or tampered with.

## 🚀 Live Demo

🌐 **Vercel Demo:** `PASTE-YOUR-VERCEL-URL-HERE`

🐙 **GitHub Repository:**
https://github.com/impana-p21/MedProof---Reverse-Hackathon

---

## 🎯 Problem

AI-assisted clinical systems can generate important outputs and recommendations, but it can be difficult to prove:

* What AI/model version generated an event
* Which record or input the event belongs to
* Whether the evidence was modified after creation
* Whether a stored AI event can be independently verified

MedProof addresses this by creating a **cryptographic evidence layer** around AI-assisted clinical workflows.

---

## 💡 Solution

MedProof creates an evidence receipt for each synthetic clinical AI event.

The receipt captures important metadata and cryptographic commitments that can later be verified.

The application demonstrates:

1. Entering synthetic clinical AI event data
2. Creating a cryptographic evidence receipt
3. Recording evidence through the CooL SDK
4. Inspecting the model/version, record ID and commitments
5. Verifying the generated receipt
6. Simulating tampering
7. Detecting the modification through verification failure

---

## ⚡ CooL SDK Integration

CooL is a **core part of MedProof**, rather than an additional feature.

The Node.js server integrates the CooL SDK through `cool-nwc`.

The application initializes CooL using:

```javascript
new CooL({
  applicationId: 'medproof-clinical-ai'
})
```

Evidence is recorded using:

```javascript
cool.record(...)
```

This allows MedProof to use CooL for the cryptographic evidence/provenance layer of the application.

### Why CooL is important

Without cryptographic evidence, a clinical AI event is essentially dependent on the integrity of the stored application data.

With CooL, MedProof can associate the event with cryptographic evidence that can be used during verification.

This provides:

* 🔐 Tamper detection
* 🧾 Verifiable evidence receipts
* 🔍 Evidence provenance
* 🤖 AI model/version tracking
* 🛡️ Greater trust in AI-assisted workflows

---

## 🏗️ Architecture

```text
                User
                  │
                  ▼
        ┌───────────────────┐
        │   MedProof UI     │
        │   Clinical Event  │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │ Evidence Creation │
        │ & Verification    │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │   Node.js Server  │
        └─────────┬─────────┘
                  │
                  ▼
        ┌───────────────────┐
        │     CooL SDK      │
        │    cool-nwc       │
        └─────────┬─────────┘
                  │
                  ▼
        Cryptographic Evidence
                  │
                  ▼
        ┌───────────────────┐
        │ Verification /    │
        │ Tamper Detection  │
        └───────────────────┘
```

---

## 🔄 Product Workflow

### 1. Create Event

The user enters synthetic clinical AI event information such as:

* Record ID
* AI model
* Model version
* Clinical event information

### 2. Generate Evidence

MedProof creates a cryptographic evidence receipt for the event.

### 3. CooL Recording

The Node.js backend uses the CooL SDK to record the evidence.

### 4. Verify

The generated receipt can be verified to check whether the evidence remains valid.

### 5. Tamper Simulation

The prototype allows the user to modify the evidence and run verification again.

The verification then demonstrates the difference between:

**Valid evidence → Verification succeeds ✅**

**Modified evidence → Verification fails ❌**

---

## 🧪 Demo Data

MedProof is designed as a prototype and uses **synthetic/demo clinical data only**.

No real patient information should be entered into the application.

---

## 🛠️ Tech Stack

* JavaScript
* Node.js
* CooL SDK (`cool-nwc`)
* Cryptographic hashing
* HTML/CSS/JavaScript
* Vercel
* GitHub

---

## 💻 Run Locally

### Requirements

* Node.js 20+
* npm

### Installation

```bash
git clone https://github.com/impana-p21/MedProof---Reverse-Hackathon.git
cd MedProof---Reverse-Hackathon
npm install
```

### Start the application

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

---

## 🌐 Deployment

The MedProof prototype is deployed using **Vercel**.

The deployed application provides a live interface where reviewers can:

* Create an evidence receipt
* Inspect the generated evidence
* Verify the receipt
* Simulate tampering
* Observe verification failure

**Live Demo:** `PASTE-YOUR-VERCEL-URL-HERE`

---

## 🔐 Privacy & Security

MedProof is designed around the principle that sensitive clinical information should not need to be exposed simply to prove the integrity of an AI event.

The prototype therefore focuses on **cryptographic evidence and commitments rather than exposing sensitive clinical information**.

For the hackathon demonstration, only synthetic/demo patient data should be used.

---

## ⚠️ Limitations

This is a hackathon prototype and is not intended for real clinical deployment.

Current limitations include:

* Synthetic data only
* Prototype-level verification workflow
* Not validated for production healthcare environments
* Browser fallback may be used when the CooL SDK cannot be installed
* No integration with real hospital/EHR systems

**Important:** The browser fallback is only a cryptographic demonstration and should not be described as CooL SDK execution.

---

## 🚀 Future Improvements

Potential future improvements include:

* Integration with real clinical/EHR workflows
* Stronger identity and access controls
* More detailed evidence provenance
* Persistent evidence storage
* Role-based verification
* Audit dashboards
* Additional AI model metadata
* Production-grade security and compliance
* Expanded CooL-based evidence workflows

---

## 🏆 Hackathon Goal

MedProof demonstrates how **cryptographic evidence can improve trust and verifiability in AI-assisted clinical workflows**.

The key idea is simple:

> **AI-generated clinical events should not only be recorded — they should be verifiable.**

CooL provides the cryptographic evidence layer that makes this possible in the MedProof prototype.

---

## 📄 License

This project is open source and created as a prototype for the CooL SDK Reverse Hackathon.
