const express = require("express");
const router = express.Router();
const {
  getGroceries,
  createGroceries,
  findAndUpdateGroceries
} = require("../controllers/groceries.controller");
const {requireJsonContent, protectRoute} = require("../utils/helper");

router.get("/", protectRoute, getGroceries);

router.post("/", protectRoute, requireJsonContent, createGroceries);

router.put("/", protectRoute, requireJsonContent, findAndUpdateGroceries);

module.exports = router;
