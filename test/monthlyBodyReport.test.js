const test = require("node:test");
const assert = require("node:assert/strict");
const { buildMonthlyBodyReport } = require("../helper/monthlyBodyReport");

function day(extra) {
  return {
    moodLevel: 4,
    energyLevel: 4,
    stressLevel: 2,
    digestionLevel: 3,
    appetiteLevel: 3,
    symptomsJson: "[]",
    ...extra,
  };
}

test("stays closed until 8 check-ins", () => {
  const report = buildMonthlyBodyReport([day(), day(), day()]);
  assert.equal(report.ready, false);
  assert.equal(report.charts.length, 0);
  assert.match(report.headline, /at least 8 days/);
});

test("names the top symptom and meal count once ready", () => {
  const rows = [];
  for (let i = 0; i < 8; i += 1) {
    rows.push(day({
      symptomsJson: JSON.stringify([{ id: i < 5 ? "bloating" : "cramps", severity: 1 }]),
      cravingType: "sweet",
      periodFlow: "light",
      skinStatus: "breakout",
    }));
  }
  const report = buildMonthlyBodyReport(rows, { mealsLogged: 20 });
  assert.equal(report.ready, true);
  assert.equal(report.topSymptoms[0].id, "bloating");
  assert.ok(report.charts.some((c) => c.id === "mood" && c.value === 4));
  assert.equal(report.body.craving.value, "sweet");
  assert.ok(report.summaryLines.some((l) => l.includes("Meals logged: 20")));
  assert.ok(report.summaryLines.some((l) => l.includes("not a diagnosis")));
});

test("high stress is called out without a diagnosis", () => {
  const rows = [];
  for (let i = 0; i < 8; i += 1) rows.push(day({ stressLevel: 5, symptomsJson: "[]" }));
  const report = buildMonthlyBodyReport(rows, { mealsLogged: 0 });
  assert.ok(report.summaryLines.some((l) => l.includes("Stress ran high")));
  assert.ok(!report.summaryLines.some((l) => /diagnos/i.test(l) && !l.includes("not a diagnosis")));
});
