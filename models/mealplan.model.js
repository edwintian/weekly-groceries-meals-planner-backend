const mongoose = require("mongoose");

const mealplansSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  concatenatedMeals: {
    type: String,
    required: true
  },
});

const mealplan = mongoose.model("mealplan", mealplansSchema);
module.exports = mealplan;
