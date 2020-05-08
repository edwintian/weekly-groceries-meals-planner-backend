const express = require("express");
const router = express.Router();
const {
  getRecipes,
  createRecipes,
  findAndUpdateRecipes
} = require("../controllers/recipes.controller");
const {requireJsonContent, protectRoute} = require("../utils/helper");

router.get("/", protectRoute, getRecipes);

router.post("/", protectRoute, requireJsonContent, createRecipes);

router.put("/", protectRoute, requireJsonContent, findAndUpdateRecipes);

module.exports = router;
