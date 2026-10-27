const test = require("node:test");
const assert = require("node:assert/strict");
const { scoreFoodForPhase } = require("../helper/phaseFoodScore");

test("menstrual iron food scores supportive", () => {
  const r = scoreFoodForPhase("spinach daal", "menstrual");
  assert.equal(r.label, "supportive");
  assert.ok(r.score >= 65);
});

test("luteal cake scores heavier", () => {
  const r = scoreFoodForPhase("chocolate cake", "luteal");
  assert.equal(r.label, "heavier");
});
