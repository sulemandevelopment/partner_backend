const test = require("node:test");
const assert = require("node:assert/strict");
const {
  evaluateFoodAgainstProfile,
} = require("../helper/foodProfileFilter");

test("allergy keyword blocks food name", () => {
  const r = evaluateFoodAgainstProfile("peanut butter toast", {
    allergies: "peanut",
    dietaryPreferences: [],
  });
  assert.equal(r.allowed, false);
  assert.ok(r.conflicts.some((c) => c.code === "allergy"));
});

test("vegetarian blocks chicken", () => {
  const r = evaluateFoodAgainstProfile("Chicken karahi", {
    allergies: "",
    dietaryPreferences: ["vegetarian"],
  });
  assert.equal(r.allowed, false);
});

test("no_restrictions skips diet prefs but not allergies", () => {
  const ok = evaluateFoodAgainstProfile("Chicken karahi", {
    allergies: "",
    dietaryPreferences: ["no_restrictions", "vegetarian"],
  });
  assert.equal(ok.allowed, true);

  const bad = evaluateFoodAgainstProfile("Peanut chutney", {
    allergies: "peanut",
    dietaryPreferences: ["no_restrictions"],
  });
  assert.equal(bad.allowed, false);
});
