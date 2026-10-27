const test = require("node:test");
const assert = require("node:assert/strict");
const { day7UserNote } = require("../helper/day7UserNote");

test("flagged review tells the user it went to the dietitian", () => {
  const note = day7UserNote(true);
  assert.match(note, /dietitian/);
  assert.match(note, /not a diagnosis/);
});

test("unflagged review has no escalation note", () => {
  assert.equal(day7UserNote(false), null);
});
