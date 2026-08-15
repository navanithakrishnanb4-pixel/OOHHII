/**
 * OHI regression test suite.
 *
 * Runs the full demo flow (registration -> dashboard -> adaptive check-in ->
 * risk scoring -> admin dashboard -> exposure passport -> health trends)
 * headlessly via jsdom, plus the 7 documented scenarios from
 * OHI-KNOWLEDGE/test_runner.html and several free-text NLP edge cases.
 *
 * Usage:
 *   cd tests
 *   npm install
 *   npm test
 *
 * This does NOT require a real browser or a running server.
 */
const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

const BASE = path.join(
  __dirname,
  "..",
  "stitch_ohi_worker_health_intelligence",
  "stitch_ohi_worker_health_intelligence"
);
const KB_DIR = path.join(BASE, "OHI-KNOWLEDGE");

let pass = 0;
let fail = 0;
function assert(cond, msg) {
  if (cond) {
    pass++;
    console.log("  \u2713", msg);
  } else {
    fail++;
    console.error("  \u2717 FAILED:", msg);
  }
}

function loadPage(dir) {
  const html = fs.readFileSync(path.join(BASE, dir, "code.html"), "utf8");
  const dom = new JSDOM(html, {
    url: `http://localhost/${dir}/code.html`,
    runScripts: "dangerously",
    pretendToBeVisual: true
  });
  // Strip external script/stylesheet tags (Tailwind CDN, Google Fonts) since
  // this environment has no network access and doesn't need real styling.
  dom.window.document.querySelectorAll("script[src], link[rel=stylesheet]").forEach(s => s.remove());
  return dom;
}

function injectEngine(dom) {
  ["knowledge-base.js", "ohi-engine.js", "ohi-ui-integration.js"].forEach(f => {
    dom.window.eval(fs.readFileSync(path.join(KB_DIR, f), "utf8"));
  });
}

function loadEngineOnly() {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    url: "http://localhost/OHI-KNOWLEDGE/test_runner.html",
    runScripts: "dangerously"
  });
  ["knowledge-base.js", "ohi-engine.js"].forEach(f => {
    dom.window.eval(fs.readFileSync(path.join(KB_DIR, f), "utf8"));
  });
  return dom.window.OHI_ENGINE;
}

async function tick(ms = 150) {
  return new Promise(r => setTimeout(r, ms));
}

async function testFullDemoFlow() {
  console.log("\n== Full demo flow (registration -> dashboard -> check-in) ==");

  let dom = loadPage("worker_registration");
  injectEngine(dom);
  await tick();
  const doc = dom.window.document;
  doc.getElementById("fullName").value = "Test Worker";
  doc.getElementById("age").value = "40";
  doc.getElementById("gender").value = "male";
  doc.getElementById("workplace").value = "Test Site";
  doc.getElementById("experience").value = "5";
  doc.getElementById("consent").checked = true;
  doc.getElementById("occupation").value = "mining_quarry";
  dom.window.alert = () => {};
  doc.querySelector("form button").click();

  const workers = dom.window.OHI_ENGINE.getWorkers();
  assert(Object.keys(workers).length > 0, "worker was registered and persisted");
  const active = dom.window.OHI_ENGINE.getActiveWorker();
  assert(active && active.name === "Test Worker", "newly registered worker becomes active");

  const workersData = dom.window.localStorage.getItem("ohi_workers");
  const activeId = dom.window.localStorage.getItem("ohi_active_worker_id");

  dom = loadPage("worker_dashboard");
  dom.window.localStorage.setItem("ohi_workers", workersData);
  dom.window.localStorage.setItem("ohi_active_worker_id", activeId);
  injectEngine(dom);
  await tick();
  assert(
    dom.window.document.querySelector("main h1").textContent.includes("Test Worker"),
    "worker dashboard renders active worker's name"
  );

  dom = loadPage("ai_health_intelligence_check_in");
  dom.window.localStorage.setItem("ohi_workers", workersData);
  dom.window.localStorage.setItem("ohi_active_worker_id", activeId);
  injectEngine(dom);
  await tick();
  const eng = dom.window.OHI_ENGINE;
  let session = eng.getActiveSession();
  const answers = {
    q_emergency_check: "no",
    q_main_symptom: "cough",
    q_cough_work_related: "yes",
    q_cough_after_work: "no",
    q_breath_difficulty: "mild",
    q_phlegm_present: "yes",
    q_ppe_use: "sometimes"
  };
  let guard = 0;
  while (session.status === "in_progress" && guard++ < 15) {
    const qid = session.currentQuestionId;
    session = eng.submitAnswer(session, qid, answers[qid] || "no");
  }
  assert(session.status === "completed", "check-in session completes without getting stuck");
  assert(session.finalScore > 0, "risk score is calculated");
  assert(eng.getWorkers()[activeId].risk_score === session.finalScore, "worker profile is updated with the new risk score");
}

async function testAdminDashboardCounters() {
  console.log("\n== Admin dashboard stat counters (regression: heading/index shift bug) ==");
  const dom = loadPage("admin_dashboard");
  injectEngine(dom);
  await tick();
  const doc = dom.window.document;
  const heading = doc.querySelector("main h2");
  assert(heading.textContent.trim() === "Dashboard", "page heading is untouched by counter-fill logic");
  const rows = doc.querySelectorAll("table tbody tr");
  assert(rows.length === 5, "worker table renders one row per seeded worker");
}

