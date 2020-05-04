const mongoose = require("mongoose");

const recipesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  recipeName: {
    type: String,
    minlength: 3,
    required: true
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
