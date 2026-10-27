const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeExercise,
  filterExercises,
  hiddenByInjury,
} = require("../helper/exerciseLibrary");

test("rejects an exercise with no name", () => {
  assert.equal(normalizeExercise({}).error, "Name is required");
});

test("knee note hides a squat and keeps a seated march", () => {
  const rows = [
    { name: "Chair squat", intensity: "moderate", equipment: "none", loadsAreas: ["knee"], published: true },
    { name: "Seated march", intensity: "gentle", equipment: "none", loadsAreas: [], published: true },
    { name: "Draft", intensity: "intense", equipment: "none", loadsAreas: [], published: false },
  ];
  const visible = filterExercises(rows, { injuries: "old knee pain" });
  assert.deepEqual(visible.map((r) => r.name), ["Seated march"]);
  assert.equal(hiddenByInjury(["shoulder"], "knee"), false);
});

test("intensity filter is exact", () => {
  const rows = [
    { name: "A", intensity: "gentle", equipment: "mat", loadsAreas: [], published: true },
    { name: "B", intensity: "intense", equipment: "mat", loadsAreas: [], published: true },
  ];
  const visible = filterExercises(rows, { intensity: "gentle", equipment: "mat" });
  assert.equal(visible.length, 1);
  assert.equal(visible[0].name, "A");
});
