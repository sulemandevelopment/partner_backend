/**
 * F-02 — Duration from slot start/end strings; calorie estimate from class type intensity.
 */
const { getSlotIntensity } = require("./slotIntensity");

function parseSlotTimeParts(value) {
  if (!value || typeof value !== "string") return null;
  const m = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return { hour, minute };
}

function durationMinutesFromSlot(slot) {
  const start = parseSlotTimeParts(slot.start);
  const end = parseSlotTimeParts(slot.end);
  if (!start || !end) return null;
  let startMin = start.hour * 60 + start.minute;
  let endMin = end.hour * 60 + end.minute;
  if (endMin <= startMin) endMin += 24 * 60;
  const mins = endMin - startMin;
  return mins > 0 ? mins : null;
}

function estimateCaloriesFromSlot(slot) {
  const duration = durationMinutesFromSlot(slot);
  if (!duration) return null;
  const intensity = getSlotIntensity(slot.type || slot.level);
  const kcalPerMin =
    intensity === "high"
      ? 7
      : intensity === "medium"
        ? 5.5
        : intensity === "low"
          ? 4
          : 5;
  return Math.round(duration * kcalPerMin);
}

module.exports = {
  durationMinutesFromSlot,
  estimateCaloriesFromSlot,
};
