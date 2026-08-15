# OHI Platform — Audit Report

## 1. Architecture summary

This is a **static, client-side web app**. No build step, no server, no database beyond the browser.

```
ohi_landing_page/ -> worker_registration/ -> worker_dashboard/ -> ai_health_intelligence_check_in/
                                                    |
                                    exposure_passport/, health_trends/
admin_dashboard/  (operator view: pick a worker -> becomes their dashboard)
```

- **Frontend:** Tailwind-styled `code.html` pages (Stitch-generated), one per screen. No framework, no bundler.
- **"Backend":** none. `OHI_ENGINE` (`OHI-KNOWLEDGE/ohi-engine.js`) is a plain JS object that reads/writes `localStorage` (`ohi_workers`, `ohi_active_worker_id`, `ohi_checkin_sessions`).
- **Knowledge layer:** `occupations.json`, `question_bank.json`, `branching_rules.json`, `risk_rules.json`, `symptom_domains.json`, `exposure_knowledge.json`, `sources.json` — all internally consistent (verified programmatically: no dangling question-ID references).
- **UI binding:** `ohi-ui-integration.js` does DOM-selector-based binding per page (no virtual DOM, no data-binding framework — selectors have to exactly match the static HTML, which is fragile; two of the bugs below were exactly this kind of mismatch).
- **"AI":** a deterministic branching questionnaire (`branching_rules.json`) plus a keyword-based free-text matcher (`SYMPTOM_KEYWORDS` in `ohi-engine.js`). **Not an LLM** — no API calls anywhere in the codebase.
- **Auth/multi-user:** none. Whoever has the browser sees whichever worker is "active" in `localStorage`. Admin dashboard lets you switch the active worker (this doubles as the operator-assisted workflow).

The README previously described a "future Java Spring Boot + MongoDB backend" as if it were part of the current architecture. I corrected this — it's a roadmap note, not a shipped component.

## 2. Gap analysis

