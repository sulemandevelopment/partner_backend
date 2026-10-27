/**
 * 2NH2 — Rules-based phase fit for a food name.
 * Wellness guidance only, not a medical recommendation.
 */
const TAGS = {
  iron: ["spinach", "lentil", "daal", "beef", "liver", "egg", "dates", "beet"],
  warm: ["soup", "khichdi", "ginger", "halwa", "porridge", "yakhni"],
  light: ["salad", "yogurt", "fruit", "soup", "khichdi"],
  fresh: ["salad", "fruit", "berry", "cucumber", "mint"],
  protein: ["chicken", "egg", "fish", "paneer", "lentil", "daal", "yogurt", "beef"],
  hydrating: ["watermelon", "cucumber", "lassi", "coconut", "soup", "fruit"],
  fiber: ["oats", "salad", "beans", "chana", "apple", "vegetable"],
  magnesium: ["almond", "dark chocolate", "banana", "spinach", "pumpkin seed", "oats"],
  complex_carb: ["oats", "brown rice", "sweet potato", "roti", "quinoa", "daal"],
  high_sugar: ["cake", "soda", "mithai", "candy", "donut", "ice cream"],
  fried: ["pakora", "samosa", "fried", "paratha", "french fries"],
};

const PHASE_BOOST = {
  menstrual: ["iron", "warm", "light"],
  follicular: ["fresh", "protein", "fiber"],
  ovulatory: ["hydrating", "light", "fiber"],
  luteal: ["magnesium", "complex_carb", "protein"],
};

const PHASE_PENALTY = {
  menstrual: ["fried", "high_sugar"],
  follicular: ["fried"],
  ovulatory: ["fried", "high_sugar"],
  luteal: ["high_sugar", "fried"],
};

function tagsFor(foodName) {
  const name = (foodName || "").toLowerCase();
  const found = [];
  for (const [tag, words] of Object.entries(TAGS)) {
    if (words.some((w) => name.includes(w))) found.push(tag);
  }
  return found;
}

function scoreFoodForPhase(foodName, phase) {
  const key = String(phase || "").toLowerCase();
  const known = PHASE_BOOST[key] ? key : null;
  const tags = tagsFor(foodName);
  if (!known) {
    return { score: null, label: "unknown_phase", tags, note: "Cycle phase is not available." };
  }
  if (!tags.length) {
    return {
      score: 50,
      label: "neutral",
      tags,
      note: "No phase-specific match in the food name.",
    };
  }
  let score = 50;
  for (const t of tags) {
    if (PHASE_BOOST[key].includes(t)) score += 15;
    if (PHASE_PENALTY[key].includes(t)) score -= 20;
  }
  score = Math.max(0, Math.min(100, score));
  const label = score >= 65 ? "supportive" : score <= 40 ? "heavier" : "neutral";
  const note =
    label === "supportive"
      ? "This looks supportive for your current phase."
      : label === "heavier"
        ? "This may feel heavier in your current phase."
        : "This is a neutral match for your current phase.";
  return { score, label, tags, note };
}

module.exports = { scoreFoodForPhase, tagsFor };
