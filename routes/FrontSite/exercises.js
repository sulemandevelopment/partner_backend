const express = require("express");
const router = express.Router();
const { validateToken } = require("../../middlewares/AuthorizationMW");
const asyncMiddleware = require("../../middlewares/async");
const ctrl = require("../../controllers/FrontSite/exerciseController");

router.get("/", validateToken, asyncMiddleware(ctrl.list));
router.post("/:id/complete", validateToken, asyncMiddleware(ctrl.complete));

module.exports = router;
