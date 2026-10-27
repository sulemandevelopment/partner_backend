/**
 * 2NH10 — rules summary of the last 7 daily check-ins. No AI.
 */
const { deserializeSymptoms } = require("./dailyCheckinSymptoms");

function average(values) {
  const nums = values.filter((n) => Number.isFinite(n));
  if (!nums.length) return null;
  const sum = nums.reduce((a, b) => a + b, 0);
  return Math.round((sum / nums.length) * 10) / 10;
}

function buildWeeklySymptomPattern(rows) {
  const list = Array.isArray(rows) ? rows : [];
  const counts = {};
  for (const row of list) {
    const symptoms = Array.isArray(row.symptoms)
      ? row.symptoms
      : deserializeSymptoms(row.symptomsJson);
    for (const s of symptoms) {
      if (!s || !s.id) continue;
      counts[s.id] = (counts[s.id] || 0) + 1;
    }
  }
  const ranked = Object.entries(counts)
    .map(([id, days]) => ({ id, days }))
    .sort((a, b) => b.days - a.days);

  const top = ranked[0] || null;
  const daysLogged = list.length;
  let headline;
  if (daysLogged < 3) {
    headline = "Log at least 3 days this week to see a pattern.";
  } else if (top) {
    headline = `${top.id.replace(/_/g, " ")} showed up on ${top.days} of ${daysLogged} logged days.`;
  } else {
    headline = `You logged ${daysLogged} days. No symptoms were marked.`;
  }

  return {
    daysLogged,
    headline,
    topSymptoms: ranked.slice(0, 3),
    averages: {
      mood: average(list.map((r) => r.moodLevel)),
      energy: average(list.map((r) => r.energyLevel)),
      stress: average(list.map((r) => r.stressLevel)),
      digestion: average(list.map((r) => r.digestionLevel)),
    },
  };
}

/**
 * 2NH11 — short weekly progress lines from the symptom pattern.
 * Wellness wording only. No diagnosis.
 */
function buildWeeklyProgressSummary(pattern, extras = {}) {
  if (!pattern || pattern.daysLogged < 3) {
    return {
      lines: ["Check in a few more days to unlock this week's summary."],
    };
  }
  const lines = [`You checked in ${pattern.daysLogged} days this week.`];
  const mood = pattern.averages && pattern.averages.mood;
  const energy = pattern.averages && pattern.averages.energy;
  const stress = pattern.averages && pattern.averages.stress;
  if (mood != null) lines.push(`Mood averaged ${mood} out of 5.`);
  if (energy != null && energy <= 2) lines.push("Energy was on the low side.");
  else if (energy != null && energy >= 4) lines.push("Energy stayed fairly high.");
  if (stress != null && stress >= 4) lines.push("Stress ran high this week.");
  if (pattern.topSymptoms && pattern.topSymptoms[0]) {
    lines.push(pattern.headline);
  }
  if (Number.isFinite(extras.mealsLogged)) {
    lines.push(`Meals logged: ${extras.mealsLogged}.`);
  }
  return { lines: lines.slice(0, 6) };
}

module.exports = { buildWeeklySymptomPattern, buildWeeklyProgressSummary, average };
