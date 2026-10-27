const test = require("node:test");
const assert = require("node:assert/strict");
const {
  durationMinutesFromSlot,
  estimateCaloriesFromSlot,
} = require("../helper/slotSessionStats");

test("durationMinutesFromSlot parses AM/PM range", () => {
  const mins = durationMinutesFromSlot({
    start: "10:00 AM",
    end: "11:00 AM",
    type: "Power HIIT",
  });
  assert.equal(mins, 60);
});

test("estimateCaloriesFromSlot uses intensity tier", () => {
  const kcal = estimateCaloriesFromSlot({
    start: "10:00 AM",
    end: "11:00 AM",
    type: "Gentle Yoga",
  });
  assert.equal(kcal, 240);
});
