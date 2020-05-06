const express = require("express");
const router = express.Router();
const {
  getGroceries,
  createGroceries,
  findAndUpdateGroceries,
  removeGroceries
} = require("../controllers/groceries.controller");
const {requireJsonContent, protectRoute} = require("../utils/helper");

router.get("/", protectRoute, getGroceries);

router.post("/", protectRoute, requireJsonContent, createGroceries);

router.put("/", protectRoute, requireJsonContent, findAndUpdateGroceries);

router.delete("/", protectRoute, requireJsonContent, removeGroceries);

module.exports = router;
