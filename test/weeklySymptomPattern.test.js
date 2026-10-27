const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildWeeklySymptomPattern,
  buildWeeklyProgressSummary,
} = require("../helper/weeklySymptomPattern");

test("needs 3 days before naming a pattern", () => {
  const r = buildWeeklySymptomPattern([
    { moodLevel: 3, symptomsJson: JSON.stringify([{ id: "cramps", severity: 2 }]) },
  ]);
  assert.match(r.headline, /at least 3 days/);
});

test("ranks the most common symptom", () => {
  const row = (id) => ({
    moodLevel: 4,
    energyLevel: 3,
    stressLevel: 2,
    symptomsJson: JSON.stringify([{ id, severity: 1 }]),
  });
  const r = buildWeeklySymptomPattern([
    row("cramps"),
    row("cramps"),
    row("headache"),
  ]);
  assert.equal(r.topSymptoms[0].id, "cramps");
  assert.equal(r.topSymptoms[0].days, 2);
  assert.equal(r.averages.mood, 4);
});

test("weekly summary names high stress and meal count", () => {
  const pattern = buildWeeklySymptomPattern([
    { moodLevel: 3, energyLevel: 4, stressLevel: 5, symptomsJson: "[]" },
    { moodLevel: 3, energyLevel: 4, stressLevel: 4, symptomsJson: "[]" },
    { moodLevel: 3, energyLevel: 4, stressLevel: 4, symptomsJson: "[]" },
  ]);
  const summary = buildWeeklyProgressSummary(pattern, { mealsLogged: 8 });
  assert.ok(summary.lines.some((l) => l.includes("Stress ran high")));
  assert.ok(summary.lines.some((l) => l.includes("Meals logged: 8")));
});
