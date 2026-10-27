const ApiResponse = require("../../helper/ApiResponse");
const { PreConsultationProfile } = require("../../models");
const { evaluateFoodAgainstProfile } = require("../../helper/foodProfileFilter");

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
