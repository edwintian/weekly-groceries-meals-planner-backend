const express = require("express");
const router = express.Router();
const {
  getRecipes,
  createRecipes,
  findAndUpdateRecipes
} = require("../controllers/Recipes.controller");

router.get("/", getRecipes);

router.post("/", createRecipes);

router.put("/", findAndUpdateRecipes);

module.exports = router;
