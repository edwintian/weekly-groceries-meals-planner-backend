const mongoose = require("mongoose");

const recipesSchema = new mongoose.Schema({
  userIdWithrecipeName: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  concatenatedIngredients: {
    type: String,
    required: true
  },
  IsBreakfast: {
    type: Boolean,
    required: true
  },
});

const Recipe = mongoose.model("Recipe", recipesSchema);
module.exports = Recipe;