| Area | Status | Notes |
|---|---|---|
| Worker registration | **WORKING** | Verified end-to-end; all form field IDs match JS bindings. |
| Multi-worker support | **WORKING** | 5 seeded demo workers + unlimited registrations, keyed by `OHI-####` ID. |
| Worker data persistence | **WORKING** (browser-local only) | Persists in `localStorage`, not across devices/browsers. No real backend. |
| Tamil UI | **WORKING** | All question text, options, and recommendations have `_ta` variants. |
| English UI | **WORKING** | — |
| Guided/adaptive screening | **WORKING** | Branching engine correctly routes by occupation + answer; verified with all 7 documented scenarios + full jsdom regression suite. |
| Risk assessment & scoring | **WORKING** | Transparent, rule-based, explainable (reasons array in English + Tamil). Thresholds: 0–34 Low, 35–54 Needs attention, 55–79 Higher concern, 80–100 Urgent. |
| Screening history | **WORKING** | Exposure Passport timeline renders past sessions per worker. |
| Emergency escalation | **WORKING** | `q_emergency_check` is always the first question; "yes" immediately terminates with a 100/100 urgent result. |
| Admin dashboard | **WORKING**, was **BROKEN** | Stat counters were silently wrong (see bug #1 below) — now fixed. |
| Operator-assisted / no-smartphone workflow | **PARTIALLY WORKING** | Admin can select any worker and drive their screening from a shared device — this satisfies the "assisted access" requirement, but there's no distinct "operator" identity/login; it's implicit. |
| Free-text symptom understanding | **PARTIALLY WORKING** | Keyword matcher over ~7 symptom categories, not true arbitrary-question understanding. Two real misclassification bugs fixed (see below); still limited to phrases matching a keyword. |
| "AI handles arbitrary occupational-health questions" (per original spec) | **MISSING** | The current matcher cannot answer something like "what should I do if I feel dizzy after handling this chemical" with a generated, context-aware response — it can only route to a pre-built branch if a known symptom keyword is present, or say "I didn't catch that." Genuine free-form Q&A requires an LLM call, which requires a backend to hold the API key. |
| Real backend (Spring Boot/MongoDB) | **MISSING** | Does not exist. Static/localStorage MVP works for a single-device hackathon demo but isn't multi-device or scalable as originally envisioned. |
| Data privacy / secrets hygiene | **WORKING**, was **MISSING** | No `.gitignore` existed; added one. No secrets are present in the repo (nothing to leak, since there's no API integration yet). |
| Tests | **MISSING**, now **WORKING** | `test_runner.html` existed but had to be run manually in a browser. Added `tests/run_all.js`, a headless jsdom regression suite (23 checks) covering the full demo flow, the 7 documented scenarios, and the bugs found below, runnable via `npm test`. |

## 3. Real bugs found (via automated testing, not just code reading) and fixed

1. **Admin dashboard stat counters were wrong.** The DOM selector `main .text-display, main .text-headline-lg` also matched the "Dashboard" page heading (same CSS class), shifting every counter assignment by one index. Result: the heading text got overwritten with a number, and the "High Risk" counter silently kept its stale hardcoded demo value instead of showing the real count. **Fixed** by scoping the selector to the actual stats-card grid.
2. **English-language workers saw broken recommendation text.** `worker.language === "tamil" ? threshold.action_ta : t => threshold.action_en` — the false branch was an unintended arrow function, not the value itself. English-speaking workers would see the literal text `t => threshold.action_en` in their recommendation box instead of real advice. **Fixed.**
3. **Free-text NLP false positive.** The word "**near**" contains the substring "ear", so any message with "near" in it (e.g. "chemicals near me") was misrouted into the hearing-difficulty branch. **Fixed** by requiring word-boundary matching for ASCII keyword terms (Tamil terms, being longer compound words, keep substring matching — low collision risk there).
4. **Free-text NLP misclassification.** "என்னுடைய கையில் வலி" (hand pain) type messages were classified as generic `body_pain` instead of `hand_pain`, because the generic pain category was checked before the more specific hand-pain category. **Fixed** by reordering specific-before-generic symptom categories.
5. Expanded the symptom keyword dictionary (breathing/chest phrases, headache, nausea, more Tamil variants) — this was a cheap, low-risk improvement to free-text coverage, verified not to introduce regressions.

## 4. Top priorities if continuing past this hackathon MVP

1. ~~Fix admin dashboard counter bug~~ — **done**
2. ~~Fix English recommendation text bug~~ — **done**
3. ~~Fix NLP false-positive/misclassification bugs~~ — **done**
4. ~~Add `.gitignore` and correct the misleading backend claim in README~~ — **done**
5. ~~Add an automated regression test suite~~ — **done**
6. Decide whether "arbitrary AI question answering" is a hard hackathon-day requirement. If yes, the minimum viable path is: a tiny backend (even a single serverless function) that holds an LLM API key and proxies free-text messages, passing worker context (occupation, exposure, recent symptoms) as system context, with the existing branching engine kept as a structured fallback/sanity-check layer. This is a real scope decision — I did not build it in this pass since it changes the "no backend" architecture significantly and needs your call on the AI provider/API key situation.
7. Give the operator workflow an explicit identity (e.g. "Screening conducted by: [name/ID]" recorded on the session) rather than implicitly borrowing the admin's browser session — small change, meaningfully closes the audit-trail gap.
8. If multi-device/multi-site use is needed beyond a single demo laptop, `localStorage` will not be sufficient — this is the point where a real backend + database becomes necessary, not optional.
9. Add basic input validation feedback (e.g. age range, phone format) beyond the current "please fill all fields" check.
10. Consider persisting the site-wide language preference independent of the per-worker `language` field (currently the language toggle mutates the active worker's profile, which is a slightly odd coupling for a UI preference).

## 5. How to verify

```bash
cd tests
npm install
npm test
```

Or open `ohi_landing_page/code.html` directly in a browser (or serve the folder with `npx http-server`) and click through the demo flow, or open `OHI-KNOWLEDGE/test_runner.html` for the original manual 7-scenario test harness.
