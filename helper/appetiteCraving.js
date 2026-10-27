/** 2NH5 — appetite (1–5) and craving type whitelist. */
const ALLOWED_CRAVINGS = new Set([
  "sweet",
  "salty",
  "carbs",
  "comfort",
  "none",
]);

function cleanAppetiteLevel(v) {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

function cleanCravingType(v) {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const s = String(v).trim().toLowerCase();
  return ALLOWED_CRAVINGS.has(s) ? s : null;
}

module.exports = { ALLOWED_CRAVINGS, cleanAppetiteLevel, cleanCravingType };
