// ============================================================================
// OHI_GEMINI — thin client for free-form worker questions.
//
// This is intentionally the smallest useful integration for a hackathon demo:
// a direct client-side call to the Generative Language API. It is NOT how a
// production system should ship an API key (see gemini-config.js). The single
// integration point is OHI_GEMINI.ask() below — swap its internals for a
// fetch() to your own backend proxy later without touching any caller.
//
// Role in the app: the deterministic branching engine (ohi-engine.js) stays
// the primary, authoritative path for the structured screening flow and the
// risk score. Gemini is used ONLY for open-ended chat questions the keyword
// matcher in ohi-engine.js could not route to a known branch — e.g. "is this
// exposure dangerous?" or "what PPE should I use?". Gemini never computes or
// overrides a risk score.
// ============================================================================
(function () {
  const ENDPOINT_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

  const SAFETY_SYSTEM_PROMPT = `You are the OHI (Occupational Health Intelligence) assistant, built into a
worker health screening app used by factory, construction, quarry, and
fabrication workers in Tamil Nadu, India. Many users have low digital and
health literacy. Follow these rules strictly:

1. Answer in the SAME language the worker used. If they wrote in Tamil,
   reply in Tamil. If English, reply in English. If mixed, reply in the
   dominant language, in simple everyday words (not medical jargon).
2. NEVER diagnose a disease or condition. You may describe possible common
   causes in general terms, but always make clear you are not a doctor and
   this is not a medical diagnosis.
3. For any symptom that could be serious (chest pain, severe breathlessness,
   fainting, severe bleeding, confusion, seizure, suspected poisoning/
   chemical exposure, high fever with weakness, or anything the worker
   frames as an emergency), your FIRST sentence must clearly advise the
   worker to seek urgent/emergency medical care right away, in both a firm
   and caring tone.
4. For non-emergency symptoms, give brief, practical, safety-first guidance
   (e.g. rest, hydration, PPE, ventilation, reporting to a supervisor) and
   recommend seeing a doctor or the site clinic if symptoms persist or
   worsen.
5. If asked about PPE or exposure safety, give concrete, occupation-relevant
   guidance grounded in standard occupational health practice.
6. Keep replies short — 2 to 4 sentences. This is a chat bubble on a small
   phone screen, not a report.
7. Never claim to replace a doctor, clinic, or emergency service.`;

  function buildUrl(apiKey, model) {
    return `${ENDPOINT_BASE}/${model}:generateContent?key=${apiKey}`;
  }

  // Heuristic used only to flag the UI (e.g. show an emergency banner); the
  // deterministic q_emergency_check question in the branching engine remains
  // the authoritative emergency gate for the structured screening flow.
  function looksLikeEmergency(replyText) {
    const t = (replyText || "").toLowerCase();
    return /urgent|emergency|immediately|right away|call 108|உடனடி|அவசர/i.test(t);
  }

  async function ask(userText, workerContext) {
    const cfg = window.OHI_GEMINI_CONFIG || {};
    const apiKey = cfg.GEMINI_API_KEY;
    const model = cfg.GEMINI_MODEL || "gemini-2.0-flash";

    if (!apiKey) {
      return {
        ok: false,
        text: null,
        error: "no_api_key"
      };
    }

    const contextLine = workerContext
      ? `Worker context: occupation=${workerContext.occupation || "unknown"}, ` +
        `preferred language=${workerContext.language || "unknown"}.`
      : "";

    const body = {
      system_instruction: {
        parts: [{ text: SAFETY_SYSTEM_PROMPT + (contextLine ? "\n\n" + contextLine : "") }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userText }]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 300
      }
    };

    try {
      const res = await fetch(buildUrl(apiKey, model), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Gemini API error", res.status, errText);
        return { ok: false, text: null, error: "http_" + res.status };
      }

      const data = await res.json();
      const reply =
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text;

      if (!reply) {
        return { ok: false, text: null, error: "empty_response" };
      }

      return { ok: true, text: reply.trim(), isEmergency: looksLikeEmergency(reply) };
    } catch (err) {
      console.error("Gemini request failed", err);
      return { ok: false, text: null, error: "network" };
    }
  }

  window.OHI_GEMINI = { ask };
})();
