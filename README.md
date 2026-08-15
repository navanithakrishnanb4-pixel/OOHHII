# Occupational Health Intelligence (OHI) Platform
## Knowledge Layer & Intelligent Adaptive Health Engine

This repository contains the core implementation of the OHI Knowledge Layer and its Intelligent Adaptive Branching Engine, integrated seamlessly with the existing Stitch-generated frontend pages.

**Current status:** This is a fully working **static, client-side prototype** (HTML + vanilla JS, no build step, no server). Worker data and screening sessions persist in the browser's `localStorage`. There is **no backend server, database, or LLM API integration yet** — the architecture below is written to make a future backend integration straightforward, but nothing beyond this static bundle currently exists. Do not assume a Java Spring Boot / MongoDB service is running; it is a roadmap item, not a shipped component.

---

## 1. Project Architecture

The architecture is divided into the **Bilingual Evidence Data Layer (JSON)**, the **Akinator-Style Adaptive Branching Engine (JS)**, and the **Page-Specific Binding Layer**. It has been designed specifically to be modular and readily consumed by a future **Java Spring Boot + MongoDB** backend.

```
New folder/
├── OHI-Evidence-Dataset/               <- Original NHANES source documentation & subset CSV
└── stitch_ohi_worker_health_intelligence/
    └── stitch_ohi_worker_health_intelligence/
        ├── OHI-KNOWLEDGE/               <- CORE KNOWLEDGE LAYER & ENGINE
        │   ├── symptom_domains.json     <- Mappings of symptoms to health domains
        │   ├── occupations.json         <- Occupational profiles and hazard associations
        │   ├── exposure_knowledge.json  <- Exposure details and risk references
        │   ├── question_bank.json       <- Bilingual (English/Tamil) voice-ready questions
        │   ├── branching_rules.json     <- Akinator-style adaptive path rules
        │   ├── risk_rules.json          <- Transparent explainable risk scoring rules
        │   ├── sources.json             <- Official CDC/NHANES 2011-2012 references
        │   ├── knowledge-base.js        <- Browser-loadable ES5 bundle of all configurations
        │   ├── ohi-engine.js            <- Core branching engine, state manager, and NLP parser
        │   ├── ohi-ui-integration.js    <- DOM controller injecting engine state into UI elements
        │   └── test_runner.html         <- Master browser test suite for the 7 scenarios
        ├── ohi_landing_page/
        ├── worker_registration/
        ├── worker_dashboard/
        ├── ai_health_intelligence_check_in/
        ├── exposure_passport/
        ├── health_trends/
        └── admin_dashboard/
```

---

## 2. Core Intelligent Capabilities

### A. Akinator-Style Adaptive Branching
Instead of a fixed questionnaire, the next question is selected dynamically based on:
1. **Occupation & Exposure:** A Quarry worker (high dust exposure) is asked about respiratory health, whereas a welder is directed to eye and fume questionnaires.
2. **Symptom Input:** If a worker reports a symptom, the engine dynamically triggers detailed follow-up branches (worsening during shift, improving away from work, etc.).
3. **Safety First:** Starts with an emergency check (`q_emergency_check`). An answer of `yes` immediately terminates the screening to recommend professional medical care.

### B. Natural Language Symptom Intent Parsing
Workers can input natural language (e.g., `இருமல் இருக்கு அண்ணா`, `my back hurts after lifting`). The engine runs a bilingual keyword extractor that parses the intent, logs the symptom, and immediately redirects the branching questionnaire to the correct domain details.

### B.1 Free-Form AI Chatbot (Gemini)
The keyword extractor above only routes messages that match a known symptom
category. For genuinely open-ended questions ("is this exposure dangerous?",
"what PPE should I use?", "எனக்கு தலை சுற்றுகிறது"), the AI check-in page
(`ai_health_intelligence_check_in/code.html`) falls through to a direct
Gemini API call (`OHI-KNOWLEDGE/gemini-client.js`), constrained by a safety
system prompt that forbids diagnosis, requires bilingual replies, and
front-loads an urgent-care recommendation whenever the message looks like an
emergency. The deterministic branching engine remains the source of truth for
the actual risk score — Gemini only answers free-text chat questions.

**Setup:** copy `OHI-KNOWLEDGE/gemini-config.example.js` to
`OHI-KNOWLEDGE/gemini-config.js` and put a real key in `GEMINI_API_KEY`.
`gemini-config.js` is gitignored — never commit it. If no key is configured,
the chat page falls back to its original guided-choice prompt, so the rest of
the demo still works with zero setup.

**Known limitation:** the key is loaded client-side, which is only
acceptable for a throwaway hackathon demo. Before any real deployment, move
the `fetch()` in `gemini-client.js` behind a small backend/serverless proxy
that holds `GEMINI_API_KEY` server-side.

