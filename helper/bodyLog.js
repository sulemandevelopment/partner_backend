/** 2NH6–2NH9 daily body log fields. Not medical advice. */
const SKIN = new Set(["clear", "breakout", "dry", "oily", "sensitive"]);
const HAIR = new Set(["normal", "shedding", "dry", "oily"]);
const FLOW = new Set(["spotting", "light", "medium", "heavy"]);

function cleanScore15(v) {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 5) return null;
  return n;
}

function cleanEnum(v, allowed) {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  const s = String(v).trim().toLowerCase();
  return allowed.has(s) ? s : null;
}

function cleanShortText(v, max = 255) {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const s = String(v).trim();
  if (!s) return null;
  return s.slice(0, max);
}

module.exports = {
  SKIN,
  HAIR,
  FLOW,
  cleanScore15,
  cleanEnum,
  cleanShortText,
};
