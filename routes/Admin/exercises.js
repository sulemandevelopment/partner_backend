const express = require("express");
const router = express.Router();
const { validateAdmin } = require("../../middlewares/ValidateAdmin");
const asyncMiddleware = require("../../middlewares/async");
const ctrl = require("../../controllers/Admin/exerciseAdminController");

router.get("/", validateAdmin, asyncMiddleware(ctrl.list));
router.post("/", validateAdmin, asyncMiddleware(ctrl.create));
router.patch("/:id", validateAdmin, asyncMiddleware(ctrl.update));

module.exports = router;
