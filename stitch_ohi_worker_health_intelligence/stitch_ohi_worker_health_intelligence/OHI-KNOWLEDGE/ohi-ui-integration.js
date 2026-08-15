// OHI Frontend Controller & UI Integration Layer
// Automatically binds page elements to OHI_ENGINE state and knowledge configurations.

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const engine = window.OHI_ENGINE;
    if (!engine) {
      console.error("OHI Engine not loaded! Ensure ohi-engine.js is imported.");
      return;
    }

    // Determine current page context
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);

    console.log("OHI UI Integration loaded for page: " + page);

    // Apply shared top navbar bilingual selector (simulated translation)
    bindBilingualSelector();

    // Route Page Specific Logic
    if (page === "code.html") {
      // Check folder name to distinguish which page it is
      const segments = window.location.pathname.split('/');
      const parentDir = segments[segments.length - 2];
      
      if (parentDir === "ohi_landing_page") {
        initLandingPage();
      } else if (parentDir === "worker_registration") {
        initRegistrationPage();
      } else if (parentDir === "worker_dashboard") {
        initWorkerDashboard();
      } else if (parentDir === "ai_health_intelligence_check_in") {
        initCheckInPage();
      } else if (parentDir === "exposure_passport") {
        initExposurePassport();
      } else if (parentDir === "health_trends") {
        initHealthTrends();
      } else if (parentDir === "admin_dashboard") {
        initAdminDashboard();
      }
    } else {
      // Fallback matching by title or body id
      const title = document.title.toLowerCase();
      if (title.includes("registration")) {
        initRegistrationPage();
      } else if (title.includes("dashboard") && title.includes("worker")) {
        initWorkerDashboard();
      } else if (title.includes("health check") || title.includes("check-in")) {
        initCheckInPage();
      } else if (title.includes("passport")) {
        initExposurePassport();
      } else if (title.includes("trends")) {
        initHealthTrends();
      } else if (title.includes("admin")) {
        initAdminDashboard();
      } else if (title.includes("landing")) {
        initLandingPage();
      }
    }
  });

  // Redirect utilities that preserve folders
  function navigateTo(targetPath) {
    window.location.href = targetPath;
  }

  // Find a button/link matching a base CSS selector whose visible text contains
  // the given substring (case-insensitive). ":contains()" and ":has(:contains())"
  // are jQuery-only pseudo-selectors and are NOT valid CSS — using them in
  // document.querySelector throws a SyntaxError in every real browser, not just
  // in tests. This helper reproduces that lookup safely with plain DOM APIs.
  function findByText(baseSelector, text) {
    const needle = text.toLowerCase();
    const candidates = document.querySelectorAll(baseSelector);
    for (const el of candidates) {
      if ((el.textContent || "").toLowerCase().includes(needle)) {
        return el;
      }
    }
    return null;
  }

  // Bind top level language toggles
  function bindBilingualSelector() {
    const langBtn = document.querySelector('header button[aria-label="Language"]') || 
                    document.querySelector('header button.text-primary') ||
                    findByText('a[href="#"]', "English");
    if (langBtn) {
      langBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const active = window.OHI_ENGINE.getActiveWorker();
        if (active) {
          active.language = active.language === "tamil" ? "english" : "tamil";
          const workers = window.OHI_ENGINE.getWorkers();
          workers[active.id] = active;
          localStorage.setItem("ohi_workers", JSON.stringify(workers));
          alert("Language toggled / மொழி மாற்றப்பட்டது: " + active.language.toUpperCase());
          window.location.reload();
        }
      });
    }
  }

  // 1. LANDING PAGE LOGIC
  function initLandingPage() {
    // Select the "Worker Entry" and "Admin Entry" buttons
    const buttons = document.querySelectorAll("main button");
    if (buttons.length >= 2) {
      const workerBtn = buttons[0];
      const adminBtn = buttons[1];

      // Worker Entry Click
      workerBtn.addEventListener("click", function () {
        const activeWorker = window.OHI_ENGINE.getActiveWorker();
        if (activeWorker) {
          navigateTo("../worker_dashboard/code.html");
        } else {
          navigateTo("../worker_registration/code.html");
        }
      });

      // Admin Entry Click
      adminBtn.addEventListener("click", function () {
        navigateTo("../admin_dashboard/code.html");
      });
    }
  }

  // 2. REGISTRATION PAGE LOGIC
  function initRegistrationPage() {
    const form = document.querySelector("form");
    if (!form) return;

    // Convert occupation input into a select dropdown for consistent hazard matching
    const occInput = document.getElementById("occupation");
    if (occInput) {
      const select = document.createElement("select");
      select.id = "occupation";
      select.className = occInput.className;
      
      const kb = window.OHI_KNOWLEDGE || {};
      const occupations = kb.occupations?.occupations || [];
      
      occupations.forEach(occ => {
        const opt = document.createElement("option");
        opt.value = occ.id;
        opt.textContent = `${occ.name_en} (${occ.name_ta})`;
        select.appendChild(opt);
      });

      occInput.parentNode.replaceChild(select, occInput);
    }

    // Add submit button handler
    const submitBtn = form.querySelector("button");
    if (submitBtn) {
      submitBtn.addEventListener("click", function (e) {
        e.preventDefault();
        
        const nameVal = document.getElementById("fullName").value.trim();
        const ageVal = document.getElementById("age").value.trim();
        const genderVal = document.getElementById("gender").value;
        const occVal = document.getElementById("occupation").value;
        const expVal = document.getElementById("experience").value.trim();
        const workplaceVal = document.getElementById("workplace").value.trim();
        const langVal = document.getElementById("language").value;
        const consentChecked = document.getElementById("consent").checked;

        if (!nameVal || !ageVal || !genderVal || !workplaceVal) {
          alert("Please fill out all mandatory fields / தயவுசெய்து அனைத்து விவரங்களையும் நிரப்பவும்.");
          return;
        }

        if (!consentChecked) {
          alert("Please accept the consent terms / தயவுசெய்து ஒப்புதல் அளிக்க கிளிக் செய்யவும்.");
          return;
        }

        const newWorker = window.OHI_ENGINE.registerWorker({
          name: nameVal,
          name_ta: langVal === "tamil" ? nameVal : null,
          age: ageVal,
          gender: genderVal,
          occupation: occVal,
          experience: expVal,
          workplace: workplaceVal,
          language: langVal
        });

        alert(`Worker Profile Generated! ID: ${newWorker.id}`);
        navigateTo("../worker_dashboard/code.html");
      });
    }
  }

  // 3. WORKER DASHBOARD LOGIC
  function initWorkerDashboard() {
    const worker = window.OHI_ENGINE.getActiveWorker();
    if (!worker) {
      alert("No active worker registered. Redirecting to registration.");
      navigateTo("../worker_registration/code.html");
      return;
    }

    // Bind profile details
    const nameEl = document.querySelector("main h1");
    if (nameEl) nameEl.textContent = `${worker.name} 👋`;

    const subNameEl = nameEl ? nameEl.nextElementSibling : null;
    if (subNameEl) {
      subNameEl.textContent = worker.language === "tamil" ? `வணக்கம் ${worker.name}` : `Welcome, ${worker.name}`;
    }

    // Bind Occupation and Workplace
    const occEl = document.querySelector("main p.text-on-surface-variant + div span");
    if (occEl) {
      const kb = window.OHI_KNOWLEDGE || {};
      const occData = kb.occupations?.occupations.find(o => o.id === worker.occupation);
      const name = occData ? (worker.language === "tamil" ? occData.name_ta : occData.name_en) : worker.occupation;
      occEl.parentNode.innerHTML = `<span class="material-symbols-outlined text-[16px]">work</span> <span>${name}, ${worker.workplace}</span>`;
    }

    // Risk Card
    const scoreValEl = document.querySelector("main section.bg-error-container .text-display");
    const scoreLvlEl = document.querySelector("main section.bg-error-container h2");
    const scoreDescEl = document.querySelector("main section.bg-error-container details div");

    if (scoreValEl && scoreLvlEl) {
      scoreValEl.innerHTML = `${worker.risk_score}<span class="text-headline-md font-headline-md text-on-error-container opacity-75">/100</span>`;
      
      // Update color and level based on score
      const riskContainer = scoreValEl.closest("section");
      let colorClass = "bg-secondary-container text-on-secondary-container border-secondary-container";
      let statusIcon = "check_circle";

      if (worker.risk_score >= 80) {
        colorClass = "bg-error-container text-on-error-container border-error-container";
        statusIcon = "error";
      } else if (worker.risk_score >= 55) {
        colorClass = "bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary-fixed-dim";
        statusIcon = "warning";
      } else if (worker.risk_score >= 35) {
        colorClass = "bg-surface-variant text-on-surface-variant border-outline-variant";
        statusIcon = "visibility";
      } else {
        colorClass = "bg-green-100 text-green-800 border-green-200";
        statusIcon = "check_circle";
      }

      riskContainer.className = `rounded-xl p-card-padding shadow-sm border flex flex-col gap-4 ${colorClass}`;
      scoreLvlEl.innerHTML = `<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">${statusIcon}</span> ${worker.risk_level.toUpperCase()}`;

      // Update description reason
      const kb = window.OHI_KNOWLEDGE || {};
      const thresholds = kb.risk_rules?.risk_scoring_rules?.thresholds || [];
      const threshold = thresholds.find(t => worker.risk_score >= (t.min || 0) && worker.risk_score <= (t.max || 100));
      
      if (scoreDescEl) {
        const actionText = threshold ? (worker.language === "tamil" ? threshold.action_ta : threshold.action_en) : "";
        scoreDescEl.innerHTML = `
          <p class="font-bold">Recommendation / பரிந்துரை:</p>
          <p>${actionText || "Keep doing regular checks."}</p>
        `;
      }
    }

    // Handle Start Checkin
    const checkinBtn = document.querySelector("main button.bg-primary");
    if (checkinBtn) {
      checkinBtn.addEventListener("click", function () {
        navigateTo("../ai_health_intelligence_check_in/code.html");
      });
    }

    // Quick Actions
    const actionBtns = document.querySelectorAll("main section:last-of-type button");
    if (actionBtns.length >= 3) {
      actionBtns[0].addEventListener("click", () => navigateTo("../exposure_passport/code.html"));
      actionBtns[1].addEventListener("click", () => navigateTo("../health_trends/code.html"));
      actionBtns[2].addEventListener("click", () => navigateTo("../worker_dashboard/code.html"));
    }

    // Bottom Navigation Bar Binding (Mobile)
    const navButtons = document.querySelectorAll("nav bottom, nav button");
    navButtons.forEach(btn => {
      const text = btn.querySelector("span:last-child")?.textContent.toLowerCase();
      if (text === "home") btn.addEventListener("click", () => navigateTo("../worker_dashboard/code.html"));
      if (text === "health") btn.addEventListener("click", () => navigateTo("../health_trends/code.html"));
      if (text === "exposure") btn.addEventListener("click", () => navigateTo("../exposure_passport/code.html"));
      if (text === "ai") btn.addEventListener("click", () => navigateTo("../ai_health_intelligence_check_in/code.html"));
      if (text === "profile") btn.addEventListener("click", () => navigateTo("../worker_registration/code.html"));
    });
  }

  // 4. AI ADAPTIVE CHECK-IN LOGIC
  function initCheckInPage() {
    const worker = window.OHI_ENGINE.getActiveWorker();
    if (!worker) {
      alert("No active worker. Please register first.");
      navigateTo("../worker_registration/code.html");
      return;
    }

    // Start screening session
    let session = window.OHI_ENGINE.startScreening(worker.id);
    const chatContainer = document.querySelector("main");
    if (!chatContainer) return;

    // Clear hardcoded messages
    chatContainer.innerHTML = `
      <div class="text-center w-full mb-2">
        <span class="inline-block bg-surface-container-low text-on-surface-variant text-label-sm font-label-sm px-3 py-1 rounded-full">
          Today / இன்று, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    `;

    // Bind active thinking context
    const contextText = document.querySelector(".bg-surface-container-low strong");
    const contextStep = document.querySelector(".bg-surface-container-low span:last-child");

    function updateThinkingContext() {
      if (!contextText || !contextStep) return;
      const occNameEn = window.OHI_KNOWLEDGE.occupations.occupations.find(o => o.id === worker.occupation)?.name_en || worker.occupation;
      const exposures = window.OHI_KNOWLEDGE.occupations.occupations.find(o => o.id === worker.occupation)?.exposures.join(", ") || "None";
      contextText.textContent = `${occNameEn} | Hazard: ${exposures} | History: ${session.extractedSymptoms.join(",") || "None"}`;
      contextStep.textContent = `Asked: ${session.history.length}`;
    }

    updateThinkingContext();

    // Render Bot Message
    function renderBotMessage(textEn, textTa, explanationEn) {
      const bubble = document.createElement("div");
      bubble.className = "flex justify-start w-full gap-2";
      
      let expHTML = "";
      if (explanationEn) {
        expHTML = `
          <details class="group border-t border-outline-variant/30 pt-2 mt-2">
            <summary class="flex items-center gap-1 cursor-pointer text-label-sm text-secondary font-medium list-none">
              <span class="material-symbols-outlined text-[14px] transition-transform group-open:rotate-180">expand_more</span>
              Why am I being asked this? / ஏன் இது கேட்கப்படுகிறது?
            </summary>
            <p class="text-label-sm text-on-surface-variant mt-2 pl-5">${explanationEn}</p>
          </details>
        `;
      }

      bubble.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0 mt-1">
          <span class="material-symbols-outlined text-[20px] text-on-secondary-container">smart_toy</span>
        </div>
        <div class="max-w-[85%] bg-surface-container-lowest border border-outline-variant/50 text-on-surface rounded-[16px] rounded-tl-sm p-4 shadow-[0_4px_20px_rgba(15,61,76,0.03)]">
          <p class="font-body-md mb-2">${textEn}</p>
          <p class="font-label-sm text-on-surface-variant leading-relaxed">${textTa}</p>
          ${expHTML}
        </div>
      `;
      chatContainer.appendChild(bubble);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Render User Message
    function renderUserMessage(textEn, textTa) {
      const bubble = document.createElement("div");
      bubble.className = "flex justify-end w-full";
      bubble.innerHTML = `
        <div class="max-w-[85%] bg-primary text-on-primary rounded-[16px] rounded-tr-sm p-4 shadow-sm">
          <p class="font-body-md text-on-primary mb-1">${textEn}</p>
          <p class="font-label-sm text-on-primary-fixed-variant opacity-90 leading-tight">${textTa}</p>
        </div>
      `;
      chatContainer.appendChild(bubble);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Render Suggestion Chips
    const chipsContainer = document.querySelector(".flex.gap-2.mb-3");
    function renderChips(question) {
      if (!chipsContainer) return;
      chipsContainer.innerHTML = "";

      if (!question || !question.options) return;

      question.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "h-16 px-6 rounded-2xl border border-outline-variant bg-surface-container-lowest text-primary hover:bg-surface-variant transition-colors flex flex-col items-center justify-center gap-1 shadow-sm whitespace-nowrap active:scale-95 duration-150 flex-1 min-w-[100px]";
        
        let icon = "check_circle";
        if (opt.value === "no" || opt.value === "never") icon = "cancel";
        if (opt.value === "sometimes") icon = "help";
        if (opt.value === "always") icon = "verified";
        if (opt.is_emergency) icon = "warning";

        btn.innerHTML = `
          <span class="material-symbols-outlined text-[24px]">${icon}</span>
          <span class="font-label-md text-primary leading-tight">${opt.label_en}</span>
          <span class="text-[10px] text-on-surface-variant leading-tight">${opt.label_ta}</span>
        `;

        btn.addEventListener("click", () => {
          handleAnswerSelect(question.id, opt.value, opt.label_en, opt.label_ta);
        });

        chipsContainer.appendChild(btn);
      });
    }

    // Process User Selection
    function handleAnswerSelect(qId, val, labelEn, labelTa) {
      renderUserMessage(labelEn, labelTa);
      
      // Update session
      session = window.OHI_ENGINE.submitAnswer(session, qId, val);
      updateThinkingContext();

      // Show typing loading effect
      showTypingIndicator(true);

      setTimeout(() => {
        showTypingIndicator(false);
        askNext();
      }, 750);
    }

    function showTypingIndicator(show) {
      let loader = document.getElementById("typing-loader");
      if (show) {
        if (!loader) {
          loader = document.createElement("div");
          loader.id = "typing-loader";
          loader.className = "flex justify-start w-full gap-2 opacity-60";
          loader.innerHTML = `
            <div class="w-8 h-8 rounded-full shrink-0"></div>
            <div class="bg-surface-container-low rounded-full px-4 py-3 flex gap-1 items-center">
              <div class="w-2 h-2 rounded-full bg-outline-variant animate-pulse"></div>
              <div class="w-2 h-2 rounded-full bg-outline-variant animate-pulse delay-75"></div>
              <div class="w-2 h-2 rounded-full bg-outline-variant animate-pulse delay-150"></div>
            </div>
          `;
          chatContainer.appendChild(loader);
        }
        chatContainer.scrollTop = chatContainer.scrollHeight;
      } else {
        if (loader) loader.remove();
      }
    }

    // Render Screening Summary Card
    function renderSummaryCard() {
      const card = document.createElement("div");
      card.className = "mt-8 border border-outline-variant bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm";
      
      const reasonsList = session.reasons_en.map((r, i) => `
        <li class="mb-2">
          <p class="font-semibold text-primary text-body-md">${r}</p>
          <p class="text-label-sm text-on-surface-variant">${session.reasons_ta[i] || ""}</p>
        </li>
      `).join("");

      let scoreColor = "text-[#4CAF50]";
      let barColor = "bg-[#4CAF50]";
      let icon = "check_circle";

      if (session.finalScore >= 80) {
        scoreColor = "text-error";
        barColor = "bg-error";
        icon = "warning";
      } else if (session.finalScore >= 55) {
        scoreColor = "text-[#FF9800]";
        barColor = "bg-[#FF9800]";
        icon = "warning";
      }

      card.innerHTML = `
        <div class="bg-surface-container-low px-4 py-3 border-b border-outline-variant flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">assessment</span>
          <h3 class="font-headline-md text-lg text-on-surface m-0">Screening Summary / திரையிடல் சுருக்கம்</h3>
        </div>
        <div class="p-4 space-y-4">
          <div>
            <h4 class="text-label-sm font-label-sm text-on-surface-variant uppercase mb-2">Detected Risk Factors / கண்டறியப்பட்ட காரணிகள்</h4>
            <ul class="list-disc list-inside space-y-1 text-on-surface">
              ${reasonsList || "<li>No major risk factors detected.</li>"}
            </ul>
          </div>
          <div>
            <h4 class="text-label-sm font-label-sm text-on-surface-variant uppercase mb-1">OHI Screening Score / திரையிடல் மதிப்பு</h4>
            <div class="flex items-center gap-3">
              <div class="text-display ${scoreColor} font-bold leading-none">${session.finalScore}</div>
              <div class="flex flex-col">
                <span class="text-label-sm text-on-surface-variant">/100</span>
                <span class="text-label-md font-bold ${scoreColor} uppercase">${session.finalLevel}</span>
              </div>
            </div>
            <div class="w-full bg-surface-variant h-2 rounded-full mt-2 overflow-hidden">
              <div class="${barColor} h-full rounded-full" style="width: ${session.finalScore}%"></div>
            </div>
          </div>
          <div class="${session.finalScore >= 55 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} p-3 rounded-lg border">
            <p class="text-label-sm text-on-surface font-medium mb-1">
              <span class="material-symbols-outlined text-[16px] align-text-bottom mr-1">${icon}</span>
              Advice / ஆலோசனை
            </p>
            <p class="text-label-sm text-on-surface-variant">
              ${session.finalScore >= 55 ? "Please visit the local clinic or a doctor soon for a proper checkup." : "Keep up healthy routines and protect yourself at work."}
            </p>
          </div>
          <p class="text-[10px] text-outline text-center uppercase tracking-wider font-semibold mt-4">
            This is an early-warning screening, NOT a medical diagnosis. / இது ஆரம்பகட்ட திரையிடல் மட்டுமே, மருத்துவ சிகிச்சை அல்ல.
          </p>
        </div>
      `;

      chatContainer.appendChild(card);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Swap bottom controls with "Back to Dashboard" button
      const bottomArea = document.querySelector(".fixed.bottom-\\[72px\\]");
      if (bottomArea) {
        bottomArea.innerHTML = `
          <div class="max-w-3xl mx-auto w-full px-gutter pb-4">
            <button onclick="window.location.href='../worker_dashboard/code.html'" class="w-full h-14 rounded-full bg-primary text-on-primary font-bold shadow-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">dashboard</span>
              Back to Dashboard / முகப்புப் பக்கத்திற்குச் செல்லவும்
            </button>
          </div>
        `;
      }
    }

    // Natural Language Input Submission Handler (Unexpected Input Section 21)
    const sendBtn = findByText("button", "send") || document.querySelector("button.bg-primary-container");
    const textInput = document.querySelector("input[type='text']");

    if (sendBtn && textInput) {
      sendBtn.addEventListener("click", () => handleTextInput());
      textInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleTextInput();
      });
    }

    function handleTextInput() {
      const text = textInput.value.trim();
      if (!text) return;
      textInput.value = "";

      renderUserMessage(text, text);

      // Show typing indicator
      showTypingIndicator(true);

      setTimeout(async () => {
        // Try extracting symptom intents first (Section 21) — the
        // deterministic branching engine stays the primary path whenever it
        // can confidently route the message to a known screening branch.
        const symptomMatched = window.OHI_ENGINE.injectSymptomIntent(session, text);
        if (symptomMatched) {
          showTypingIndicator(false);
          renderBotMessage(
            "I detected matching symptoms. Let me guide you to the screening questions.",
            "உடல்நலக் குறைபாடு கண்டறியப்பட்டது. திரையிடல் கேள்விகளுக்கு உங்களை அழைத்துச் செல்கிறேன்.",
            "OHI extracted symptoms from your natural speech input."
          );
          setTimeout(() => askNext(), 750);
          return;
        }

        // No known symptom keyword matched — this is a genuinely free-form
        // question ("is this exposure dangerous?", "what PPE should I use?").
        // Route it to Gemini if configured; otherwise fall back to the
        // original guided-choice prompt so the demo never dead-ends.
        const activeWorker = window.OHI_ENGINE.getActiveWorker && window.OHI_ENGINE.getActiveWorker();
        const geminiAvailable = window.OHI_GEMINI && window.OHI_GEMINI_CONFIG && window.OHI_GEMINI_CONFIG.GEMINI_API_KEY;

        if (geminiAvailable) {
          const result = await window.OHI_GEMINI.ask(text, activeWorker);
          showTypingIndicator(false);
          if (result.ok) {
            renderBotMessage(
              result.text,
              result.text,
              "AI-generated guidance (Gemini). This is not a medical diagnosis — for serious or worsening symptoms, see a doctor or the site clinic."
            );
            if (result.isEmergency) {
              renderBotMessage(
                "\u26a0\ufe0f If this is an emergency, please seek urgent medical care right away or call for emergency help.",
                "\u26a0\ufe0f இது அவசரநிலை என்றால், உடனடியாக மருத்துவ உதவியைப் பெறவும் அல்லது அவசர சேவையை அழைக்கவும்.",
                null
              );
            }
            renderChips(window.OHI_ENGINE.getQuestion(session.currentQuestionId));
            return;
          }
        } else {
          showTypingIndicator(false);
        }

        // Standard answer fallback or help message (Gemini unavailable/failed)
        renderBotMessage(
          "I didn't quite catch that symptom. Please select one of the choices below to keep our screening precise.",
          "எனக்குச் சரியாகப் புரியவில்லை. துல்லியமான திரையிடலுக்குக் கீழே உள்ள விருப்பங்களில் ஒன்றைத் தேர்ந்தெடுக்கவும்.",
          "Guidance for low-literacy speech fallback."
        );
        askNext();
      }, 750);
    }

    // Speech button simulation (Low literacy UI)
    const micBtn = findByText("button.bg-secondary", "mic") || findByText("button", "Speak in Tamil");
    if (micBtn) {
      micBtn.addEventListener("click", () => {
        const text = prompt("Simulate speech / குரல்வழிப் பதிவை உள்ளிடவும் (English or தமிழ்):\nExamples: 'இருமல் இருக்கு', 'My hand hurts', 'கண் எரியுது'");
        if (text) {
          textInput.value = text;
          handleTextInput();
        }
      });
    }

    // Prompt current question
    function askNext() {
      if (session.currentQuestionId === "complete_screening" || session.currentQuestionId === "emergency_terminate") {
        renderSummaryCard();
        return;
      }

      const q = window.OHI_ENGINE.getQuestion(session.currentQuestionId);
      if (!q) {
        renderSummaryCard();
        return;
      }

      // Find explanation if relevant
      let reasonEn = "";
      if (q.nhanes_variable) {
        reasonEn = `This question directly references the CDC/NHANES survey variable [${q.nhanes_variable}](https://wwwn.cdc.gov/Nchs/Nhanes/) to screen for occupational respiratory or physical hazards.`;
      }

      renderBotMessage(q.text_en, q.text_ta, reasonEn);
      renderChips(q);
    }

    // Ask first question
    askNext();

    // Bind bottom nav links
    const navButtons = document.querySelectorAll("nav button");
    navButtons.forEach(btn => {
      const text = btn.querySelector("span:last-child")?.textContent.toLowerCase();
      if (text === "home") btn.addEventListener("click", () => navigateTo("../worker_dashboard/code.html"));
      if (text === "health") btn.addEventListener("click", () => navigateTo("../health_trends/code.html"));
      if (text === "exposure") btn.addEventListener("click", () => navigateTo("../exposure_passport/code.html"));
      if (text === "ai") btn.addEventListener("click", () => navigateTo("../ai_health_intelligence_check_in/code.html"));
      if (text === "profile") btn.addEventListener("click", () => navigateTo("../worker_registration/code.html"));
    });
  }

  // 5. EXPOSURE PASSPORT LOGIC
  function initExposurePassport() {
    const worker = window.OHI_ENGINE.getActiveWorker();
    if (!worker) return;

    // Set header profile details
    const nameEl = document.querySelector("h1");
    if (nameEl) nameEl.textContent = worker.name;

    const idEl = nameEl ? nameEl.nextElementSibling : null;
    if (idEl) idEl.textContent = `ID: ${worker.id}`;

    // Load session history
    const history = window.OHI_ENGINE.getWorkerHistory(worker.id);
    const timelineContainer = document.querySelector("main div.space-y-6") || document.querySelector("main");
    if (!timelineContainer) return;

    // Render timeline or history summary
    let historyHTML = `
      <div class="bg-surface-container-lowest rounded-xl p-card-padding border border-outline-variant shadow-sm mb-6">
        <h3 class="font-headline-sm font-semibold text-primary mb-4">Cumulative Checks / திரையிடல் வரலாறு</h3>
    `;

    if (history.length === 0) {
      // Mock history for Rabi Kumar if he's active
      if (worker.id === "OHI-1001") {
        historyHTML += `
          <div class="relative pl-6 border-l-2 border-error/50 space-y-4 pb-2">
            <div class="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-error"></div>
            <div>
              <span class="text-label-sm font-semibold text-error uppercase">Aug 14, 2:30 PM - High Risk (76)</span>
              <p class="text-body-md text-on-surface">Reported cough worsening near crusher, chest tightness. Mineral Dust high risk warning.</p>
            </div>
          </div>
        `;
      } else {
        historyHTML += `<p class="text-on-surface-variant text-body-md">No screening sessions logged yet. Complete today's health check first!</p>`;
      }
    } else {
      history.forEach((session, index) => {
        let dotColor = "bg-green-500";
        let textColor = "text-green-700";
        if (session.finalScore >= 80) { dotColor = "bg-error"; textColor = "text-error"; }
        else if (session.finalScore >= 55) { dotColor = "bg-[#FF9800]"; textColor = "text-[#E65100]"; }

        const dateStr = new Date(session.endTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        historyHTML += `
          <div class="relative pl-6 border-l-2 border-outline-variant space-y-4 pb-4 timeline-item ${index === history.length - 1 ? 'last-timeline' : ''}">
            <div class="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full ${dotColor}"></div>
            <div>
              <span class="text-label-sm font-semibold ${textColor} uppercase">${dateStr} - Score: ${session.finalScore} / ${session.finalLevel}</span>
              <p class="text-body-md text-on-surface">Reasons: ${session.reasons_en.join("; ")}</p>
            </div>
          </div>
        `;
      });
    }

    historyHTML += `</div>`;
    
    // Inject timeline dynamically
    const timelineTarget = document.querySelector("main section:last-of-type") || timelineContainer;
    const div = document.createElement("div");
    div.innerHTML = historyHTML;
    timelineTarget.parentNode.insertBefore(div, timelineTarget);

    // Bind nav buttons
    const navButtons = document.querySelectorAll("nav a, nav button");
    navButtons.forEach(btn => {
      const text = btn.querySelector("span:last-child")?.textContent.toLowerCase();
      if (text === "home") btn.addEventListener("click", () => navigateTo("../worker_dashboard/code.html"));
      if (text === "health") btn.addEventListener("click", () => navigateTo("../health_trends/code.html"));
      if (text === "exposure") btn.addEventListener("click", () => navigateTo("../exposure_passport/code.html"));
      if (text === "ai") btn.addEventListener("click", () => navigateTo("../ai_health_intelligence_check_in/code.html"));
      if (text === "profile") btn.addEventListener("click", () => navigateTo("../worker_registration/code.html"));
    });
  }

  // 6. HEALTH TRENDS LOGIC
  function initHealthTrends() {
    const worker = window.OHI_ENGINE.getActiveWorker();
    if (!worker) return;

    // Set worker card details
    const nameEl = document.querySelector("main section h1");
    if (nameEl) nameEl.textContent = worker.name;

    const idEl = nameEl ? nameEl.nextElementSibling : null;
    if (idEl) idEl.textContent = `ID: ${worker.id}`;

    // Update status badge based on actual worker level
    const badgeText = document.querySelector("main section.flex.items-center.gap-3 span.font-semibold");
    if (badgeText) {
      badgeText.textContent = worker.risk_level;
      let badgeColor = "bg-green-100 text-green-800 border-green-200";
      if (worker.risk_score >= 80) badgeColor = "bg-red-100 text-red-800 border-red-200";
      else if (worker.risk_score >= 55) badgeColor = "bg-orange-100 text-orange-800 border-orange-200";
      badgeText.parentNode.className = `inline-flex items-center gap-2 rounded-full px-4 py-2 border shadow-sm ${badgeColor}`;
    }

    // Dynamic insight message
    const insightEn = document.querySelector("main section.bg-primary-fixed p.text-on-primary-fixed");
    const insightTa = document.querySelector("main section.bg-primary-fixed p.text-on-primary-fixed-variant");
    if (insightEn && insightTa) {
      if (worker.risk_score >= 55) {
        insightEn.textContent = "Action recommended. High risk features are recorded in recent check-ins.";
        insightTa.textContent = "மருத்துவ பரிசோதனை செய்ய பரிந்துரைக்கப்படுகிறது. சமீபத்திய பதிவுகளில் அறிகுறிகள் அதிகமாக உள்ளன.";
      } else {
        insightEn.textContent = "Your screening concerns remain low. Excellent protection adherence.";
        insightTa.textContent = "ஆரோக்கிய அறிகுறிகள் சீராக உள்ளன. பாதுகாப்பு கருவிகளைத் தொடர்ந்து பயன்படுத்தவும்.";
      }
    }

    // Bind nav buttons
    const navButtons = document.querySelectorAll("nav button");
    navButtons.forEach(btn => {
      const text = btn.querySelector("span:last-child")?.textContent.toLowerCase();
      if (text === "home") btn.addEventListener("click", () => navigateTo("../worker_dashboard/code.html"));
      if (text === "health") btn.addEventListener("click", () => navigateTo("../health_trends/code.html"));
      if (text === "exposure") btn.addEventListener("click", () => navigateTo("../exposure_passport/code.html"));
      if (text === "ai") btn.addEventListener("click", () => navigateTo("../ai_health_intelligence_check_in/code.html"));
      if (text === "profile") btn.addEventListener("click", () => navigateTo("../worker_registration/code.html"));
    });
  }

  // 7. ADMIN DASHBOARD LOGIC
  function initAdminDashboard() {
    const workers = window.OHI_ENGINE.getWorkers();
    const workerList = Object.values(workers);

    // Calculate Admin stats
    const totalWorkers = workerList.length;
    const lowRiskCount = workerList.filter(w => w.risk_score < 35).length;
    const medRiskCount = workerList.filter(w => w.risk_score >= 35 && w.risk_score < 55).length;
    const highRiskCount = workerList.filter(w => w.risk_score >= 55).length;

    // Update stats counters in DOM
    // Scoped specifically to the 4 stat cards (Total / Low / Moderate / High) so we
    // never accidentally match the "Dashboard" page heading, which also carries the
    // text-headline-lg class and previously shifted every counter by one index.
    const statsGrid = document.querySelector("main .grid.grid-cols-2.md\\:grid-cols-4");
    const counters = statsGrid
      ? statsGrid.querySelectorAll(":scope > div > span.text-display, :scope > div > span.text-headline-lg")
      : document.querySelectorAll("main .text-display, main .text-headline-lg");
    if (counters.length >= 4) {
      counters[0].textContent = totalWorkers;
      counters[1].textContent = lowRiskCount;
      counters[2].textContent = medRiskCount;
      counters[3].textContent = highRiskCount;
    }

    // Populate Table with Priority Workers (Risk Score descending)
    const tbody = document.querySelector("table tbody");
    if (tbody) {
      tbody.innerHTML = "";
      
      // Sort workers by score descending
      const sorted = [...workerList].sort((a, b) => b.risk_score - a.risk_score);
      
      sorted.forEach(w => {
        let riskColor = "bg-green-100 text-green-800";
        let dotColor = "bg-green-500";
        if (w.risk_score >= 80) { riskColor = "bg-red-100 text-red-800"; dotColor = "bg-red-500"; }
        else if (w.risk_score >= 55) { riskColor = "bg-orange-100 text-orange-800"; dotColor = "bg-[#FF9800]"; }
        else if (w.risk_score >= 35) { riskColor = "bg-yellow-100 text-yellow-800"; dotColor = "bg-yellow-500"; }

        // Find exposure flag icon
        let flagIcon = "safety_divider";
        let flagText = "General";
        if (w.occupation === "mining_quarry") { flagIcon = "pulmonology"; flagText = "Respiratory"; }
        else if (w.occupation === "construction") { flagIcon = "handyman"; flagText = "Physical Strain"; }
        else if (w.occupation === "welding_fabrication") { flagIcon = "visibility"; flagText = "Ocular/Fume"; }
        else if (w.occupation === "textile") { flagIcon = "back_hand"; flagText = "Repetitive Work"; }
        else if (w.occupation === "chemical_industrial") { flagIcon = "science"; flagText = "Toxic Exposure"; }

        const tr = document.createElement("tr");
        tr.className = "border-b border-outline-variant hover:bg-surface-bright transition-colors cursor-pointer group";
        
        tr.innerHTML = `
          <td class="p-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-xs">${w.name.charAt(0)}</div>
              <span class="text-body-md font-body-md font-medium text-on-surface group-hover:text-primary transition-colors">${w.name}</span>
            </div>
          </td>
          <td class="p-4 text-body-md font-body-md text-on-surface-variant">${w.id}</td>
          <td class="p-4">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${riskColor}">
              <span class="w-1.5 h-1.5 rounded-full ${dotColor}"></span> ${w.risk_level} (${w.risk_score})
            </span>
          </td>
          <td class="p-4 text-body-md font-body-md text-on-surface-variant flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px]" data-icon="${flagIcon}">${flagIcon}</span>
            ${flagText}
          </td>
          <td class="p-4 text-right">
            <button class="text-secondary hover:text-primary-container p-2 rounded-full hover:bg-surface-variant transition-colors">
              <span class="material-symbols-outlined text-[20px]" data-icon="chevron_right">chevron_right</span>
            </button>
          </td>
        `;

        // Clicking a row makes that worker active and opens their dashboard
        tr.addEventListener("click", () => {
          window.OHI_ENGINE.setActiveWorker(w.id);
          alert(`Switching active worker view to: ${w.name}`);
          navigateTo("../worker_dashboard/code.html");
        });

        tbody.appendChild(tr);
      });
    }

    // Bind nav buttons
    const navButtons = document.querySelectorAll("nav a, nav button");
    navButtons.forEach(btn => {
      const text = btn.querySelector("span:last-child")?.textContent.toLowerCase();
      if (text === "dashboard" || text === "home") btn.addEventListener("click", () => navigateTo("../admin_dashboard/code.html"));
      if (text === "worker directory" || text === "profile") btn.addEventListener("click", () => navigateTo("../worker_registration/code.html"));
    });
  }
})();
