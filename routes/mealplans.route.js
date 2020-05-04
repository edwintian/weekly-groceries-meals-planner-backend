const express = require("express");
const router = express.Router();
const {
  deleteAndCreateMealPlan,
  getMealPlan
} = require("../controllers/mealplans.controller");
const {requireJsonContent, protectRoute} = require("../utils/helper");

router.get("/", protectRoute, getMealPlan);

router.post("/", protectRoute, requireJsonContent, deleteAndCreateMealPlan);

module.exports = router;
