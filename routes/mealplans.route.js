const express = require("express");
const router = express.Router();
const {
  deleteAndCreateMealPlan,
  getMealPlan
} = require("../controllers/mealplans.controller");

router.get("/", getMealPlan);

router.post("/", deleteAndCreateMealPlan);

module.exports = router;
