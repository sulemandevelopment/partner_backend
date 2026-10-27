/** PDF 1NH1 — allowed symptom ids and validation (rules-only, no AI). */

const ALLOWED_SYMPTOM_IDS = new Set([
  'cramps',
  'headache',
  'bloating',
  'fatigue',
  'nausea',
  'breast_tenderness',
  'back_pain',
  'acne',
]);

const ALLOWED_STRESS_CAUSES = new Set([
  'work',
  'family',
  'health',
  'money',
  'other',
]);

const PAIN_SYMPTOMS = new Set(['cramps', 'back_pain', 'headache']);

function clampInt(v, min, max) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const r = Math.round(n);
  if (r < min || r > max) return null;
  return r;
}

/**
 * @param {unknown} raw
 * @returns {Array<{id:string,severity:number,painArea?:string}>|null}
 */
function parseSymptomsPayload(raw) {
  if (raw === undefined) return undefined;
  if (raw === null) return [];
  if (!Array.isArray(raw)) return null;
  const out = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const id = String(item.id || '').trim();
    if (!ALLOWED_SYMPTOM_IDS.has(id)) continue;
    const severity = clampInt(item.severity, 1, 3);
    if (severity == null) continue;
    const entry = { id, severity };
    if (PAIN_SYMPTOMS.has(id) && item.painArea) {
      entry.painArea = String(item.painArea).slice(0, 64);
    }
    out.push(entry);
  }
  return out;
}

function serializeSymptoms(arr) {
  if (arr === undefined) return undefined;
  if (arr === null) return null;
  return JSON.stringify(arr);
}

function deserializeSymptoms(json) {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

module.exports = {
  ALLOWED_SYMPTOM_IDS,
  ALLOWED_STRESS_CAUSES,
  parseSymptomsPayload,
  serializeSymptoms,
  deserializeSymptoms,
  clampInt,
};
