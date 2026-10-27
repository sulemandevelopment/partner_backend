/**
 * 2NH1 — Rules-based food vs profile checks (allergies + dietary preferences).
 * Not medical advice; mirrors user-selected filters only.
 */
const { parseAllergyKeywords } = require("../services/ai/utils/allergies");

const MEAT_KEYWORDS = [
  "chicken",
  "beef",
  "mutton",
  "goat",
  "lamb",
  "steak",
  "mince",
  "keema",
  "biryani meat",
  "karahi",
  "nihari",
  "haleem meat",
  "sausage",
  "bacon",
  "ham",
  "salami",
  "pepperoni",
];

const PORK_KEYWORDS = ["pork", "bacon", "ham", "lard", "pepperoni", "salami"];

const ALCOHOL_KEYWORDS = ["alcohol", "wine", "beer", "vodka", "whiskey", "rum"];

const SEAFOOD_KEYWORDS = [
  "fish",
  "salmon",
  "tuna",
  "shrimp",
  "prawn",
  "seafood",
  "crab",
  "lobster",
  "sardine",
];

const EGG_KEYWORDS = ["egg", "omelette", "omelet", "mayonnaise", "mayo"];

const LACTOSE_KEYWORDS = [
  "milk",
  "cheese",
  "yogurt",
  "yoghurt",
  "cream",
  "butter",
  "whey",
  "lactose",
  "paneer",
  "dahi",
];

const GLUTEN_KEYWORDS = [
  "wheat",
  "bread",
  "roti",
  "naan",
  "paratha",
  "pasta",
  "gluten",
  "barley",
  "rye",
  "semolina",
  "flour",
  "maida",
];

function normalizePrefs(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((x) => String(x).trim().toLowerCase()).filter(Boolean);
  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return normalizePrefs(parsed);
    } catch (_) {
      return raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    }
  }
  return [];
}

function containsAny(haystack, keywords) {
  for (const kw of keywords) {
    if (haystack.includes(kw)) return kw;
  }
  return null;
}

/**
 * @param {string} foodName
 * @param {{ allergies?: string|null, dietaryPreferences?: string[]|null }} profile
 * @returns {{ allowed: boolean, conflicts: { code: string, detail: string }[] }}
 */
function evaluateFoodAgainstProfile(foodName, profile) {
  const conflicts = [];
  const name = (foodName || "").trim().toLowerCase();
  if (!name) {
    return { allowed: true, conflicts: [] };
  }

  const allergyKeywords = parseAllergyKeywords(profile?.allergies);
  for (const allergy of allergyKeywords) {
    if (name.includes(allergy)) {
      conflicts.push({
        code: "allergy",
        detail: `Matches your allergy: ${allergy}`,
      });
    }
  }

  const prefs = normalizePrefs(profile?.dietaryPreferences);
  if (prefs.includes("no_restrictions")) {
    return { allowed: conflicts.length === 0, conflicts };
  }

  if (prefs.includes("vegetarian")) {
    const meat = containsAny(name, MEAT_KEYWORDS);
    if (meat) {
      conflicts.push({ code: "vegetarian", detail: `Contains meat (${meat})` });
    }
    const fish = containsAny(name, SEAFOOD_KEYWORDS);
    if (fish && !prefs.includes("seafood_ok")) {
      conflicts.push({ code: "vegetarian", detail: `Contains seafood (${fish})` });
    }
    const egg = containsAny(name, EGG_KEYWORDS);
    if (egg && !prefs.includes("eggs_ok")) {
      conflicts.push({ code: "vegetarian", detail: `Contains eggs (${egg})` });
    }
  }

  if (prefs.includes("halal")) {
    const pork = containsAny(name, PORK_KEYWORDS);
    if (pork) {
      conflicts.push({ code: "halal", detail: `Not halal (${pork})` });
    }
    const alcohol = containsAny(name, ALCOHOL_KEYWORDS);
    if (alcohol) {
      conflicts.push({ code: "halal", detail: `Contains alcohol (${alcohol})` });
    }
  }

  if (prefs.includes("lactose_free")) {
    const dairy = containsAny(name, LACTOSE_KEYWORDS);
    if (dairy) {
      conflicts.push({ code: "lactose_free", detail: `Contains dairy (${dairy})` });
    }
  }

  if (prefs.includes("gluten_free")) {
    const gluten = containsAny(name, GLUTEN_KEYWORDS);
    if (gluten) {
      conflicts.push({ code: "gluten_free", detail: `Contains gluten (${gluten})` });
    }
  }

  return { allowed: conflicts.length === 0, conflicts };
}

module.exports = {
  evaluateFoodAgainstProfile,
  normalizePrefs,
};