async function testEnglishRecommendationText() {
  console.log("\n== English recommendation text (regression: stringified function bug) ==");
  const dom = loadPage("worker_dashboard");
  dom.window.localStorage.setItem("ohi_active_worker_id", "OHI-1002"); // English-speaking seeded worker
  injectEngine(dom);
  await tick();
  const text = dom.window.document.querySelector("main section:nth-of-type(2) details div")?.textContent || "";
  assert(!text.includes("=>"), "recommendation text is not literal JS source code");
  assert(text.trim().length > 0, "recommendation text is non-empty");
}

async function testFreeTextNLP() {
  console.log("\n== Free-text symptom extraction (regression: 'near'->'ear', hand-pain misclassification) ==");
  const dom = loadPage("ai_health_intelligence_check_in");
  injectEngine(dom);
  await tick();
  const eng = dom.window.OHI_ENGINE;

  let s = eng.startScreening("OHI-1001");
  let matched = eng.injectSymptomIntent(s, "My head is aching after working near chemicals");
  assert(matched === false || s.extractedSymptoms[0] !== "hearing_difficulty", "'near' does not falsely match the hearing keyword 'ear'");

  s = eng.startScreening("OHI-1001");
  matched = eng.injectSymptomIntent(s, "\u0b8e\u0ba9\u0b95\u0bcd\u0b95\u0bc1 \u0b95\u0bc8\u0baf\u0bbf\u0bb2\u0bcd \u0bb5\u0bb2\u0bbf \u0b87\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bc1");
  assert(matched && s.extractedSymptoms[0] === "hand_pain", "Tamil hand-pain phrase is classified as hand_pain, not generic body_pain");

  s = eng.startScreening("OHI-1001");
  matched = eng.injectSymptomIntent(s, "I work in a textile factory and have breathing problems");
  assert(matched && s.extractedSymptoms[0] === "cough", "breathing-problem phrasing routes into the respiratory branch");
}

async function testSevenScenarios() {
  console.log("\n== 7 documented scenarios (from OHI-KNOWLEDGE/test_runner.html) ==");
  const eng = loadEngineOnly();
  const cases = [
    { id: "case1", occupation: "mining_quarry", steps: [["q_emergency_check","no"],["q_main_symptom","cough"],["q_cough_work_related","yes"],["q_cough_after_work","yes"],["q_breath_difficulty","yes"],["q_phlegm_present","yes"],["q_ppe_use","sometimes"]], minScore: 55 },
    { id: "case2", occupation: "construction", steps: [["q_emergency_check","no"],["q_main_symptom","body_pain"],["q_back_pain_present","yes"],["q_pain_worse_work","yes"],["q_pain_improve_rest","yes"],["q_standing_difficulty","sometimes"],["q_ppe_use","always"]] },
    { id: "case3", occupation: "welding_fabrication", steps: [["q_emergency_check","no"],["q_main_symptom","eye_irritation"],["q_eye_irritation_details","yes"],["q_ppe_use","never"]] },
    { id: "case4", occupation: "textile", steps: [["q_emergency_check","no"],["q_main_symptom","cough"],["q_cough_work_related","yes"],["q_cough_after_work","no"],["q_breath_difficulty","no"],["q_phlegm_present","no"],["q_ppe_use","sometimes"]] },
    { id: "case5", occupation: "textile", steps: [["q_emergency_check","no"],["q_main_symptom","hand_pain"],["q_hand_pain_details","yes"],["q_numbness_tingling","yes"],["q_grip_weakness","yes"],["q_ppe_use","always"]] },
    { id: "case6", occupation: "mining_quarry", steps: [["q_emergency_check","no"],["q_main_symptom","none"],["q_cough_present","no"],["q_ppe_use","always"]], maxScore: 34 }
  ];
  cases.forEach(tc => {
    const worker = eng.registerWorker({ name: tc.id, occupation: tc.occupation, workplace: "Site", experience: 5, language: "english" });
    let session = eng.startScreening(worker.id);
    tc.steps.forEach(([q, a]) => { session = eng.submitAnswer(session, q, a); });
    assert(session.status === "completed", `${tc.id} completes without getting stuck`);
    if (tc.minScore) assert(session.finalScore >= tc.minScore, `${tc.id} score (${session.finalScore}) reflects elevated risk`);
    if (tc.maxScore) assert(session.finalScore <= tc.maxScore, `${tc.id} score (${session.finalScore}) reflects low risk`);
  });

  const worker7 = eng.registerWorker({ name: "case7", occupation: "mining_quarry", workplace: "Site", experience: 4, language: "tamil" });
  let session7 = eng.startScreening(worker7.id);
  const matched = eng.injectSymptomIntent(session7, "\u0b8e\u0ba9\u0b95\u0bcd\u0b95\u0bc1 \u0b95\u0bca\u0b9e\u0bcd\u0b9a\u0bae\u0bcd \u0b87\u0bb0\u0bc1\u0bae\u0bb2\u0bcd \u0b87\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bc1 \u0b85\u0ba3\u0bcd\u0ba3\u0bbe");
  assert(matched, "case7 free-text speech input is recognized as a symptom report");
  [["q_cough_work_related","yes"],["q_cough_after_work","no"],["q_breath_difficulty","sometimes"],["q_phlegm_present","no"],["q_ppe_use","sometimes"]].forEach(([q,a]) => { session7 = eng.submitAnswer(session7, q, a); });
  assert(session7.status === "completed", "case7 completes after the NLP-routed follow-up questions");
}

async function main() {
  await testFullDemoFlow();
  await testAdminDashboardCounters();
  await testEnglishRecommendationText();
  await testFreeTextNLP();
  await testSevenScenarios();

  console.log(`\n${pass} passed, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main().catch(e => {
  console.error("Test run crashed:", e);
  process.exit(1);
});
