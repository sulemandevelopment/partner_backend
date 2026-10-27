const express = require("express");
const router = express.Router();

const { validateToken } = require("../../middlewares/AuthorizationMW");
const asyncMiddleware = require("../../middlewares/async");
const ctrl = require("../../controllers/FrontSite/foodProfileController");

router.get("/", validateToken, asyncMiddleware(ctrl.getFoodProfile));
router.post("/check", validateToken, asyncMiddleware(ctrl.checkFood));

module.exports = router;
