const { Op } = require("sequelize");
const { SubscriptionTrial, User } = require("../models");
const sendNotification = require("./notification");
const { shouldRemind } = require("./subscriptionTrial");

async function sendSubscriptionTrialReminders(now = new Date()) {
  const rows = await SubscriptionTrial.findAll({
    where: { status: "active", reminderSentAt: null },
  });
  let sent = 0;
  for (const row of rows) {
    if (!shouldRemind(row.endsAt, row.reminderSentAt, now)) continue;
    const user = await User.findByPk(row.userId, { attributes: ["id", "deviceToken"] });
    if (user && user.deviceToken) {
      await sendNotification(
        [user.deviceToken],
        {
          title: "Your trial ends tomorrow",
          body: "Open plans and tap Continue to keep your subscription.",
        },
        { type: "subscriptionTrial", screen: "plans" }
      );
      sent += 1;
    }
    row.reminderSentAt = now;
    await row.save();
  }
  const expired = await SubscriptionTrial.update(
    { status: "ended" },
    { where: { status: "active", endsAt: { [Op.lt]: now } } }
  );
  return { sent, expired: expired[0] };
}

module.exports = { sendSubscriptionTrialReminders };
