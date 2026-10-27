const test = require('node:test');
const assert = require('node:assert/strict');
const {
  parseSymptomsPayload,
  deserializeSymptoms,
} = require('../helper/dailyCheckinSymptoms');

test('parseSymptomsPayload accepts valid items', () => {
  const out = parseSymptomsPayload([
    { id: 'cramps', severity: 2, painArea: 'lower abdomen' },
    { id: 'invalid', severity: 2 },
    { id: 'fatigue', severity: 4 },
  ]);
  assert.equal(out.length, 1);
  assert.equal(out[0].id, 'cramps');
});

test('deserializeSymptoms handles empty', () => {
  assert.deepEqual(deserializeSymptoms(null), []);
});
