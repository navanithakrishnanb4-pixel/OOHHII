// OHI Intelligence and Adaptive Branching Engine
// Governs state, registration, branching flow, keyword symptom extraction, and rule-based risk calculation.

(function () {
  // Ensure Knowledge Base is loaded
  function getKnowledge() {
    return window.OHI_KNOWLEDGE || {};
  }

  // Persistent Storage Keys
  const WORKERS_KEY = "ohi_workers";
  const ACTIVE_WORKER_KEY = "ohi_active_worker_id";
  const SESSIONS_KEY = "ohi_checkin_sessions";

  // Natural Language Keyword Dictionary for Symptom Intent Extraction (Bilingual)
  // Order matters: more specific symptom categories are listed before generic
  // catch-all categories (body_pain, fatigue) so that when free text matches more
  // than one category (e.g. "hand pain" also contains the generic word "pain"),
  // the more specific match is reported first as the primary symptom.
  const SYMPTOM_KEYWORDS = [
    {
      symptom: "hand_pain",
      terms: [
        "hand", "wrist", "finger", "fingers", "numb", "numbness", "tingling",
        "kai", "கை", "மணிக்கட்டு", "விரல்", "மரத்து", "மரத்துப்", "மரத்துப்போச்சு"
      ]
    },
    {
      symptom: "eye_irritation",
      terms: [
        "eye", "eyes", "burning eye", "watering eye", "eye pain", "eye burning", "blurry", "vision",
        "kan", "கண்", "கண்கள்", "எரிச்சல்", "நீர் வடிதல்", "கண் வலி", "கண் எரிச்சல்", "கண்ணில்"
      ]
    },
    {
      symptom: "hearing_difficulty",
      terms: [
        "hearing", "ear", "ears", "ringing", "buzzing", "tinnitus",
        "kaadhu", "காது", "கேட்கவில்லை", "காது இரைச்சல்"
      ]
    },
    {
      symptom: "skin_rash",
      terms: [
        "skin", "rash", "itch", "itching", "dermatitis", "burn", "burning skin",
        "thol", "தோல்", "அரிப்பு", "தடிப்பு", "தோல் வறட்சி", "தோலில்"
      ]
    },
    {
      symptom: "cough",
      terms: [
        "cough", "coughing", "irumal", "இருமல்", "இருமலாக", "இருமுறது", "dry cough",
        // Breathing/chest phrasing routes into the same respiratory branch as cough.
        "breath", "breathing", "breathless", "chest", "chest pain", "chest tightness",
        "wheeze", "wheezing", "மூச்சு", "மூச்சுத்திணறல்", "நெஞ்சு", "நெஞ்சு வலி"
      ]
    },
    {
      symptom: "body_pain",
      terms: [
        "back", "shoulder", "joint", "body pain", "back pain", "muscle pain", "lifting",
        "vali", "வலி", "முதுகு", "தோள்", "முட்டி", "உடல் வலி", "வலிக்குது", "தூக்கியதால்"
      ]
    },
    {
      symptom: "fatigue",
      terms: [
        "tired", "fatigue", "dizzy", "dizziness", "exhausted", "thirst", "headache", "head ache",
        "weak", "weakness", "nausea", "vomit",
        "sorvu", "சோர்வு", "தலைச்சுற்றல்", "தலைசுற்றல்", "மயக்கம்", "தாகம்", "தலைவலி", "நிலைகுலைவு"
      ]
    }
  ];

  // Initialize Default Simulated Workers (If none exist)
  function initDefaultWorkers() {
    let workers = JSON.parse(localStorage.getItem(WORKERS_KEY));
    if (!workers || Object.keys(workers).length === 0) {
      workers = {
        "OHI-1001": {
          id: "OHI-1001",
          name: "Ravi Kumar",
          name_ta: "ரவி குமார்",
          age: 42,
          gender: "male",
          occupation: "mining_quarry",
          workplace: "Quarry A",
          experience: 8,
          language: "tamil",
          ppe_usage: "sometimes",
          risk_score: 76,
          risk_level: "Higher concern",
          last_checkin: "2026-08-14T14:30:00Z"
        },
        "OHI-1002": {
          id: "OHI-1002",
          name: "Arun Chinappa",
          name_ta: "அருண் சின்னப்பா",
          age: 29,
          gender: "male",
          occupation: "construction",
          workplace: "BuildSite B",
          experience: 4,
          language: "english",
          ppe_usage: "always",
          risk_score: 15,
          risk_level: "Low concern",
          last_checkin: "2026-08-13T10:00:00Z"
        },
        "OHI-1003": {
          id: "OHI-1003",
          name: "Malarvizhi S.",
          name_ta: "மலர்விழி எஸ்.",
          age: 35,
          gender: "female",
          occupation: "textile",
          workplace: "Textile Mill C",
          experience: 10,
          language: "tamil",
          ppe_usage: "never",
          risk_score: 45,
          risk_level: "Needs attention",
          last_checkin: "2026-08-12T16:15:00Z"
        },
        "OHI-1004": {
          id: "OHI-1004",
          name: "Karthik Raja",
          name_ta: "கார்த்திக் ராஜா",
          age: 31,
          gender: "male",
          occupation: "welding_fabrication",
          workplace: "Metal Fab D",
          experience: 6,
          language: "english",
          ppe_usage: "sometimes",
          risk_score: 52,
          risk_level: "Needs attention",
          last_checkin: "2026-08-11T09:30:00Z"
        },
        "OHI-1005": {
          id: "OHI-1005",
          name: "Sundar Rajan",
          name_ta: "சுந்தர் ராஜன்",
          age: 48,
          gender: "male",
          occupation: "chemical_industrial",
          workplace: "ChemPlant E",
          experience: 12,
          language: "tamil",
          ppe_usage: "always",
          risk_score: 22,
          risk_level: "Low concern",
          last_checkin: "2026-08-10T11:00:00Z"
        }
      };
      localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));
    }

    // Default active worker ID if not set
    if (!localStorage.getItem(ACTIVE_WORKER_KEY)) {
      localStorage.setItem(ACTIVE_WORKER_KEY, "OHI-1001");
    }
  }

  // Core OHI Engine Object
  window.OHI_ENGINE = {
    init: function () {
      initDefaultWorkers();
    },

    // Worker Profile Management
    getWorkers: function () {
      return JSON.parse(localStorage.getItem(WORKERS_KEY)) || {};
    },

    getActiveWorker: function () {
      const id = localStorage.getItem(ACTIVE_WORKER_KEY);
      const workers = this.getWorkers();
      return workers[id] || workers["OHI-1001"] || null;
    },

    setActiveWorker: function (id) {
      localStorage.setItem(ACTIVE_WORKER_KEY, id);
    },

    registerWorker: function (profile) {
      const workers = this.getWorkers();
      const nextId = "OHI-" + (1000 + Object.keys(workers).length + 1);
      
      const newWorker = {
        id: nextId,
        name: profile.name,
        name_ta: profile.name_ta || profile.name,
        age: parseInt(profile.age) || 30,
        gender: profile.gender || "male",
        occupation: profile.occupation || "other",
        workplace: profile.workplace || "General Site",
        experience: parseInt(profile.experience) || 1,
        language: profile.language || "english",
        ppe_usage: "sometimes", // Default, will update upon screening
        risk_score: 10, // Default base
        risk_level: "Low concern",
        last_checkin: null
      };

      workers[nextId] = newWorker;
      localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));
      localStorage.setItem(ACTIVE_WORKER_KEY, nextId);
      return newWorker;
    },

    // NLP Symptom Extraction
    // Short ASCII terms (e.g. "ear", "eye") are matched on word boundaries so they
    // don't falsely trigger inside unrelated words (e.g. "near" contains "ear").
    // Tamil terms are matched by substring since they are already long/specific
    // compound words with negligible collision risk, and \b does not work
    // reliably across non-Latin scripts in JS regex.
    extractSymptomsFromText: function (text) {
      if (!text) return [];
      const cleanText = text.toLowerCase();
      const detected = [];

      for (const entry of SYMPTOM_KEYWORDS) {
        for (const term of entry.terms) {
          const isAsciiTerm = /^[a-z0-9\s]+$/i.test(term);
          let isMatch;
          if (isAsciiTerm) {
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            isMatch = new RegExp("\\b" + escaped + "\\b", "i").test(cleanText);
          } else {
            isMatch = cleanText.includes(term);
          }
          if (isMatch) {
            detected.push(entry.symptom);
            break; // Move to next symptom group
          }
        }
      }
      return detected;
    },

    // Screening Session State
    startScreening: function (workerId) {
      const workers = this.getWorkers();
      const worker = workers[workerId] || this.getActiveWorker();
      
      const session = {
        workerId: worker.id,
        startTime: new Date().toISOString(),
        currentQuestionId: "q_emergency_check",
        history: [],
        answers: {},
        status: "in_progress",
        extractedSymptoms: [],
        finalScore: 0,
        finalLevel: "Low concern",
        reasons_en: [],
        reasons_ta: []
      };

      this.saveSession(session);
      return session;
    },

    getActiveSession: function () {
      const sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY)) || {};
      const activeWorker = this.getActiveWorker();
      if (!activeWorker) return null;

      // Find an in-progress session for the active worker
      for (const id in sessions) {
        if (sessions[id].workerId === activeWorker.id && sessions[id].status === "in_progress") {
          return sessions[id];
        }
      }
      return null;
    },

    saveSession: function (session) {
      const sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY)) || {};
      const sessionId = session.workerId + "_" + new Date(session.startTime).getTime();
      sessions[sessionId] = session;
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    },

    getQuestion: function (questionId) {
      const kb = getKnowledge();
      const questions = kb.question_bank?.questions || [];
      return questions.find(q => q.id === questionId) || null;
    },

    // Submit Answer & Branch
    submitAnswer: function (session, questionId, value) {
      session.answers[questionId] = value;
      session.history.push(questionId);

      const kb = getKnowledge();
      const branchingRules = kb.branching_rules?.rules || [];
      const rule = branchingRules.find(r => r.question_id === questionId);

      let nextQuestionId = "complete_screening";

      if (rule) {
        // Find if any branch condition matches
        const branch = rule.branches.find(b => b.condition === value || b.condition === "always");
        if (branch) {
          if (branch.next_question_by_occupation) {
            const worker = this.getWorkers()[session.workerId];
            const occ = worker ? worker.occupation : "default";
            nextQuestionId = branch.next_question_by_occupation[occ] || branch.next_question_by_occupation["default"];
          } else {
            nextQuestionId = branch.next_question;
          }
        }
      }

      // Safeguard against loops or missing questions
      if (nextQuestionId !== "complete_screening" && nextQuestionId !== "emergency_terminate") {
        const nextQ = this.getQuestion(nextQuestionId);
        if (!nextQ) {
          nextQuestionId = "complete_screening";
        }
      }

      session.currentQuestionId = nextQuestionId;

      if (nextQuestionId === "complete_screening" || nextQuestionId === "emergency_terminate") {
        this.completeScreeningSession(session, nextQuestionId === "emergency_terminate");
      } else {
        this.saveSession(session);
      }

      return session;
    },

    // Inject Custom Symptom Direct Entry (Section 21 - Unexpected Input)
    injectSymptomIntent: function (session, text) {
      const detected = this.extractSymptomsFromText(text);
      if (detected.length > 0) {
        // Record that we detected these symptoms
        session.extractedSymptoms = detected;
        const mainSymptom = detected[0]; // Take primary symptom
        
        // Map detected symptom to the correct question branch
        let nextQuestionId = "q_ppe_use";
        if (mainSymptom === "cough") nextQuestionId = "q_cough_work_related";
        else if (mainSymptom === "body_pain") nextQuestionId = "q_back_pain_present";
        else if (mainSymptom === "hand_pain") nextQuestionId = "q_hand_pain_details";
        else if (mainSymptom === "eye_irritation") nextQuestionId = "q_eye_irritation_details";
        else if (mainSymptom === "hearing_difficulty") nextQuestionId = "q_hearing_details";
        else if (mainSymptom === "skin_rash") nextQuestionId = "q_skin_details";
        else if (mainSymptom === "fatigue") nextQuestionId = "q_ppe_use";

        session.currentQuestionId = nextQuestionId;
        session.answers["q_main_symptom"] = mainSymptom;
        session.history.push("q_main_symptom");
        this.saveSession(session);
        return true;
      }
      return false; // No symptom found, standard text reply
    },

    // Complete Session & Compute Explainable Risk
    completeScreeningSession: function (session, isEmergency) {
      session.status = "completed";
      session.endTime = new Date().toISOString();

      if (isEmergency) {
        session.finalScore = 100;
        session.finalLevel = "Urgent evaluation recommended";
        session.reasons_en = ["EMERGENCY SYMPTOM REPORTED: Severe breathing difficulties, chest pain or hemoptysis."];
        session.reasons_ta = ["அவசர அறிகுறி கண்டறியப்பட்டுள்ளது: கடுமையான நெஞ்சு வலி, மூச்சுத்திணறல் அல்லது இருமலில் ரத்தம்."];
      } else {
        this.calculateRisk(session);
      }

      // Update worker profile
      const workers = this.getWorkers();
      const worker = workers[session.workerId];
      if (worker) {
        worker.risk_score = session.finalScore;
        worker.risk_level = session.finalLevel;
        worker.last_checkin = session.endTime;
        if (session.answers["q_ppe_use"]) {
          worker.ppe_usage = session.answers["q_ppe_use"];
        }
        workers[session.workerId] = worker;
        localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));
      }

      this.saveSession(session);
    },

    calculateRisk: function (session) {
      const kb = getKnowledge();
      const riskRules = kb.risk_rules?.risk_scoring_rules || {};
      const workers = this.getWorkers();
      const worker = workers[session.workerId] || {};

      let score = riskRules.base_score || 10;
      const reasons_en = [];
      const reasons_ta = [];

      // Extract symptoms from answers
      const symptoms = [];
      if (session.answers["q_main_symptom"]) {
        symptoms.push(session.answers["q_main_symptom"]);
      }
      if (session.answers["q_cough_present"] && session.answers["q_cough_present"] !== "no") {
        symptoms.push("cough");
      }
      if (session.answers["q_breath_difficulty"] && session.answers["q_breath_difficulty"] !== "no") {
        symptoms.push("breath_difficulty");
      }
      if (session.answers["q_phlegm_present"] && session.answers["q_phlegm_present"] !== "no") {
        symptoms.push("phlegm");
      }
      if (session.answers["q_back_pain_present"] && session.answers["q_back_pain_present"] !== "no") {
        symptoms.push("back_pain");
      }
      if (session.answers["q_hand_pain_details"] && session.answers["q_hand_pain_details"] !== "no") {
        symptoms.push("hand_pain");
      }
      if (session.answers["q_numbness_tingling"] && session.answers["q_numbness_tingling"] !== "no") {
        symptoms.push("numbness_tingling");
      }
      if (session.answers["q_eye_irritation_details"] && session.answers["q_eye_irritation_details"] !== "no") {
        symptoms.push("eye_burning");
      }
      if (session.answers["q_hearing_details"] && session.answers["q_hearing_details"] !== "no") {
        symptoms.push("hearing_difficulty");
      }
      if (session.answers["q_ringing_ears"] && session.answers["q_ringing_ears"] !== "no") {
        symptoms.push("ringing_ears");
      }
      if (session.answers["q_skin_details"] && session.answers["q_skin_details"] !== "no") {
        symptoms.push("skin_rash");
      }

      // Add any pre-extracted symptom intents
      if (session.extractedSymptoms) {
        session.extractedSymptoms.forEach(s => {
          if (!symptoms.includes(s)) symptoms.push(s);
        });
      }

      // 1. Exposure and Symptom Overlap Rules
      const overlapRules = riskRules.exposure_symptom_overlap_rules || [];
      overlapRules.forEach(rule => {
        if (worker.occupation === rule.occupation) {
          const match = rule.symptoms.some(s => symptoms.includes(s));
          if (match) {
            score += rule.points;
            reasons_en.push(rule.reason_en);
            reasons_ta.push(rule.reason_ta);
          }
        }
      });

      // 2. Work Relation Rules
      const workRules = riskRules.work_relation_rules || [];
      workRules.forEach(rule => {
        if (session.answers[rule.trigger_question] === rule.answer) {
          score += rule.points;
          reasons_en.push(rule.reason_en);
          reasons_ta.push(rule.reason_ta);
        }
      });

      // 3. Severity Rules
      const severityRules = riskRules.severity_rules || [];
      severityRules.forEach(rule => {
        if (session.answers[rule.trigger_question] === rule.answer) {
          score += rule.points;
          reasons_en.push(rule.reason_en);
          reasons_ta.push(rule.reason_ta);
        }
      });

      // 4. PPE Rules
      const ppeRules = riskRules.ppe_rules || [];
      const ppeAns = session.answers["q_ppe_use"];
      if (ppeAns) {
        const rule = ppeRules.find(r => r.answer === ppeAns);
        if (rule) {
          score += rule.points;
          reasons_en.push(rule.reason_en);
          reasons_ta.push(rule.reason_ta);
        }
      }

      // Bound Score
      score = Math.max(riskRules.min_score, Math.min(riskRules.max_score, score));
      session.finalScore = score;

      // Classify Threshold
      let finalLevel = "Low concern";
      const thresholds = riskRules.thresholds || [];
      for (const t of thresholds) {
        const minVal = t.min || 0;
        const maxVal = t.max || 100;
        if (score >= minVal && score <= maxVal) {
          finalLevel = t.level;
          break;
        }
      }

      session.finalLevel = finalLevel;
      session.reasons_en = reasons_en;
      session.reasons_ta = reasons_ta;
    },

    // Fetch History of Sessions for a Worker
    getWorkerHistory: function (workerId) {
      const sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY)) || {};
      const history = [];
      for (const id in sessions) {
        if (sessions[id].workerId === workerId && sessions[id].status === "completed") {
          history.push(sessions[id]);
        }
      }
      // Sort by date descending
      return history.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
    }
  };

  // Initialize engine on load
  window.OHI_ENGINE.init();
})();
