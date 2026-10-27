const ApiResponse = require("../../helper/ApiResponse");
const { Exercise, ExerciseCompletion } = require("../../models");
const { filterExercises } = require("../../helper/exerciseLibrary");

function todayString() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

exports.list = async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.json(ApiResponse("0", "Unauthorized", {}));
  const rows = await Exercise.findAll({ order: [["name", "ASC"]] });
  const visible = filterExercises(
    rows.map((r) => r.toJSON()),
    {
      intensity: req.query.intensity,
      equipment: req.query.equipment,
      injuries: req.query.injuries,
    }
  );
  const done = await ExerciseCompletion.findAll({
    where: { userId, date: todayString() },
    attributes: ["exerciseId"],
  });
  const doneIds = new Set(done.map((d) => d.exerciseId));
  return res.json(
    ApiResponse("1", "Exercises", {
      exercises: visible.map((e) => ({ ...e, doneToday: doneIds.has(e.id) })),
    })
  );
};

exports.complete = async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return res.json(ApiResponse("0", "Unauthorized", {}));
  const exercise = await Exercise.findByPk(req.params.id);
  if (!exercise || exercise.published === false) {
    return res.json(ApiResponse("0", "Exercise not found", {}));
  }
  const date = todayString();
  const [row] = await ExerciseCompletion.findOrCreate({
    where: { userId, exerciseId: exercise.id, date },
    defaults: { userId, exerciseId: exercise.id, date },
  });
  return res.json(ApiResponse("1", "Marked done", { completion: row }));
};
