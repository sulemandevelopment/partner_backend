/**
 * X1 — exercise tag rules. No animation files and no medical advice.
 */
const INTENSITIES = ["gentle", "moderate", "intense"];
const BODY_AREAS = ["full_body", "lower_body", "upper_body", "core"];
const EQUIPMENT = ["none", "mat", "dumbbell", "band"];
const LOAD_AREAS = ["knee", "ankle", "hip", "shoulder", "back"];

function asList(value) {
  if (Array.isArray(value)) return value.map((v) => String(v).toLowerCase().trim());
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map((v) => String(v).toLowerCase().trim());
    } catch (_) {
      return value.split(",").map((v) => v.toLowerCase().trim()).filter(Boolean);
    }
  }
  return [];
}

function normalizeExercise(input) {
  const body = input || {};
  const name = String(body.name || "").trim();
  if (!name) return { error: "Name is required" };
  if (name.length > 120) return { error: "Name is too long" };

  const intensity = String(body.intensity || "moderate").toLowerCase();
  const bodyArea = String(body.bodyArea || "full_body").toLowerCase();
  const equipment = String(body.equipment || "none").toLowerCase();
  if (!INTENSITIES.includes(intensity)) return { error: "Invalid intensity" };
  if (!BODY_AREAS.includes(bodyArea)) return { error: "Invalid body area" };
  if (!EQUIPMENT.includes(equipment)) return { error: "Invalid equipment" };

  const loadsAreas = asList(body.loadsAreas).filter((a) => LOAD_AREAS.includes(a));
  const instructions = String(body.instructions || "").trim().slice(0, 2000);
  const videoUrl = body.videoUrl ? String(body.videoUrl).trim().slice(0, 500) : null;

  return {
    value: {
      name,
      instructions,
      intensity,
      bodyArea,
      equipment,
      loadsAreas,
      videoUrl: videoUrl || null,
      published: body.published === false || body.published === 0 ? false : true,
    },
  };
}

function hiddenByInjury(loadsAreas, injuriesText) {
  const injury = String(injuriesText || "").toLowerCase();
  if (!injury.trim()) return false;
  return asList(loadsAreas).some((area) => injury.includes(area));
}

function filterExercises(rows, { intensity, equipment, injuries } = {}) {
  return (rows || []).filter((row) => {
    if (row.published === false) return false;
    if (intensity && row.intensity !== intensity) return false;
    if (equipment && row.equipment !== equipment) return false;
    if (hiddenByInjury(row.loadsAreas, injuries)) return false;
    return true;
  });
}

module.exports = {
  INTENSITIES,
  BODY_AREAS,
  EQUIPMENT,
  LOAD_AREAS,
  normalizeExercise,
  hiddenByInjury,
  filterExercises,
};