### C. Explainable Risk Scoring
Risk scoring is completely transparent and rules-based (defined in `risk_rules.json`), combining:
- Exposure-symptom overlap (e.g. Quarry worker + Respiratory symptoms = high warning).
- Work-relatedness indicators (symptoms worsening at work).
- Protective measures (PPE always/sometimes/never usage).

### D. Low-Literacy & Voice-Ready Interface
All screening options are paired with Tamil translations written in simple conversational language (avoiding complex medical terms). Button options are represented as large, easy-to-tap icons with bilingual labels.

---

## 3. Clinical Safety Boundaries (Critical Constraints)
The engine conforms strictly to professional safety guidelines:
1. **No Diagnosis:** It **never** claims a clinical diagnosis (e.g., "You have silicosis" or "You have asthma"). Instead, it states: *"This pattern may need further medical evaluation. This is an early-warning screening, NOT a medical diagnosis."*
2. **Emergency Escalation:** For severe chest pain, breathing difficulties, or hemoptysis, the engine immediately terminates the check-in and advises seeking emergency professional medical attention.
3. **Demarcation:** Simulated/demo workers (e.g., in `test_runner.html`) are clearly labeled as **"Simulated Workers"**, separating real public health NHANES data from demonstration mocks.

---

## 4. Master Scenarios Test Harness
We have built an interactive test runner page (`test_runner.html`) that simulates and traces the 7 specific test cases required:

*   **CASE 1:** Quarry Worker | Mineral Dust | Cough & breathing difficulty -> High Risk (Score: 100/100 or 76/100 depending on breathing severity).
*   **CASE 2:** Construction Worker | Heavy lifting | Back pain -> Moderate Risk (demonstrates musculoskeletal branch).
*   **CASE 3:** Welding Worker | Eye irritation | Welding fumes -> Higher Concern (demonstrates eye irritation details and lack of PPE penalty).
*   **CASE 4:** Textile Worker | Cotton Dust | Cough -> Needs Attention (byssinosis risk screening).
*   **CASE 5:** Assembly Worker | Fine repetitive manual work | Numbness & Tingling -> Musculoskeletal/Neurological branch details.
*   **CASE 6:** Healthy Worker | No Symptoms check-in -> Low Concern.
*   **CASE 7:** Worker inputs free text `எனக்கு கொஞ்சம் இருமல் இருக்கு அண்ணா` -> Extracted cough intent and launched respiratory details flow automatically.

---

## 5. Summary of Files Changed/Added

### New Files Added:
1. [`OHI-KNOWLEDGE/symptom_domains.json`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/symptom_domains.json)
2. [`OHI-KNOWLEDGE/occupations.json`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/occupations.json)
3. [`OHI-KNOWLEDGE/exposure_knowledge.json`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/exposure_knowledge.json)
4. [`OHI-KNOWLEDGE/question_bank.json`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/question_bank.json)
5. [`OHI-KNOWLEDGE/branching_rules.json`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/branching_rules.json)
6. [`OHI-KNOWLEDGE/risk_rules.json`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/risk_rules.json)
7. [`OHI-KNOWLEDGE/sources.json`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/sources.json)
8. [`OHI-KNOWLEDGE/knowledge-base.js`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/knowledge-base.js)
9. [`OHI-KNOWLEDGE/ohi-engine.js`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/ohi-engine.js)
10. [`OHI-KNOWLEDGE/ohi-ui-integration.js`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/ohi-ui-integration.js)
11. [`OHI-KNOWLEDGE/test_runner.html`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/test_runner.html)

### Files Modified (Injected scripts reference):
All `code.html` files inside the directories under `stitch_ohi_worker_health_intelligence` now include:
```html
<script src="../OHI-KNOWLEDGE/knowledge-base.js"></script>
<script src="../OHI-KNOWLEDGE/ohi-engine.js"></script>
<script src="../OHI-KNOWLEDGE/ohi-ui-integration.js"></script>
```

---

## 6. How to Run the Project

Since this is a fully static client-side web application bundle:
1. Double-click the main landing page [`ohi_landing_page/code.html`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/ohi_landing_page/code.html) to run it directly in any modern web browser.
2. To test and run the 7 core validation scenarios, open the test runner page [`OHI-KNOWLEDGE/test_runner.html`](file:///d:/Ramakrishna%20Hackathon/New%20folder/stitch_ohi_worker_health_intelligence/stitch_ohi_worker_health_intelligence/OHI-KNOWLEDGE/test_runner.html) in your browser.
3. If you want to run it via a local web server (to avoid local file system limits on some browsers):
   - Run: `npx http-server "d:\Ramakrishna Hackathon\New folder\stitch_ohi_worker_health_intelligence\stitch_ohi_worker_health_intelligence"`
   - Open: `http://localhost:8080/ohi_landing_page/code.html` in your browser.
