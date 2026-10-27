const ApiResponse = require("../../helper/ApiResponse");
const { PreConsultationProfile, UserCycleData } = require("../../models");
const { evaluateFoodAgainstProfile } = require("../../helper/foodProfileFilter");
const { scoreFoodForPhase } = require("../../helper/phaseFoodScore");
const CyclePhase = require("../../helper/CyclePhaseCalculator");

function profileSlice(row) {
  if (!row) return { allergies: null, dietaryPreferences: [] };
  const json = row.toJSON ? row.toJSON() : row;
  let prefs = json.dietaryPreferences;
  if (typeof prefs === "string" && prefs.trim()) {
    try {
      prefs = JSON.parse(prefs);
    } catch (_) {
      prefs = [];
    }
  }
  return {
    allergies: json.allergies || null,
    dietaryPreferences: Array.isArray(prefs) ? prefs : [],
  };
}

// GET /users/food-profile
exports.getFoodProfile = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.json(ApiResponse("0", "Unauthorized", {}));

    const profile = await PreConsultationProfile.findOne({ where: { userId } });
    return res.json(
      ApiResponse("1", "Food profile", { profile: profileSlice(profile) })
    );
  } catch (err) {
    console.error("[foodProfile] get:", err);
    return res.json(ApiResponse("0", "Failed to load food profile", {}));
  }
};

// POST /users/food-profile/check
// Body: { foodName: string }
exports.checkFood = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.json(ApiResponse("0", "Unauthorized", {}));

    const foodName =
      typeof req.body?.foodName === "string" ? req.body.foodName.trim() : "";
    if (!foodName) {
      return res.json(ApiResponse("0", "foodName is required", {}));
    }

    const profile = await PreConsultationProfile.findOne({ where: { userId } });
    const slice = profileSlice(profile);
    const result = evaluateFoodAgainstProfile(foodName, slice);

    return res.json(
      ApiResponse("1", "Food check complete", {
        foodName,
        ...result,
      })
    );
  } catch (err) {
    console.error("[foodProfile] check:", err);
    return res.json(ApiResponse("0", "Food check failed", {}));
  }
};

// POST /users/food-profile/phase-score
// Body: { foodName, phase? } — phase is taken from cycle data when omitted.
exports.scoreFoodPhase = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.json(ApiResponse("0", "Unauthorized", {}));
    const foodName =
      typeof req.body?.foodName === "string" ? req.body.foodName.trim() : "";
    if (!foodName) return res.json(ApiResponse("0", "foodName is required", {}));

    let phase = typeof req.body?.phase === "string" ? req.body.phase : null;
    if (!phase) {
      const cycle = await UserCycleData.findOne({ where: { userId } });
      if (cycle && cycle.lastPeriodDate && cycle.dataProvided === 1) {
        const info = CyclePhase.calculate({
          lastPeriodDate: cycle.lastPeriodDate,
          averageCycleLength: cycle.averageCycleLength || 28,
        });
        phase = info && info.phase;
      }
    }
    const result = scoreFoodForPhase(foodName, phase);
    return res.json(ApiResponse("1", "Phase food score", { foodName, phase, ...result }));
  } catch (err) {
    console.error("[foodProfile] phase-score:", err);
    return res.json(ApiResponse("0", "Phase score failed", {}));
  }
};
