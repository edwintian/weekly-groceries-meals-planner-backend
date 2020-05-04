const express = require("express");
const router = express.Router();
const {
  getGroceries,
  createGroceries,
  findAndUpdateGroceries
} = require("../controllers/groceries.controller");

router.get("/", getGroceries);

router.post("/", createGroceries);

router.put("/", findAndUpdateGroceries);

module.exports = router;
