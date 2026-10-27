const { Op } = require("sequelize");
const ApiResponse = require("../../helper/ApiResponse");
const { SubscriptionTrial, UserPlan } = require("../../models");
const {
  canStartTrial,
  trialEndsAt,
  trialView,
} = require("../../helper/subscriptionTrial");

async function hasActivePaidPlan(userId) {
  const row = await UserPlan.findOne({
    where: {
      userId,
      expireDate: { [Op.gt]: new Date() },
      cancelledAt: null,
    },
  });
  return !!row;
}

exports.getTrial = async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.json(ApiResponse("0", "Unauthorized", {}));
  const row = await SubscriptionTrial.findOne({ where: { userId } });
  const paid = await hasActivePaidPlan(userId);
  const view = trialView(row);
  if (!row && paid) view.eligible = false;
  return res.json(ApiResponse("1", "Subscription trial", view));
};

exports.startTrial = async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.json(ApiResponse("0", "Unauthorized", {}));
  const existing = await SubscriptionTrial.findOne({ where: { userId } });
  const paid = await hasActivePaidPlan(userId);
  const gate = canStartTrial({ existingTrial: !!existing, hasActivePaidPlan: paid });
  if (!gate.ok) return res.json(ApiResponse("0", gate.reason, trialView(existing)));

  const startedAt = new Date();
  const row = await SubscriptionTrial.create({
    userId,
    startedAt,
    endsAt: trialEndsAt(startedAt),
    status: "active",
  });
  return res.json(ApiResponse("1", "Trial started", trialView(row)));
};

exports.continueTrial = async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.json(ApiResponse("0", "Unauthorized", {}));
  const row = await SubscriptionTrial.findOne({ where: { userId } });
  if (!row) return res.json(ApiResponse("0", "No trial to continue", {}));
  if (row.status === "active") {
    row.status = "continued";
    await row.save();
  }
  return res.json(ApiResponse("1", "Continue to checkout", trialView(row)));
};
