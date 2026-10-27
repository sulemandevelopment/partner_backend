const test = require("node:test");
const assert = require("node:assert/strict");
const {
  cleanAppetiteLevel,
  cleanCravingType,
} = require("../helper/appetiteCraving");

test("cleanAppetiteLevel accepts 1-5", () => {
  assert.equal(cleanAppetiteLevel(3), 3);
  assert.equal(cleanAppetiteLevel(9), null);
});

test("cleanCravingType whitelists known values", () => {
  assert.equal(cleanCravingType("Sweet"), "sweet");
  assert.equal(cleanCravingType("pizza"), null);
});
