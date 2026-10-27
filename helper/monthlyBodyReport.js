/**
 * 2NH13 — last-30-day nutrition and body report from logged check-ins.
 * Rules and chart numbers only. No AI narrative and no diagnosis.
 */
const { deserializeSymptoms } = require("./dailyCheckinSymptoms");
const { average } = require("./weeklySymptomPattern");

const MIN_DAYS = 8;

function label(id) {
  return String(id || "").replace(/_/g, " ");
}

function modeOf(values) {
  const counts = {};
  for (const raw of values) {
    if (raw == null) continue;
    const key = String(raw).trim().toLowerCase();
    if (!key || key === "none") continue;
    counts[key] = (counts[key] || 0) + 1;
  }
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (!ranked.length || ranked[0][1] < 2) return null;
  return { value: ranked[0][0], days: ranked[0][1] };
}

function buildMonthlyBodyReport(rows, extras = {}) {
  const list = Array.isArray(rows) ? rows : [];
  const daysLogged = list.length;
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
  const topSymptoms = Object.entries(counts)
    .map(([id, days]) => ({ id, days }))
    .sort((a, b) => b.days - a.days)
    .slice(0, 3);

  const charts = [
    { id: "mood", label: "Mood", value: average(list.map((r) => r.moodLevel)), max: 5 },
    { id: "energy", label: "Energy", value: average(list.map((r) => r.energyLevel)), max: 5 },
    { id: "stress", label: "Stress", value: average(list.map((r) => r.stressLevel)), max: 5 },
    { id: "digestion", label: "Digestion", value: average(list.map((r) => r.digestionLevel)), max: 5 },
    { id: "appetite", label: "Appetite", value: average(list.map((r) => r.appetiteLevel)), max: 5 },
  ].filter((c) => c.value != null);

  const body = {
    skin: modeOf(list.map((r) => r.skinStatus)),
    hair: modeOf(list.map((r) => r.hairStatus)),
    flow: modeOf(list.map((r) => r.periodFlow)),
    craving: modeOf(list.map((r) => r.cravingType)),
  };
  const supplementDays = list.filter(
    (r) => r.supplementLog && String(r.supplementLog).trim(),
  ).length;
  const mealsLogged = Number.isFinite(extras.mealsLogged) ? extras.mealsLogged : null;

  if (daysLogged < MIN_DAYS) {
    return {
      daysLogged,
      minDays: MIN_DAYS,
      ready: false,
      headline: `Log at least ${MIN_DAYS} days this month to open the body and nutrition report.`,
      summaryLines: [
        "This report uses your check-ins and meal logs. It is not a medical summary.",
      ],
      charts: [],
      topSymptoms: [],
      body: {},
      mealsLogged,
      supplementDays,
    };
  }

  const lines = [`You checked in ${daysLogged} days in the last 30 days.`];
  const mood = charts.find((c) => c.id === "mood");
  const energy = charts.find((c) => c.id === "energy");
  const stress = charts.find((c) => c.id === "stress");
  if (mood) lines.push(`Mood averaged ${mood.value} out of 5.`);
  if (energy && energy.value <= 2) lines.push("Energy was often on the low side.");
  else if (energy && energy.value >= 4) lines.push("Energy stayed fairly high.");
  if (stress && stress.value >= 4) lines.push("Stress ran high across the month.");
  if (topSymptoms[0]) {
    lines.push(
      `${label(topSymptoms[0].id)} showed up on ${topSymptoms[0].days} of ${daysLogged} logged days.`,
    );
  }
  if (body.craving) {
    lines.push(`Most logged craving: ${label(body.craving.value)} (${body.craving.days} days).`);
  }
  if (body.flow) lines.push(`Most logged flow: ${label(body.flow.value)}.`);
  if (mealsLogged != null) lines.push(`Meals logged: ${mealsLogged}.`);
  if (supplementDays > 0) lines.push(`Supplements noted on ${supplementDays} days.`);
  lines.push("These are patterns from what you logged. They are not a diagnosis.");

  return {
    daysLogged,
    minDays: MIN_DAYS,
    ready: true,
    headline: topSymptoms[0]
      ? `${label(topSymptoms[0].id)} was the most logged symptom this month.`
      : `You logged ${daysLogged} days. No symptoms were marked.`,
    summaryLines: lines.slice(0, 8),
    charts,
    topSymptoms,
    body,
    mealsLogged,
    supplementDays,
  };
}

module.exports = { buildMonthlyBodyReport, MIN_DAYS };
