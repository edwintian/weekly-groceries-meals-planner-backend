const express = require("express");
const router = express.Router();
const {requireJsonContent, protectRoute} = require("../utils/helper");
const {
findUser,
validateAndCreateUser,
validateLoginAndCreateJWTCookie,
clearCookieAndDisplayLogoutMsg
} = require("../controllers/user.controller");

router.get("", protectRoute, findUser);

router.post("/register", requireJsonContent, validateAndCreateUser);

router.post("/login", requireJsonContent, validateLoginAndCreateJWTCookie);

router.post("/logout", requireJsonContent, clearCookieAndDisplayLogoutMsg);

const groceriesRouter = require("./groceries.route");
router.use("/:userId/groceries", groceriesRouter);

const recipesRouter = require("./recipes.route");
router.use("/:userId/recipes", recipesRouter);

const mealPlansRouter = require("./mealplans.route");
router.use("/:userId/mealplans", mealPlansRouter);

module.exports = router;
