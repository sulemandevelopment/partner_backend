const ApiResponse = require("../../helper/ApiResponse");
const { Exercise } = require("../../models");
const { normalizeExercise } = require("../../helper/exerciseLibrary");

exports.list = async (req, res) => {
  const rows = await Exercise.findAll({ order: [["name", "ASC"]] });
  return res.json(ApiResponse("1", "Exercises", { exercises: rows }));
};

exports.create = async (req, res) => {
  const parsed = normalizeExercise(req.body);
  if (parsed.error) return res.json(ApiResponse("0", parsed.error, {}));
  const row = await Exercise.create(parsed.value);
  return res.json(ApiResponse("1", "Exercise saved", { exercise: row }));
};

exports.update = async (req, res) => {
  const row = await Exercise.findByPk(req.params.id);
  if (!row) return res.json(ApiResponse("0", "Exercise not found", {}));
  const parsed = normalizeExercise({ ...row.toJSON(), ...req.body });
  if (parsed.error) return res.json(ApiResponse("0", parsed.error, {}));
  await row.update(parsed.value);
  return res.json(ApiResponse("1", "Exercise updated", { exercise: row }));
};
