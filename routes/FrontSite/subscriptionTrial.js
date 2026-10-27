const express = require("express");
const router = express.Router();
const { validateToken } = require("../../middlewares/AuthorizationMW");
const asyncMiddleware = require("../../middlewares/async");
const ctrl = require("../../controllers/FrontSite/subscriptionTrialController");

router.get("/", validateToken, asyncMiddleware(ctrl.getTrial));
router.post("/start", validateToken, asyncMiddleware(ctrl.startTrial));
router.post("/continue", validateToken, asyncMiddleware(ctrl.continueTrial));

module.exports = router;
