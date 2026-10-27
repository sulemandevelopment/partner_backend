const test = require("node:test");
const assert = require("node:assert/strict");
const { periodWhatToExpect } = require("../helper/periodWhatToExpect");

test("due now is an estimate", () => {
  const text = periodWhatToExpect({ phase: "menstrual", periodInDays: 0 });
  assert.match(text, /not a diagnosis/);
});

test("unknown phase returns null", () => {
  assert.equal(periodWhatToExpect({ phase: "", periodInDays: 4 }), null);
});
