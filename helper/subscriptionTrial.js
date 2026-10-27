/**
 * 1P8 — plan-page subscription trial. Seven days, one per account.
 * Does not grant a paid plan and does not replace the 3-day class trial.
 */
const TRIAL_DAYS = 7;
const MS_DAY = 24 * 60 * 60 * 1000;

function startOfLocalDay(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function dayNumber(startedAt, now = new Date()) {
  const start = startOfLocalDay(startedAt);
  const today = startOfLocalDay(now);
  const diff = Math.floor((today.getTime() - start.getTime()) / MS_DAY) + 1;
  return Math.max(1, diff);
}

function canStartTrial({ existingTrial, hasActivePaidPlan }) {
  if (existingTrial) return { ok: false, reason: "A free trial was already used on this account." };
  if (hasActivePaidPlan) return { ok: false, reason: "This account already has an active plan." };
  return { ok: true };
}

function trialEndsAt(startedAt) {
  const start = new Date(startedAt);
  return new Date(start.getTime() + TRIAL_DAYS * MS_DAY);
}

function shouldRemind(endsAt, reminderSentAt, now = new Date()) {
  if (reminderSentAt) return false;
  const ends = new Date(endsAt).getTime();
  const t = now.getTime();
  return t < ends && ends - t <= MS_DAY;
}

function trialView(row, now = new Date()) {
  if (!row) {
    return {
      active: false,
      eligible: true,
      status: "none",
      day: null,
      daysTotal: TRIAL_DAYS,
      endsAt: null,
    };
  }
  const ends = new Date(row.endsAt);
  const active = row.status === "active" && ends.getTime() > now.getTime();
  return {
    active,
    eligible: false,
    status: active ? "active" : row.status === "continued" ? "continued" : "ended",
    day: active ? Math.min(dayNumber(row.startedAt, now), TRIAL_DAYS) : null,
    daysTotal: TRIAL_DAYS,
    endsAt: ends.toISOString(),
  };
}

module.exports = {
  TRIAL_DAYS,
  dayNumber,
  canStartTrial,
  trialEndsAt,
  shouldRemind,
  trialView,
};
