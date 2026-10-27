/**
 * Starter X1 rows so the library is usable before a trainer sends clips.
 * Written form cues only. Not a clinical program.
 */
const STARTER = [
  {
    name: "Seated march",
    intensity: "gentle",
    bodyArea: "lower_body",
    equipment: "none",
    loadsAreas: [],
    instructions: "Sit tall. Lift one knee, lower it, then the other. Move slowly and keep the chest up.",
  },
  {
    name: "Wall push-up",
    intensity: "gentle",
    bodyArea: "upper_body",
    equipment: "none",
    loadsAreas: ["shoulder"],
    instructions: "Hands on the wall, slightly wider than the shoulders. Bend the elbows, then press back. Keep the body in one line.",
  },
  {
    name: "Glute bridge",
    intensity: "moderate",
    bodyArea: "lower_body",
    equipment: "mat",
    loadsAreas: ["hip"],
    instructions: "Lie on your back, feet flat. Press through the heels and lift the hips. Pause, then lower.",
  },
  {
    name: "Chair squat",
    intensity: "moderate",
    bodyArea: "lower_body",
    equipment: "none",
    loadsAreas: ["knee"],
    instructions: "Stand in front of a chair. Sit back until you touch it, then stand. Keep the knees tracking over the toes.",
  },
  {
    name: "Bird dog",
    intensity: "gentle",
    bodyArea: "core",
    equipment: "mat",
    loadsAreas: ["back"],
    instructions: "On hands and knees, reach one arm and the opposite leg. Hold, then switch. Keep the hips level.",
  },
  {
    name: "Standing calf raise",
    intensity: "moderate",
    bodyArea: "lower_body",
    equipment: "none",
    loadsAreas: ["ankle"],
    instructions: "Hold a wall for balance. Rise onto the balls of the feet, pause, and lower with control.",
  },
  {
    name: "Band row",
    intensity: "moderate",
    bodyArea: "upper_body",
    equipment: "band",
    loadsAreas: ["shoulder"],
    instructions: "Hold a band with the arms forward. Pull the elbows back and squeeze the shoulder blades. Return slowly.",
  },
  {
    name: "Dead bug",
    intensity: "gentle",
    bodyArea: "core",
    equipment: "mat",
    loadsAreas: [],
    instructions: "Lie on your back, arms up, knees bent. Lower one arm and the opposite leg, then return. Keep the lower back down.",
  },
];

module.exports = { STARTER };
