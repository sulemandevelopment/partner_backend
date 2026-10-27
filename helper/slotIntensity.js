/** Mirrors Flutter RecommendationService intensity mapping. */
const TYPE_TO_INTENSITY = {
  "Power HIIT": "high",
  "Cardio Blast": "high",
  "Strength & Tone": "high",
  "Full Body Burn": "medium",
  "Dance Fitness": "medium",
  "Power Yoga": "medium",
  Pilates: "medium",
  "Gentle Yoga": "low",
  "Stretch & Restore": "low",
  "Meditation & Breathwork": "low",
};

function getSlotIntensity(type) {
  if (!type || !String(type).trim()) return null;
  const lower = String(type).toLowerCase().trim();
  for (const [key, value] of Object.entries(TYPE_TO_INTENSITY)) {
    if (key.toLowerCase() === lower) return value;
  }
  for (const [key, value] of Object.entries(TYPE_TO_INTENSITY)) {
    const keyLower = key.toLowerCase();
    if (lower.includes(keyLower) || keyLower.includes(lower)) return value;
  }
  return null;
}

module.exports = { getSlotIntensity };
