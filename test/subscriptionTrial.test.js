const test = require("node:test");
const assert = require("node:assert/strict");
const {
  canStartTrial,
  dayNumber,
  shouldRemind,
  trialView,
  TRIAL_DAYS,
} = require("../helper/subscriptionTrial");

test("one trial and no second start when a paid plan is active", () => {
  assert.equal(canStartTrial({ existingTrial: false, hasActivePaidPlan: false }).ok, true);
  assert.equal(canStartTrial({ existingTrial: true, hasActivePaidPlan: false }).ok, false);
  assert.equal(canStartTrial({ existingTrial: false, hasActivePaidPlan: true }).ok, false);
});

test("day counter starts at 1 and the view is active for 7 days", () => {
  const started = new Date(2026, 9, 1, 9, 0, 0);
  assert.equal(dayNumber(started, new Date(2026, 9, 1, 18, 0, 0)), 1);
  assert.equal(dayNumber(started, new Date(2026, 9, 3, 8, 0, 0)), 3);
  const view = trialView(
    { startedAt: started, endsAt: new Date(started.getTime() + TRIAL_DAYS * 86400000), status: "active" },
    new Date(2026, 9, 3, 8, 0, 0)
  );
  assert.equal(view.active, true);
  assert.equal(view.day, 3);
  assert.equal(view.daysTotal, 7);
});

test("reminder is only inside the last day and only once", () => {
  const ends = new Date(Date.now() + 20 * 60 * 60 * 1000);
  assert.equal(shouldRemind(ends, null), true);
  assert.equal(shouldRemind(ends, new Date()), false);
  assert.equal(shouldRemind(new Date(Date.now() + 3 * 86400000), null), false);
});
