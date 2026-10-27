const test = require("node:test");
const assert = require("node:assert/strict");
const { cleanScore15, cleanEnum, SKIN, FLOW } = require("../helper/bodyLog");

test("digestion score is 1-5", () => {
  assert.equal(cleanScore15(2), 2);
  assert.equal(cleanScore15(8), null);
});

test("skin and flow enums", () => {
  assert.equal(cleanEnum("Breakout", SKIN), "breakout");
  assert.equal(cleanEnum("spotting", FLOW), "spotting");
  assert.equal(cleanEnum("diagnosis", SKIN), null);
});
